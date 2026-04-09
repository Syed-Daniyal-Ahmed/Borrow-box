"use client";
import { useState } from "react";
import { updateStatus } from "./actions";

const Status = ({ id, currentStatus }) => {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setEditing(false);

    await updateStatus(id, newStatus); // server action call
  };

  return (
    <div className="mt-2">
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          {status}
        </button>
      ) : (
        <select
          value={status}
          onChange={handleChange}
          className="border p-1 rounded"
        >
          <option value="Open">Open</option>
          <option value="Contacted">Contacted</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      )}
    </div>
  );
};

export default Status;