// src/components/ProjectImage.tsx
"use client";

import { useState } from "react";

interface ProjectImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export default function ProjectImage({
  src,
  alt,
  className = "",
}: ProjectImageProps) {
  const [error, setError] = useState(false);

  // Si hay un error o no hay src, mostrar placeholder
  if (error || !src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center ${className}`}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sin imagen</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
}
