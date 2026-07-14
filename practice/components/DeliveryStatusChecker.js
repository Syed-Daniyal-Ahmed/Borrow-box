"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DeliveryConfirmationDialog from "./DeliveryConfirmationDialog";

export default function DeliveryStatusChecker({ postId, postStatus, receiverEmail }) {
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Suppress hydration mismatch - only render logic after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run after component is mounted to prevent hydration mismatch
    if (!mounted) return;

    // Show delivery confirmation dialog ONLY if:
    // 1. Post status is "Delivered" (not "Confirmed")
    // 2. Current user is the receiver
    // 3. Delivery hasn't been confirmed yet (deliveryStatus !== "confirmed")
    if (
      postStatus === "Delivered" &&
      session?.user &&
      receiverEmail === session.user.email &&
      receiverEmail
    ) {
      setShowDialog(true);
    }
  }, [postStatus, session, receiverEmail, mounted]);

  // Don't render dialog until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <>
      <DeliveryConfirmationDialog
        postId={postId}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={(data) => {
          // Reload page after confirmation
          window.location.reload();
        }}
      />
    </>
  );
}
