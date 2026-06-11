import { useEffect, useRef } from 'react';
import anime from 'animejs';

export function useAnime(
    params: anime.AnimeParams,
    deps: React.DependencyList = []
) {
    const ref = useRef<HTMLElement>(null);
    const animationRef = useRef<anime.AnimeInstance | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        animationRef.current = anime({
            targets: ref.current,
            ...params,
        });
        return () => {
            animationRef.current?.pause();
            animationRef.current = null;
        };
    }, deps);

    return ref;
}
