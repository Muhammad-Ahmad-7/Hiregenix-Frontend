// ─── Mock Verification API ───────────────────────────────────────────────────
// Replace each function body with a real fetch() call when your backend is ready.
// The call signatures and return types must stay the same.

import { livenessCheckApi } from "@/app/api/candidate/interview.api";
import toast from "react-hot-toast";

export async function mockLivenessCheck(
    _videoBlob: Blob,
    interviewId: string
) {
    const file = new File([_videoBlob], `liveness-check-${Date.now()}.webm`, { type: 'video/webm' });
    const res = await livenessCheckApi(file, interviewId);
    if (!res || res.status !== "Success") {
        toast.error("Liveness check failed — please try again.");
        return
    }
    toast.success("Liveness detection started!");
    return res.data;
}

export async function mockFaceVerification(
    _imageDataUrl: string
): Promise<{ faceVerified: boolean }> {
    // TODO: replace with:
    // const blob = await (await fetch(imageDataUrl)).blob();
    // const form = new FormData();
    // form.append('image', blob, 'face.jpg');
    // const res = await fetch('/api/verify/face', { method: 'POST', body: form });
    // return res.json();
    // console.log("imageDataUrl", _imageDataUrl);
    await new Promise((r) => setTimeout(r, 2000));
    return { faceVerified: Math.random() > 0.2 }; // ~80% pass for demo
}