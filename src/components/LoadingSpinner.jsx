import React from "react";

export default function LoadingSpinner({ size = 16, className = "" }) {
  return (
    <span
      className={`loadingSpinner ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}

