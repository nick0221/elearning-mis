export default function Logo({ className = 'h-10 w-auto' }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 180 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="E-Learning MIS"
        >
            <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="logo-grad-light" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a5b4fc" />
                    <stop offset="100%" stopColor="#c4b5fd" />
                </linearGradient>
            </defs>

            {/* Book spine */}
            <rect x="6" y="14" width="4" height="20" rx="1" fill="url(#logo-grad)" />

            {/* Book left page */}
            <path
                d="M10 14c0-1.1-.9-2-2-2H6v20h4V14z"
                fill="url(#logo-grad-light)"
                opacity="0.6"
            />

            {/* Book right page */}
            <path
                d="M14 12c-1.1 0-2 .9-2 2v20h4V12h-2z"
                fill="url(#logo-grad)"
            />

            {/* Graduation cap on book */}
            <path
                d="M10 12l8 4-8 4-8-4 8-4z"
                fill="url(#logo-grad)"
                opacity="0.9"
            />
            <path
                d="M10 12l8 4"
                stroke="url(#logo-grad-light)"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M4 14.5v4"
                stroke="url(#logo-grad)"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            {/* Tassel */}
            <path
                d="M18 16v2l-1.5 2"
                stroke="url(#logo-grad-light)"
                strokeWidth="1.2"
                strokeLinecap="round"
            />

            {/* E-Learning text */}
            <text x="28" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="14" fill="url(#logo-grad)" letterSpacing="0.5">
                E-Learning
            </text>

            {/* MIS text */}
            <text x="28" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="11" fill="url(#logo-grad-light)" letterSpacing="2.5">
                MANAGEMENT INFORMATION SYSTEM
            </text>
        </svg>
    );
}
