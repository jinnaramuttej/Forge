import React, { useState } from 'react';
import { motion } from 'framer-motion';

type TimeRange = '6m' | '12m' | 'all';

interface ChartPoint {
  month: string;
  cash: number; // in thousands
  burn: number;
  projected?: boolean;
}

const datasets: Record<TimeRange, { points: ChartPoint[]; description: string }> = {
  '6m': {
    description: 'Actual cash depletion & revenue inflows over the past 6 months.',
    points: [
      { month: 'May', cash: 380, burn: 22 },
      { month: 'Jun', cash: 358, burn: 21 },
      { month: 'Jul', cash: 339, burn: 20 },
      { month: 'Aug', cash: 320, burn: 19.5 },
      { month: 'Sep', cash: 302, burn: 19.2 },
      { month: 'Oct (Now)', cash: 284.5, burn: 19.2 },
    ],
  },
  '12m': {
    description: 'Projected cash trajectory over the next 12 months at current growth & burn pace.',
    points: [
      { month: 'Oct (Now)', cash: 284.5, burn: 19.2 },
      { month: 'Nov', cash: 268.0, burn: 19.0, projected: true },
      { month: 'Dec', cash: 252.5, burn: 18.8, projected: true },
      { month: 'Jan', cash: 238.0, burn: 18.5, projected: true },
      { month: 'Feb', cash: 224.2, burn: 18.2, projected: true },
      { month: 'Mar', cash: 211.0, burn: 18.0, projected: true },
      { month: 'Apr', cash: 198.5, burn: 17.8, projected: true },
      { month: 'May', cash: 186.8, burn: 17.5, projected: true },
      { month: 'Jun', cash: 175.5, burn: 17.2, projected: true },
      { month: 'Jul', cash: 165.0, burn: 17.0, projected: true },
      { month: 'Aug', cash: 155.0, burn: 16.8, projected: true },
      { month: 'Sep', cash: 145.5, burn: 16.5, projected: true },
    ],
  },
  'all': {
    description: 'Full startup cash history from Seed closing to present day.',
    points: [
      { month: 'Jan 26', cash: 450, burn: 24 },
      { month: 'Mar 26', cash: 412, burn: 23 },
      { month: 'May 26', cash: 380, burn: 22 },
      { month: 'Jul 26', cash: 339, burn: 20 },
      { month: 'Sep 26', cash: 302, burn: 19.2 },
      { month: 'Oct 26', cash: 284.5, burn: 19.2 },
    ],
  },
};

export default function RunwayChart() {
  const [range, setRange] = useState<TimeRange>('12m');
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const currentData = datasets[range];
  const points = currentData.points;

  // SVG dimensions
  const width = 760;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const minCash = 100;
  const maxCash = 500;

  // Coordinate mapper
  const getCoords = (p: ChartPoint, i: number) => {
    const x = paddingX + (i / (points.length - 1)) * (width - paddingX * 2);
    const normalized = (p.cash - minCash) / (maxCash - minCash);
    const y = height - paddingY - normalized * (height - paddingY * 2);
    return { x, y };
  };

  const coords = points.map((p, i) => getCoords(p, i));

  // Build SVG path
  const pathD = coords.reduce((acc, curr, i) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    // gentle bezier curves
    const prev = coords[i - 1];
    const cpx1 = prev.x + (curr.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (curr.x - prev.x) / 2;
    const cpy2 = curr.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }, '');

  // Fill area under curve
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;

  const activePoint = activePointIndex !== null ? points[activePointIndex] : points[0];
  const activeCoord = activePointIndex !== null ? coords[activePointIndex] : null;

  return (
    <section aria-labelledby="runway-chart-heading" className="space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2
            id="runway-chart-heading"
            className="font-display text-lg sm:text-xl font-medium tracking-tight text-foreground"
          >
            Runway & Cash Movement
          </h2>
          <p className="text-xs text-foreground-faint mt-0.5">
            {currentData.description}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 self-start sm:self-auto rounded-full border border-border/80 bg-surface/60 p-1">
          {[
            { id: '6m', label: 'Past 6M' },
            { id: '12m', label: '12M Forecast' },
            { id: 'all', label: 'Full History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setRange(tab.id as TimeRange);
                setActivePointIndex(null);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                range === tab.id
                  ? 'bg-foreground text-background shadow-2xs'
                  : 'text-foreground-soft hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Chart Surface */}
      <div className="rounded-2xl border border-border/70 bg-surface/50 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Top Active Stat Overlay */}
        <div className="flex items-baseline justify-between border-b border-border/50 pb-3 mb-4">
          <div className="flex items-baseline gap-3">
            <span className="text-xs text-foreground-faint uppercase tracking-wider font-medium">
              {activePointIndex !== null ? activePoint.month : 'Current Balance'}
            </span>
            <span className="font-display text-2xl font-medium text-foreground">
              ${activePoint.cash.toFixed(1)}K
            </span>
            {activePoint.projected && (
              <span className="rounded-full bg-[var(--color-finance)]/10 px-2 py-0.5 text-[0.68rem] text-[var(--color-finance)] font-medium">
                Forecasted
              </span>
            )}
          </div>
          <span className="text-xs text-foreground-faint hidden sm:inline">
            Net Burn: ${activePoint.burn.toFixed(1)}K/mo
          </span>
        </div>

        {/* SVG Visualization */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-48 sm:h-56 select-none"
            style={{ overflow: 'visible' }}
          >
            {/* Subtle grid lines */}
            <line
              x1={paddingX}
              y1={paddingY}
              x2={width - paddingX}
              y2={paddingY}
              stroke="rgba(22, 19, 15, 0.06)"
              strokeDasharray="4 4"
            />
            <line
              x1={paddingX}
              y1={height / 2}
              x2={width - paddingX}
              y2={height / 2}
              stroke="rgba(22, 19, 15, 0.06)"
              strokeDasharray="4 4"
            />
            <line
              x1={paddingX}
              y1={height - paddingY}
              x2={width - paddingX}
              y2={height - paddingY}
              stroke="rgba(22, 19, 15, 0.1)"
            />

            {/* Gradient Fill under curve */}
            <defs>
              <linearGradient id="financeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-finance)" stopOpacity="0.12" />
                <stop offset="100%" stopColor="var(--color-finance)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path d={areaD} fill="url(#financeFill)" />

            {/* Main Curve Line */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-finance)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {coords.map((c, i) => {
              const isHovered = activePointIndex === i;
              const isCurrent = points[i].month.includes('Now');
              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setActivePointIndex(i)}
                  onMouseLeave={() => setActivePointIndex(null)}
                >
                  {/* Invisible wide hit area for easy hover */}
                  <circle cx={c.x} cy={c.y} r={16} fill="transparent" />

                  {/* Visible point */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isHovered ? 5.5 : isCurrent ? 4.5 : 3}
                    fill="var(--color-surface)"
                    stroke="var(--color-finance)"
                    strokeWidth={isHovered ? 2.5 : 1.8}
                    className="transition-all duration-150"
                  />

                  {/* Month Label */}
                  <text
                    x={c.x}
                    y={height - 8}
                    textAnchor="middle"
                    className={`text-[0.68rem] ${
                      isHovered
                        ? 'fill-foreground font-medium'
                        : isCurrent
                        ? 'fill-foreground font-medium'
                        : 'fill-foreground-faint'
                    }`}
                  >
                    {points[i].month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
