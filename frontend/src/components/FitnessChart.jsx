import React, { useState } from 'react';
import { TrendingUp, Activity, Layers } from 'lucide-react';

export default function FitnessChart({ history, totalGenerations }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [viewMode, setViewMode] = useState('fitness'); // 'fitness' | 'error'

  if (!history || history.length === 0) {
    return null;
  }

  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 45, left: 60 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Values based on viewMode
  const values = history.map(item => viewMode === 'fitness' ? item.fitness : item.error);
  
  let minY = Math.min(...values);
  let maxY = Math.max(...values);

  if (viewMode === 'fitness') {
    // Fitness is generally between 0 and 1
    minY = Math.max(0, Math.min(minY, 0.5));
    maxY = Math.min(1.0, Math.max(maxY, 1.0));
  } else {
    // Error mode
    minY = 0;
    maxY = Math.max(maxY, 0.05);
  }

  // Prevent divide by zero if horizontal line
  if (maxY === minY) {
    maxY += 0.1;
  }

  const getX = (index) => {
    if (history.length === 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (history.length - 1)) * chartWidth;
  };

  const getY = (val) => {
    const clampedVal = Math.min(Math.max(val, minY), maxY);
    const ratio = (clampedVal - minY) / (maxY - minY);
    return padding.top + chartHeight - ratio * chartHeight;
  };

  // Generate SVG path string
  const points = history.map((item, idx) => ({
    x: getX(idx),
    y: getY(viewMode === 'fitness' ? item.fitness : item.error),
    data: item
  }));

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  // Fill area gradient
  const areaD = `${pathD} L ${points[points.length - 1].x},${padding.top + chartHeight} L ${points[0].x},${padding.top + chartHeight} Z`;

  // Y-axis ticks (4 ticks)
  const yTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = minY + ratio * (maxY - minY);
    return {
      val: val.toFixed(viewMode === 'fitness' ? 3 : 4),
      y: padding.top + chartHeight - ratio * chartHeight
    };
  });

  // X-axis sample ticks
  const xStep = Math.max(1, Math.floor(history.length / 5));
  const xTicks = [];
  for (let i = 0; i < history.length; i += xStep) {
    xTicks.push({
      label: `Gen ${history[i].generation}`,
      x: getX(i)
    });
  }
  // Ensure last generation tick is included
  if (history.length > 1 && (history.length - 1) % xStep !== 0) {
    xTicks.push({
      label: `Gen ${history[history.length - 1].generation}`,
      x: getX(history.length - 1)
    });
  }

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <div className="chart-title-area">
          <div className="chart-icon-box">
            <TrendingUp size={18} />
          </div>
          <div>
            <h4 className="chart-title">
              {viewMode === 'fitness' ? 'Generation vs Best Fitness' : 'Generation vs Error |f(x)|'}
            </h4>
            <span className="chart-subtitle">
              {viewMode === 'fitness' 
                ? 'Shows fitness converging towards 1.0 (exact root)' 
                : 'Shows error minimizing towards 0.0'}
            </span>
          </div>
        </div>

        <div className="chart-toggles">
          <button
            className={`toggle-btn ${viewMode === 'fitness' ? 'active' : ''}`}
            onClick={() => setViewMode('fitness')}
          >
            <Activity size={14} />
            Fitness
          </button>
          <button
            className={`toggle-btn ${viewMode === 'error' ? 'active' : ''}`}
            onClick={() => setViewMode('error')}
          >
            <Layers size={14} />
            Error
          </button>
        </div>
      </div>

      <div className="chart-svg-container">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="chart-svg"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="fitnessGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={padding.left + chartWidth}
                y2={tick.y}
                stroke="rgba(255, 255, 255, 0.07)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#9ca3af"
                fontFamily="var(--font-mono)"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* X Ticks */}
          {xTicks.map((tick, i) => (
            <text
              key={i}
              x={tick.x}
              y={svgHeight - 12}
              textAnchor="middle"
              fontSize="11"
              fill="#9ca3af"
              fontFamily="var(--font-mono)"
            >
              {tick.label}
            </text>
          ))}

          {/* Area Fill */}
          <path d={areaD} fill="url(#fitnessGradient)" />

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover interactive vertical line and points */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={padding.top + chartHeight}
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Transparent interactive columns for hover */}
          {points.map((pt, i) => {
            const colWidth = chartWidth / points.length;
            return (
              <rect
                key={i}
                x={pt.x - colWidth / 2}
                y={padding.top}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint(pt)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredPoint && (
          <div 
            className="chart-tooltip"
            style={{
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100}%`
            }}
          >
            <div className="tooltip-gen">Generation {hoveredPoint.data.generation}</div>
            <div className="tooltip-item">
              <span>Best Root (x):</span>
              <strong>{hoveredPoint.data.best_root}</strong>
            </div>
            <div className="tooltip-item">
              <span>Fitness:</span>
              <strong>{hoveredPoint.data.fitness}</strong>
            </div>
            <div className="tooltip-item">
              <span>Error |f(x)|:</span>
              <strong>{hoveredPoint.data.error}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="chart-footer-stats">
        <div className="stat-pill">
          <span className="stat-pill-label">Initial Gen 1:</span>
          <span className="stat-pill-value">
            {viewMode === 'fitness' ? history[0].fitness : history[0].error}
          </span>
        </div>
        <div className="stat-arrow">→</div>
        <div className="stat-pill highlight">
          <span className="stat-pill-label">Final Gen {history[history.length - 1].generation}:</span>
          <span className="stat-pill-value">
            {viewMode === 'fitness' 
              ? history[history.length - 1].fitness 
              : history[history.length - 1].error}
          </span>
        </div>
      </div>
    </div>
  );
}
