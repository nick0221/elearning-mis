export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Book spine */}
            <rect x="160" y="190" width="50" height="240" rx="12" fill="currentColor" />

            {/* Book left page */}
            <path d="M210 200c0-16-13-28-28-28H160v248h50V200z" fill="currentColor" opacity="0.5" />

            {/* Book right page */}
            <path d="M300 170c-16 0-28 13-28 28v240h50V170h-22z" fill="currentColor" />

            {/* Graduation cap */}
            <path d="M246 130l110 56-110 55-110-55 110-56z" fill="currentColor" opacity="0.9" />
            <path d="M246 130l110 56" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <path d="M125 185v56" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.8" />

            {/* Tassel */}
            <path d="M356 186v30l-24 28" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        </svg>
    );
}
