export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Book body */}
            <rect x="150" y="230" width="212" height="220" rx="14" fill="currentColor" opacity="0.9" />

            {/* Pages visible at top edge */}
            <rect x="164" y="220" width="184" height="16" rx="4" fill="currentColor" opacity="0.4" />
            <rect x="158" y="225" width="196" height="12" rx="3" fill="currentColor" opacity="0.25" />

            {/* Spine line */}
            <rect x="150" y="230" width="18" height="220" rx="5" fill="currentColor" opacity="0.7" />

            {/* Mortarboard dome */}
            <path d="M170 230 C170 140 342 140 342 230 Z" fill="currentColor" opacity="0.85" />

            {/* Cap board */}
            <rect x="120" y="218" width="272" height="18" rx="6" fill="currentColor" />

            {/* Tassel */}
            <circle cx="392" cy="227" r="8" fill="currentColor" opacity="0.7" />
            <path d="M392 235 L392 270" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
            <path d="M392 270 L376 280" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
        </svg>
    );
}
