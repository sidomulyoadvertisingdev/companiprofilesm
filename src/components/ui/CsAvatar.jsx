// Ilustrasi avatar Customer Service wanita (SVG) — "Hani",
// tampilan profesional, konsisten dengan brand orange Sidomulyo Advertising.
export function CsAvatar({ size = 56, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="csBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <clipPath id="csClip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath="url(#csClip)">
        <rect width="64" height="64" fill="url(#csBg)" />
        {/* bahu / blazer */}
        <path d="M9 64c0-10.5 10.3-19 23-19s23 8.5 23 19v3H9v-3z" fill="#ffffff" />
        <path d="M32 45l-7 9 7 4 7-4-7-9z" fill="#1d1d1f" />
        <path d="M32 45l-2.5 5h5l-2.5-5z" fill="#ea580c" />
        {/* leher */}
        <rect x="27.5" y="37" width="9" height="10" rx="4.5" fill="#f3c8a3" />
        {/* kerudung (hijab) */}
        <path d="M14 34c0-12 8-20 18-20s18 8 18 20c0 6-1 12-3 17-1-2-2-3-3-4 1-3 2-7 2-11 0-9-5-15-14-15s-14 6-14 15c0 4 1 8 2 11-1 1-2 2-3 4-2-5-3-11-3-17z" fill="#1f6b4f" />
        <path d="M14 34c1 9 3 16 5 20 2-3 4-4 7-4l-2-12c-4 1-7 1-10-4z" fill="#185a42" />
        <path d="M50 34c-1 9-3 16-5 20-2-3-4-4-7-4l2-12c4 1 7 1 10-4z" fill="#185a42" />
        <path d="M32 14c-9 0-15 6-15 15 0 4 1 8 2 11l2-12c1 9 5 15 11 15s10-6 11-15l2 12c1-3 2-7 2-11 0-9-6-15-15-15z" fill="#23815f" />
        {/* wajah */}
        <circle cx="32" cy="27" r="11.5" fill="#f8d2af" />
        {/* alis */}
        <path d="M25 26c1.2-1 3-1 4 0" stroke="#4a2f1d" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M35 26c1.2-1 3-1 4 0" stroke="#4a2f1d" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* mata */}
        <circle cx="27.5" cy="29" r="1.9" fill="#1d1d1f" />
        <circle cx="36.5" cy="29" r="1.9" fill="#1d1d1f" />
        <circle cx="28.1" cy="28.4" r="0.6" fill="#ffffff" />
        <circle cx="37.1" cy="28.4" r="0.6" fill="#ffffff" />
        {/* hidung */}
        <path d="M32 30.5l-1 2.4h2l-1-2.4z" fill="#e9b78c" />
        {/* senyum */}
        <path d="M27.5 34c1.5 1.8 7.5 1.8 9 0" stroke="#c06a45" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        {/* pipi */}
        <circle cx="24" cy="32.5" r="1.7" fill="#f6ab8c" opacity="0.7" />
        <circle cx="40" cy="32.5" r="1.7" fill="#f6ab8c" opacity="0.7" />
      </g>
    </svg>
  );
}

export default CsAvatar;
