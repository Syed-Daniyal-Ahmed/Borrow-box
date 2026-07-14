"use client";

import { useState } from "react";

export default function DeliveryControlPanel({
  postId,
  currentStatus,
  receiverEmail,
  deliveryStatus,
  paymentStatus,
  deliveryAttempts,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showReceiverForm, setShowReceiverForm] = useState(false);
  const [receiversEmail, setReceiversEmail] = useState(receiverEmail || "");

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    setMessage("");

    try {
      // If updating to "Shipped", require receiver email
      if (newStatus === "Shipped" && !receiversEmail) {
        setMessage("Receiver email is required before shipping");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/delivery/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          newStatus,
          receiverEmail: newStatus === "Shipped" ? receiversEmail : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error updating status");
        return;
      }

      setMessage(data.message);
      setShowReceiverForm(false);

      // Refresh page after 1.5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to update status");
    } finally {
      setLoading(false);
    }
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

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "confirmed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-semibold text-lg mb-4">Delivery Management</h3>

      {/* Current Status Display */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-700">Post Status:</span>
          <span className={`px-3 py-1 text-white rounded-full text-sm font-semibold ${getStatusColor(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>

        {receiverEmail && (
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Receiver:</span> {receiverEmail}
          </div>
        )}

        {deliveryAttempts > 0 && (
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Delivery Attempts:</span> {deliveryAttempts}
          </div>
        )}

        {paymentStatus === "completed" && (
          <div className="text-sm text-green-600 font-medium">
            ✓ Payment Completed (COD)
          </div>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-3 rounded mb-4 text-sm ${
            message.includes("Error") || message.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Receiver Email Input (for Shipped status) */}
      {showReceiverForm && currentStatus === "Contacted" && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Receiver Email Address:
          </label>
          <input
            type="email"
            value={receiversEmail}
            onChange={(e) => setReceiversEmail(e.target.value)}
            placeholder="receiver@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate("Shipped")}
              disabled={loading || !receiversEmail}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
            >
              {loading ? "Shipping..." : "Mark as Shipped"}
            </button>
            <button
              onClick={() => setShowReceiverForm(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Show "Ship Item" button only in Contacted status */}
        {currentStatus === "Contacted" && !showReceiverForm && (
          <button
            onClick={() => setShowReceiverForm(true)}
            disabled={loading}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400 font-medium"
          >
            {loading ? "Processing..." : "📦 Ship Item"}
          </button>
        )}

        {/* Show "Deliver Item" button only when Shipped */}
        {currentStatus === "Shipped" && (
          <button
            onClick={() => handleStatusUpdate("Delivered")}
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 font-medium"
          >
            {loading ? "Processing..." : "📍 Mark as Delivered"}
          </button>
        )}

        {/* Delivery Status Info */}
        {(currentStatus === "Shipped" || currentStatus === "Delivered") && (
          <div className={`p-3 rounded bg-gray-100 text-sm font-medium ${getDeliveryStatusColor(deliveryStatus)}`}>
            Delivery Status: {deliveryStatus === "pending" ? "⏳ Awaiting receiver confirmation" : deliveryStatus === "confirmed" ? "✓ Confirmed" : "✗ Failed"}
          </div>
        )}

        {/* Confirmed Status - Both parties confirmed */}
        {currentStatus === "Confirmed" && (
          <div className="p-3 rounded bg-green-100 text-green-700 text-sm font-semibold border-2 border-green-500">
            ✓ Delivery Confirmed by Both Parties
          </div>
        )}

        {/* Reopen for discussion if needed */}
        {(currentStatus === "Shipped" || currentStatus === "Delivered") && (
          <button
            onClick={() => handleStatusUpdate("Contacted")}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 text-sm"
          >
            {loading ? "Processing..." : "Reopen for Discussion"}
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-gray-700 border border-blue-200">
        <p className="font-semibold mb-2">📋 Delivery Flow:</p>
        <ul className="space-y-1">
          <li>1. <strong>Contacted</strong> → Discuss terms</li>
          <li>2. <strong>Shipped</strong> → Enter receiver email & ship item</li>
          <li>3. <strong>Delivered</strong> → Mark as delivered</li>
          <li>4. <strong>Confirmed</strong> → Receiver confirms delivery ✓</li>
          <li>5. <strong>Payment</strong> → COD payment processed</li>
        </ul>
      </div>
    </div>
  );
}
