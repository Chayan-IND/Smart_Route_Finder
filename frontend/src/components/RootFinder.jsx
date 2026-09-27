import React, { useState } from 'react';
import { Play, Sparkles, Sliders, AlertOctagon, HelpCircle, Loader2 } from 'lucide-react';
import ResultCard from './ResultCard';

const PRESET_EQUATIONS = [
  { label: 'x² - 4', value: 'x^2 - 4', expected: 'Roots: ±2.0' },
  { label: 'x² - 5', value: 'x^2 - 5', expected: 'Roots: ±2.236' },
  { label: 'x³ - 2x - 5', value: 'x^3 - 2*x - 5', expected: 'Root: ~2.094' },
  { label: 'cos(x) - x', value: 'cos(x) - x', expected: 'Root: ~0.739' },
  { label: 'x² + 3x - 10', value: 'x^2 + 3*x - 10', expected: 'Roots: 2.0, -5.0' },
];

export default function RootFinder() {
  const [equation, setEquation] = useState('x^2 - 4');
  const [populationSize, setPopulationSize] = useState(60);
  const [generations, setGenerations] = useState(100);
  const [mutationRate, setMutationRate] = useState(0.1);
  const [searchMin, setSearchMin] = useState(-10);
  const [searchMax, setSearchMax] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [result, setResult] = useState(null);

  const handlePresetClick = (presetVal) => {
    setEquation(presetVal);
    setErrorMsg(null);
  };

  const handleFindRoot = async (e) => {
    if (e) e.preventDefault();
    if (!equation.trim()) {
      setErrorMsg('Please enter a mathematical equation.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/find-root', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equation: equation.trim(),
          population_size: Number(populationSize),
          generations: Number(generations),
          mutation_rate: Number(mutationRate),
          search_min: Number(searchMin),
          search_max: Number(searchMax),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to solve equation.');
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Could not connect to the Python backend. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="root-finder" className="root-finder-section">
      <div className="section-header">
        <div className="section-badge">
          <Sparkles size={14} />
          B.Tech AI Project Demo
        </div>
        <h1 className="section-title">Smart Root Finder</h1>
        <p className="section-subtitle">
          Find an approximate root of an equation using a Genetic Algorithm
        </p>
      </div>

      <div className="finder-card glass-card">
        <form onSubmit={handleFindRoot} className="finder-form">
          {/* Main Equation Input */}
          <div className="form-group main-input-group">
            <label className="form-label" htmlFor="equation-input">
              <span>Mathematical Equation <code className="label-code">f(x) = 0</code></span>
              <span className="hint">Supports ^, ², ³, sin, cos, tan, sqrt, exp, log</span>
            </label>
            <div className="equation-input-wrap">
              <span className="equation-prefix">f(x) =</span>
              <input
                id="equation-input"
                type="text"
                className="form-input equation-input"
                placeholder="e.g. x^2 - 4 or x² - 5"
                value={equation}
                onChange={(e) => {
                  setEquation(e.target.value);
                  setErrorMsg(null);
                }}
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="presets-container">
            <span className="presets-label">Quick Presets:</span>
            <div className="preset-chips">
              {PRESET_EQUATIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-chip ${equation === preset.value ? 'active' : ''}`}
                  onClick={() => handlePresetClick(preset.value)}
                  title={preset.expected}
                >
                  <span className="preset-text">{preset.label}</span>
                  <span className="preset-hint">{preset.expected}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Parameter Inputs */}
          <div className="params-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="pop-size">
                <span>Population Size</span>
                <span className="hint">(default: 60)</span>
              </label>
              <input
                id="pop-size"
                type="number"
                min="10"
                max="300"
                className="form-input"
                value={populationSize}
                onChange={(e) => setPopulationSize(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="generations-input">
                <span>Number of Generations</span>
                <span className="hint">(default: 100)</span>
              </label>
              <input
                id="generations-input"
                type="number"
                min="10"
                max="300"
                className="form-input"
                value={generations}
                onChange={(e) => setGenerations(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mutation-rate">
                <span>Mutation Rate</span>
                <span className="hint">(default: 0.10)</span>
              </label>
              <input
                id="mutation-rate"
                type="number"
                step="0.01"
                min="0.01"
                max="1.0"
                className="form-input"
                value={mutationRate}
                onChange={(e) => setMutationRate(e.target.value)}
              />
            </div>
          </div>

          {/* Toggle Search Range */}
          <div className="advanced-toggle-row">
            <button
              type="button"
              className="toggle-advanced-btn"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Sliders size={14} />
              {showAdvanced ? 'Hide Search Range' : 'Adjust Search Domain [Min X, Max X]'}
            </button>
          </div>

          {showAdvanced && (
            <div className="params-grid domain-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="search-min">Search Min (X Min)</label>
                <input
                  id="search-min"
                  type="number"
                  className="form-input"
                  value={searchMin}
                  onChange={(e) => setSearchMin(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="search-max">Search Max (X Max)</label>
                <input
                  id="search-max"
                  type="number"
                  className="form-input"
                  value={searchMax}
                  onChange={(e) => setSearchMax(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="error-alert">
              <AlertOctagon size={18} className="error-icon" />
              <div className="error-content">
                <strong>Calculation Error:</strong> {errorMsg}
                <div className="error-tip">Tip: Ensure standard math format like <code>x^2 - 4</code> or <code>cos(x) - x</code> using variable <code>x</code>.</div>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="form-actions">
            <button
              id="find-root-btn"
              type="submit"
              className="btn btn-primary btn-find-root"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Running Genetic Algorithm...
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" />
                  Find Root
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Section */}
      {result && (
        <div id="results-anchor" className="results-wrapper">
          <ResultCard result={result} />
        </div>
      )}
    </section>
  );
}
