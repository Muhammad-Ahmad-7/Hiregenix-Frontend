// ─── Mock Verification API ───────────────────────────────────────────────────
// Replace each function body with a real fetch() call when your backend is ready.
// The call signatures and return types must stay the same.

import { livenessCheckApi, verifyCandidateIdentityApi } from "@/app/api/candidate/interview.api";
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

export async function faceVerification(
    _imageDataUrl: string
): Promise<{ faceVerified: boolean }> {
    // TODO: replace with:
    const blob = await (await fetch(_imageDataUrl)).blob();
    const file = new File([blob], `face-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
    const res = await verifyCandidateIdentityApi(file);
    if (!res || res.status !== "Success") {
        toast.error("Face verification failed — please try again.");
        return { faceVerified: false }
    }
    if (res.data === undefined) {
        toast.error("Face verification failed — please try again.");
        return { faceVerified: false }
    }
    const { similarity } = res.data.verificationResult;
    if (similarity > 90) {
        toast.success("Face verification successful!");
        return { faceVerified: true };
    }
    toast.error("Face verification failed — please try again.");
    return { faceVerified: false };
}