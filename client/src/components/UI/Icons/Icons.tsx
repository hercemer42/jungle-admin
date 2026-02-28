import "./Icons.css";

function JungleLogo() {
  return (
    <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      {/* stem */}
      <path
        d="M20 34 C19 28 18 24 16 18"
        stroke="#7a9a50"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* monstera leaf body */}
      <path
        d="M16 18 C12 14 4 12 3 5 C6 6 10 4 14 3 C16 2 20 2 23 4 C28 7 30 12 30 16 C30 20 27 24 22 25 C19 26 17 22 16 18 Z"
        fill="#7abf5a"
      />
      {/* leaf holes */}
      <ellipse
        cx="12"
        cy="10"
        rx="2.5"
        ry="2"
        transform="rotate(-20 12 10)"
        fill="#3a5f2c"
      />
      <ellipse
        cx="21"
        cy="8"
        rx="2.5"
        ry="2"
        transform="rotate(15 21 8)"
        fill="#3a5f2c"
      />
      <ellipse
        cx="24"
        cy="16"
        rx="2"
        ry="2.5"
        transform="rotate(10 24 16)"
        fill="#3a5f2c"
      />
      {/* leaf splits */}
      <path
        d="M8 15 C10 13 13 14 16 18"
        stroke="#3a5f2c"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M26 21 C24 20 20 20 16 18"
        stroke="#3a5f2c"
        strokeWidth="1.2"
        fill="none"
      />
      {/* center vein */}
      <path
        d="M14 4 C15 8 16 14 16 18"
        stroke="#5aa040"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <div className="loading">
      <svg
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        className="loading-spinner"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#7abf5a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 45"
        />
      </svg>
    </div>
  );
}

export { JungleLogo, LoadingSpinner };
