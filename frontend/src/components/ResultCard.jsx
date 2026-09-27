import React from 'react';
import { Target, CheckCircle, Zap, Hash, BarChart3, AlertTriangle } from 'lucide-react';
import FitnessChart from './FitnessChart';

export default function ResultCard({ result }) {
  if (!result) return null;

  const {
    raw_equation,
    parsed_equation,
    approximate_root,
    f_at_root,
    error,
    fitness,
    total_generations,
    population_size,
    history
  } = result;

  const isExactRoot = error < 1e-4;

  return (
    <div className="glass-card result-card">
      <div className="result-card-header">
        <div className="result-badge-group">
          <span className={`result-status-tag ${isExactRoot ? 'success' : 'approx'}`}>
            <CheckCircle size={14} />
            {isExactRoot ? 'Converged Root Found' : 'Approximate Root Found'}
          </span>
          <span className="equation-tag">
            f(x) = {raw_equation}
          </span>
        </div>

        <div className="result-title-row">
          <div>
            <h3 className="result-heading">Genetic Algorithm Result</h3>
            <p className="result-subtext">The algorithm completed optimization through natural selection & crossover</p>
          </div>
        </div>
      </div>

      {/* Primary Highlights Grid */}
      <div className="metrics-grid">
        <div className="metric-box primary">
          <div className="metric-icon-box root">
            <Target size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Approximate Root (x)</span>
            <span className="metric-value root-val">{approximate_root}</span>
            <span className="metric-sub">Value where f(x) ≈ 0</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-box fitness">
            <Zap size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Fitness Score</span>
            <span className="metric-value">{fitness}</span>
            <span className="metric-sub">Formula: 1 / (1 + |f(x)|)</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-box error">
            <BarChart3 size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Residual Error |f(x)|</span>
            <span className="metric-value">{error}</span>
            <span className="metric-sub">f({approximate_root}) = {f_at_root}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-box gen">
            <Hash size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Generations Completed</span>
            <span className="metric-value">{total_generations}</span>
            <span className="metric-sub">Population: {population_size} chromosomes</span>
          </div>
        </div>
      </div>

      {/* Verification notice */}
      <div className="verification-box">
        <div className="verif-item">
          <span className="verif-label">Equation Evaluated:</span>
          <code className="verif-code">{parsed_equation}</code>
        </div>
        <div className="verif-item">
          <span className="verif-label">Substitution Check:</span>
          <span className="verif-calc">
            f({approximate_root}) = <strong>{f_at_root}</strong> (Error: {error})
          </span>
        </div>
      </div>

      {/* Convergence Line Chart */}
      <FitnessChart history={history} totalGenerations={total_generations} />
    </div>
  );
}
