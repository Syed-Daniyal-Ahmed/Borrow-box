"use client";

import { useState } from "react";
import DeliveryConfirmationDialog from "./DeliveryConfirmationDialog";

export default function DeliveryConfirmationContainer({ delivery, userEmail }) {
  const [showConfirmation, setShowConfirmation] = useState(delivery.status === "Delivered");
  const [statusMessage, setStatusMessage] = useState("");
  const [postStatus, setPostStatus] = useState(delivery.status);

  const handleConfirmation = (data) => {
    // Update local state and show message
    setStatusMessage(data.message);
    setPostStatus(data.newStatus || "Confirmed");

    // Close dialog after 2 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      window.location.reload();
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-gray-400";
      case "Contacted":
        return "bg-blue-500";
      case "Shipped":
        return "bg-yellow-500";
      case "Delivered":
        return "bg-purple-500";
      case "Confirmed":
        return "bg-green-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{delivery.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              From: <span className="font-medium text-gray-700">{delivery.name}</span>
            </p>
          </div>
          <span
            className={`px-3 py-1 text-white rounded-full text-sm font-semibold ${getStatusColor(
              postStatus
            )}`}
          >
            {postStatus}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">{delivery.post}</p>

        {/* Image */}
        {delivery.image && (
          <img
            src={delivery.image}
            alt="Delivery Item"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        {/* Status Message */}
        {statusMessage && (
          <div className="p-3 rounded-lg mb-4 bg-green-100 text-green-700 text-sm font-medium">
            ✓ {statusMessage}
          </div>
        )}

        {/* Action Buttons */}
        {postStatus === "Delivered" && !statusMessage && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowConfirmation(true)}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition"
            >
              ✓ Confirm Delivery
            </button>
          </div>
        )}

        {/* Confirmed - No more actions */}
        {postStatus === "Confirmed" && statusMessage && (
          <div className="p-4 rounded-lg bg-green-50 border-2 border-green-500 text-center">
            <p className="text-green-700 font-semibold">
              ✓ Delivery Confirmed - Payment Processed (COD)
            </p>
          </div>
        )}
      </div>

      {/* Delivery Confirmation Dialog - Only for this post */}
      <DeliveryConfirmationDialog
        postId={delivery._id.toString()}
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmation}
      />
    </>
  );
}
