export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="bulb-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Outer glow aura */}
            <circle cx="256" cy="200" r="140" fill="#fbbf24" opacity="0.08" />
            <circle cx="256" cy="200" r="110" fill="#fbbf24" opacity="0.12" />

            {/* Light rays */}
            <path d="M130 100 L106 74" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" opacity="0.5" filter="url(#bulb-glow)" />
            <path d="M256 60 L256 30" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" opacity="0.5" filter="url(#bulb-glow)" />
            <path d="M382 100 L406 74" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" opacity="0.5" filter="url(#bulb-glow)" />

            {/* Bulb glow */}
            <path d="M256 96 C168 96 124 176 138 240 C148 278 188 306 210 332 L302 332 C324 306 364 278 374 240 C388 176 344 96 256 96 Z" fill="#fbbf24" opacity="0.5" filter="url(#bulb-glow)" />

            {/* Bulb glass */}
            <path d="M256 96 C168 96 124 176 138 240 C148 278 188 306 210 332 L302 332 C324 306 364 278 374 240 C388 176 344 96 256 96 Z" fill="#fbbf24" opacity="0.85" />

            {/* Bulb highlight */}
            <path d="M210 120 C180 120 155 165 160 200 C165 225 180 240 195 250 L210 250 C195 230 185 200 200 160 C208 140 210 130 210 120 Z" fill="#fef9c3" opacity="0.5" />

            {/* Filament */}
            <path d="M244 180 L256 220 L268 180" stroke="#fef9c3" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
            <circle cx="256" cy="220" r="4" fill="#fef9c3" opacity="0.9" />

            {/* Base */}
            <rect x="210" y="332" width="92" height="64" rx="8" fill="#6b7280" opacity="0.9" />

            {/* Base ridge */}
            <rect x="210" y="378" width="92" height="3" rx="1.5" fill="#4b5563" opacity="0.7" />

            {/* Base cap */}
            <rect x="228" y="396" width="56" height="14" rx="7" fill="#4b5563" opacity="0.8" />
        </svg>
    );
}
