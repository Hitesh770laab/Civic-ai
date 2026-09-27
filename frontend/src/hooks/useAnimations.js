import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for Intersection Observer based scroll reveal animations.
 * Elements get class "visible" added when they scroll into view.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          el.classList.add('visible');
          // once revealed, stop observing
          observer.unobserve(el);
        }
      },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/**
 * Hook to batch-observe multiple elements by a shared class name.
 * Call once in the parent and it'll animate all matching children.
 */
export function useScrollRevealAll(className = 'scroll-reveal', options = {}) {
  useEffect(() => {
    const elements = document.querySelectorAll(`.${className}:not(.visible)`);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: options.threshold ?? 0.1, rootMargin: options.rootMargin ?? '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [className]);
}

/**
 * Mouse parallax hook - returns style with transform based on cursor position.
 */
export function useMouseParallax(intensity = 15) {
  const [style, setStyle] = useState({});

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * intensity;
    const y = (e.clientY / window.innerHeight - 0.5) * intensity;
    setStyle({
      transform: `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`,
      transition: 'transform 0.1s ease-out',
    });
  }, [intensity]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return style;
}

/**
 * Counter animation hook - counts up from 0 to target value.
 */
export function useCountUp(target, duration = 2000, startOnVisible = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnVisible);
  const ref = useRef(null);

  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (startOnVisible && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [startOnVisible]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return [count, ref, start];
}

/**
 * Scroll progress hook - returns 0 to 1 based on page scroll.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
