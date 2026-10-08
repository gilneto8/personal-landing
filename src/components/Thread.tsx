import { useEffect, useRef, useState } from 'react';

/*
  The saffron thread: one line in the left gutter that draws itself as you scroll,
  hooking into every section number ([data-thread]) on the way down.
  Its head sits a little below mid-viewport, so the line leads your reading.
*/
const GUTTER = 36;

export default function Thread() {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const head = useRef<SVGCircleElement>(null);
  const [geo, setGeo] = useState({ d: '', h: 0 });

  // build the path from anchor positions
  useEffect(() => {
    const build = () => {
      const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-thread]'));
      const h = document.documentElement.scrollHeight;
      let d = `M ${GUTTER} ${window.innerHeight * 0.55}`;
      for (const a of anchors) {
        const r = a.getBoundingClientRect();
        const ax = r.left - 10;
        const ay = r.top + window.scrollY + r.height / 2;
        d += ` L ${GUTTER} ${ay - 90}`;
        d += ` C ${GUTTER} ${ay - 30}, ${ax - 40} ${ay}, ${ax} ${ay}`;
        d += ` C ${ax - 40} ${ay}, ${GUTTER} ${ay + 30}, ${GUTTER} ${ay + 90}`;
      }
      d += ` L ${GUTTER} ${h - 40}`;
      setGeo({ d, h });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(document.body);
    // anchors move once fonts load and islands hydrate
    const t = setTimeout(build, 1200);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, []);

  // draw it with scroll
  useEffect(() => {
    const p = path.current;
    if (!p || !geo.d) return;
    const len = p.getTotalLength();
    // sample length → y so we can find "the point at this scroll depth"
    const N = 400;
    const samples: { l: number; y: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const l = (len * i) / N;
      samples.push({ l, y: p.getPointAtLength(l).y });
    }
    p.style.strokeDasharray = `${len}`;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const target = window.scrollY + window.innerHeight * 0.62;
      let l = len;
      for (const s of samples) if (s.y >= target) { l = s.l; break; }
      if (reduce) l = len;
      p.style.strokeDashoffset = `${len - l}`;
      const pt = p.getPointAtLength(l);
      head.current?.setAttribute('cx', `${pt.x}`);
      head.current?.setAttribute('cy', `${pt.y}`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [geo]);

  return (
    <svg
      ref={svg}
      aria-hidden
      className="hidden lg:block absolute top-0 left-0 w-full pointer-events-none z-0"
      style={{ height: geo.h }}
    >
      <path d={geo.d} fill="none" stroke="var(--ink-600)" strokeWidth="1" />
      <path ref={path} d={geo.d} fill="none" stroke="var(--sun-400)" strokeWidth="2" strokeLinecap="round" />
      <circle ref={head} r="5" fill="var(--sun-400)" style={{ filter: 'drop-shadow(0 0 8px var(--sun-400))' }} />
    </svg>
  );
}
