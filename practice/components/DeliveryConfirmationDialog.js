"use client";

import { useState } from "react";

export default function DeliveryConfirmationDialog({
  postId,
  isOpen,
  onClose,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleConfirm = async (confirmed) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/delivery/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          confirmed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error processing request");
        return;
      }

      setMessage(data.message);

      // Close dialog immediately after successful confirmation
      if (data.success) {
        setTimeout(() => {
          onClose();
          onConfirm(data);
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to process delivery confirmation");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Confirm Delivery
        </h2>

        <p className="text-gray-600 mb-6">
          Have you received the item in good condition?
        </p>

        {message && (
          <div
            className={`p-3 rounded mb-6 text-sm ${
              message.includes("Error") || message.includes("Failed")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => handleConfirm(false)}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "No, Not Received"}
          </button>
          <button
            onClick={() => handleConfirm(true)}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Yes, Confirmed"}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Payment will be processed as Cash on Delivery after confirmation.
        </p>
      </div>
    </div>
  );
}
