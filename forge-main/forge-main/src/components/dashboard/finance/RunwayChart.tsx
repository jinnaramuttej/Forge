import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForge } from '../../../context/ForgeContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type TimeRange = '6m' | '12m' | 'all';

interface ChartPoint {
  month: string;
  cash: number; // in thousands
  burn: number;
  projected?: boolean;
}

export default function RunwayChart() {
  const { finance } = useForge();
  const [range, setRange] = useState<TimeRange>('12m');

  const currentCash = parseFloat(finance.cash.replace(/[^0-9.-]+/g, '')) || 0;
  const currentBurn = parseFloat(finance.monthlyBurn.replace(/[^0-9.-]+/g, '')) || 0;

  // Generate dynamic data based on current cash and burn
  const datasets: Record<TimeRange, { points: ChartPoint[]; description: string }> = {
    '6m': {
      description: 'Actual cash depletion & revenue inflows over the past 6 months.',
      points: [
        { month: 'May', cash: currentCash + currentBurn * 5, burn: currentBurn },
        { month: 'Jun', cash: currentCash + currentBurn * 4, burn: currentBurn },
        { month: 'Jul', cash: currentCash + currentBurn * 3, burn: currentBurn },
        { month: 'Aug', cash: currentCash + currentBurn * 2, burn: currentBurn },
        { month: 'Sep', cash: currentCash + currentBurn, burn: currentBurn },
        { month: 'Oct', cash: currentCash, burn: currentBurn },
      ],
    },
    '12m': {
      description: 'Projected cash trajectory over the next 12 months at current growth & burn pace.',
      points: [
        { month: 'Oct', cash: currentCash, burn: currentBurn },
        { month: 'Nov', cash: Math.max(0, currentCash - currentBurn), burn: currentBurn, projected: true },
        { month: 'Dec', cash: Math.max(0, currentCash - currentBurn * 2), burn: currentBurn, projected: true },
        { month: 'Jan', cash: Math.max(0, currentCash - currentBurn * 3), burn: currentBurn, projected: true },
        { month: 'Feb', cash: Math.max(0, currentCash - currentBurn * 4), burn: currentBurn, projected: true },
        { month: 'Mar', cash: Math.max(0, currentCash - currentBurn * 5), burn: currentBurn, projected: true },
        { month: 'Apr', cash: Math.max(0, currentCash - currentBurn * 6), burn: currentBurn, projected: true },
        { month: 'May', cash: Math.max(0, currentCash - currentBurn * 7), burn: currentBurn, projected: true },
        { month: 'Jun', cash: Math.max(0, currentCash - currentBurn * 8), burn: currentBurn, projected: true },
        { month: 'Jul', cash: Math.max(0, currentCash - currentBurn * 9), burn: currentBurn, projected: true },
        { month: 'Aug', cash: Math.max(0, currentCash - currentBurn * 10), burn: currentBurn, projected: true },
        { month: 'Sep', cash: Math.max(0, currentCash - currentBurn * 11), burn: currentBurn, projected: true },
      ],
    },
    'all': {
      description: 'Full startup cash history from Seed closing to present day.',
      points: [
        { month: 'Jan 26', cash: currentCash + currentBurn * 9, burn: currentBurn },
        { month: 'Mar 26', cash: currentCash + currentBurn * 7, burn: currentBurn },
        { month: 'May 26', cash: currentCash + currentBurn * 5, burn: currentBurn },
        { month: 'Jul 26', cash: currentCash + currentBurn * 3, burn: currentBurn },
        { month: 'Sep 26', cash: currentCash + currentBurn, burn: currentBurn },
        { month: 'Oct 26', cash: currentCash, burn: currentBurn },
      ],
    },
  };

  const currentData = datasets[range];
  const points = currentData.points;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-border/80 bg-surface/90 backdrop-blur-md p-3 shadow-lg">
          <div className="text-xs text-foreground-faint font-medium mb-1">{label}</div>
          <div className="font-display text-lg font-medium text-foreground">
            ${data.cash.toFixed(1)}K
          </div>
          <div className="text-xs text-foreground-soft mt-1">
            Net Burn: ${data.burn.toFixed(1)}K/mo
          </div>
          {data.projected && (
            <div className="mt-2 inline-block rounded-full bg-[var(--color-finance)]/10 px-2 py-0.5 text-[0.68rem] text-[var(--color-finance)] font-medium">
              Forecasted
            </div>
          )}
        </div>
      );
    }
    return null;
  };

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
              onClick={() => setRange(tab.id as TimeRange)}
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
        {/* Recharts Visualization */}
        <div className="w-full h-56 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={points}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-finance)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-finance)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-foreground-faint)', fontSize: 11 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-foreground-faint)', fontSize: 11 }}
                tickFormatter={(value) => `$${value}K`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="cash"
                stroke="var(--color-finance)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCash)"
                activeDot={{ r: 6, fill: 'var(--color-surface)', stroke: 'var(--color-finance)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
