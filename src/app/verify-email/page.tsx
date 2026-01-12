import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

// 👇 THIS IS THE MISSING PIECE
export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
