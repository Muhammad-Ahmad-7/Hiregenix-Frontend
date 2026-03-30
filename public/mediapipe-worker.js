self.exports = {};
self.module = { exports: self.exports };

importScripts("/vision_bundle.js");

const mediapipe = self.mediapipe || self.exports;

let faceLandmarker;

// ── Liveness state ────────────────────────────────────────────────────────────
let blinkCount = 0;
let headLeft = false;
let headRight = false;
let eyesClosed = false; // tracks rising-edge for blink

// Blend shape scores for debug
let lastBlinkLeft = 0;
let lastBlinkRight = 0;

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
    try {
        const tasksVision = mediapipe.tasksVision || mediapipe;

        const vision = await tasksVision.FilesetResolver.forVisionTasks("/wasm");

        faceLandmarker = await tasksVision.FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "/face_landmarker.task",
                delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 2,
            outputFaceBlendshapes: true,
        });

        self.postMessage({ type: "READY" });
    } catch (error) {
        console.error("AI Worker init error:", error);
    }
}

init();

// ── Blink detection ───────────────────────────────────────────────────────────
// Returns true when BOTH eyes are sufficiently closed.
// Threshold lowered to 0.35 — works on most webcams.
function detectBlink(blendShapes) {
    const left = blendShapes.find(b => b.categoryName === "eyeBlinkLeft")?.score || 0;
    const right = blendShapes.find(b => b.categoryName === "eyeBlinkRight")?.score || 0;

    lastBlinkLeft = left;
    lastBlinkRight = right;

    return left > 0.35 && right > 0.35;
}

// ── Head-turn detection ───────────────────────────────────────────────────────
function detectHeadTurn(landmarks) {
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];
    const nose = landmarks[1];

    const center = (leftCheek.x + rightCheek.x) / 2;

    if (nose.x < center - 0.05) return "LEFT";  // tightened from 0.02 → less jitter
    if (nose.x > center + 0.05) return "RIGHT";

    return "CENTER";
}

// ── Message handler ───────────────────────────────────────────────────────────
self.onmessage = async (event) => {
    const { type, image, timestamp } = event.data;

    if (type !== "PROCESS_FRAME" || !faceLandmarker) return;

    const results = faceLandmarker.detectForVideo(image, timestamp);
    const faceCount = (results.faceLandmarks || []).length;

    let blinkDetected = false;
    let headDirection = "NONE";
    let blendShapes = [];

    if (faceCount === 1) {
        const landmarks = results.faceLandmarks[0];
        blendShapes = results.faceBlendshapes?.[0]?.categories || [];

        // ── Blink: count on rising edge (eyes close → re-open = 1 blink) ──
        const isBlinking = detectBlink(blendShapes);

        if (!isBlinking && eyesClosed) {
            // Eyes just re-opened — that completes one blink
            blinkCount++;
            blinkDetected = true;
        }

        eyesClosed = isBlinking;

        // ── Head turn ──
        headDirection = detectHeadTurn(landmarks);

        if (headDirection === "LEFT") headLeft = true;
        if (headDirection === "RIGHT") headRight = true;
    }

    const livenessPassed = blinkCount >= 2 && headLeft && headRight;

    self.postMessage({
        type: "RESULTS",
        metrics: {
            faceVisible: faceCount > 0,
            multipleFaces: faceCount > 1,
            blinkDetected,
            blinkCount,
            headLeft,
            headRight,
            headDirection,
            livenessPassed,
            // debug scores — remove after confirming blink detection works
            blinkScoreLeft: lastBlinkLeft,
            blinkScoreRight: lastBlinkRight,
            status:
                faceCount === 0 ? "NO_FACE"
                    : faceCount > 1 ? "MULTIPLE_FACES"
                        : livenessPassed ? "LIVE"
                            : "CHECKING",
        },
    });

    image.close();
};