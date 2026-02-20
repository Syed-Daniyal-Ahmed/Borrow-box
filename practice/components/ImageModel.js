"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageModal({ src, alt }) {
  const [open, setOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      {/* Thumbnail */}
      <div
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          width={500}
          height={300}
          alt={alt}
          className="rounded-lg"
        />
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div className="relative max-w-4xl w-full p-4">
            <Image
              src={src}
              width={1200}
              height={800}
              alt={alt}
              className="rounded-lg object-contain max-h-[90vh] w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}