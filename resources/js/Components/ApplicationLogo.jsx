export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Light rays */}
            <path d="M130 100 L106 74" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
            <path d="M256 60 L256 30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
            <path d="M382 100 L406 74" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.4" />

            {/* Bulb */}
            <path d="M256 96 C168 96 124 176 138 240 C148 278 188 306 210 332 L302 332 C324 306 364 278 374 240 C388 176 344 96 256 96 Z" fill="currentColor" opacity="0.92" />

            {/* Filament */}
            <path d="M244 180 L256 220 L268 180" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.35" />

            {/* Base */}
            <rect x="210" y="332" width="92" height="64" rx="8" fill="currentColor" opacity="0.85" />

            {/* Base ridge */}
            <rect x="210" y="378" width="92" height="3" rx="1.5" fill="currentColor" opacity="0.45" />

            {/* Base cap */}
            <rect x="228" y="396" width="56" height="14" rx="7" fill="currentColor" opacity="0.7" />
        </svg>
    );
}
