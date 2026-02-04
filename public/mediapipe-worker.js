// public/mediapipe-worker.js
self.exports = {};
self.module = { exports: self.exports };

importScripts("/vision_bundle.js");

const mediapipe = self.mediapipe || self.exports;
let faceLandmarker;

async function init() {
    try {
        const tasksVision = mediapipe.tasksVision || mediapipe;
        const vision = await tasksVision.FilesetResolver.forVisionTasks("/wasm");

        faceLandmarker = await tasksVision.FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "/face_landmarker.task",
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numFaces: 2 // Detect up to 2 to catch "multiple people" warnings
        });

        self.postMessage({ type: 'READY' });
    } catch (error) {
        console.error("AI Worker Error:", error);
    }
}

init();

self.onmessage = async (event) => {
    const { type, image, timestamp } = event.data;

    if (type === 'PROCESS_FRAME' && faceLandmarker) {
        const results = faceLandmarker.detectForVideo(image, timestamp);

        // LIGHTWEIGHT ANALYSIS
        const faceCount = (results.faceLandmarks || []).length;

        self.postMessage({
            type: 'RESULTS',
            metrics: {
                faceVisible: faceCount > 0,
                multipleFaces: faceCount > 1,
                status: faceCount === 1 ? "OK" : "ALERT"
            }
        });

        image.close(); // Immediate memory cleanup
    }
};