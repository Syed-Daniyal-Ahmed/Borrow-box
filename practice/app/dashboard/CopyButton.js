"use client";

export default function CopyButton({ url }) {
  return (
    <button
      onClick={async () => {
        const response = await fetch(url);
        const blob = await response.blob();

        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);

        alert("Copied!");
      }}
      className="px-3 py-1 bg-green-500 text-white rounded"
    >
      Copy QR
    </button>
  );
}