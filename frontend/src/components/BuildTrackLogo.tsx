import React from "react";

type BuildTrackLogoProps = {
  className?: string;
  size?: number;
};

export default function BuildTrackLogo({ className, size = 32 }: BuildTrackLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#F59E0B" />
      <path
        d="M24 18H36C41.5228 18 46 22.4772 46 28C46 33.5228 41.5228 38 36 38H24V18Z"
        fill="#111827"
      />
      <path
        d="M24 38H38C43.5228 38 48 42.4772 48 48C48 53.5228 43.5228 58 38 58H24V38Z"
        fill="#111827"
      />
      <rect x="27" y="22" width="7" height="12" rx="3.5" fill="#F59E0B" />
      <rect x="27" y="42" width="9" height="12" rx="4" fill="#F59E0B" />
    </svg>
  );
}
