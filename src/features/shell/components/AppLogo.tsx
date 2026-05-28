export function AppLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="5"
        width="150"
        height="150"
        rx="28"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M28 52 L55 72 L28 92"
        stroke="var(--color-primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polygon
        points="72,32 72,82 84,72 96,92 102,88 90,68 102,60"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="72" cy="32" r="5" fill="var(--color-primary)" />
    </svg>
  );
}
