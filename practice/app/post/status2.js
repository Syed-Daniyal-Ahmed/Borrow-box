"use client";

const Status = ({ currentStatus }) => {
  const status = currentStatus || "Open";

  const getColor = () => {
    switch (status) {
      case "Open":
        return "bg-gray-400";
      case "Contacted":
        return "bg-blue-500";
      case "Shipped":
        return "bg-yellow-500";
      case "Delivered":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded">
      <span className={`w-2 h-2 rounded-full ${getColor()}`}></span>
      <span className="text-sm">{status}</span>
    </div>
  );
};

export default Status;