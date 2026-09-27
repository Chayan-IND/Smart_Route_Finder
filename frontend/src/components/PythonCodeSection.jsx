import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal } from 'lucide-react';

const PYTHON_SNIPPET = `# 1. INITIAL POPULATION
population = [random.uniform(search_min, search_max) for _ in range(pop_size)]

# 2. FITNESS FUNCTION (Closer to zero => Higher fitness)
def fitness(x):
    error = abs(f(x))
    return 1.0 / (1.0 + error)

# 3. TOURNAMENT SELECTION
def select_parent(pop, k=3):
    sample = random.sample(pop, k)
    return max(sample, key=fitness)

# 4. ARITHMETIC CROSSOVER
def crossover(p1, p2):
    alpha = random.random()
    return alpha * p1 + (1 - alpha) * p2

# 5. GAUSSIAN MUTATION
def mutate(x, rate=0.10):
    if random.random() < rate:
        return x + random.gauss(0, 0.5)
    return x

# 6. EVOLUTIONARY LOOP (Generations)
for gen in range(generations):
    new_pop = [max(population, key=fitness)] # Elitism: keep best
    while len(new_pop) < pop_size:
        p1, p2 = select_parent(population), select_parent(population)
        child = crossover(p1, p2)
        new_pop.append(mutate(child))
    population = new_pop

# 7. FINAL ROOT
best_root = max(population, key=fitness)`;

const GA_EXPLANATIONS = [
  {
    topic: 'Population',
    text: 'A collection of real numbers representing candidate solutions for x. Initialized randomly within the user domain.'
  },
  {
    topic: 'Fitness Function',
    text: 'Formula: Fitness = 1 / (1 + |f(x)|). If f(x) = 0 (exact root), fitness achieves maximum score of 1.0.'
  },
  {
    topic: 'Selection',
    text: 'Tournament selection chooses k candidates at random and selects the one with the highest fitness score.'
  },
  {
    topic: 'Crossover',
    text: 'Arithmetic combination blends two parent values (x1, x2) using a random weight alpha to create intermediate values.'
  },
  {
    topic: 'Mutation',
    text: 'Adds a small Gaussian perturbation with probability p to explore new values and escape local minimums.'
  },
  {
    topic: 'Final Root',
    text: 'The chromosome with the highest fitness score in the terminal generation is returned as the approximate root.'
  }
];

export default function PythonCodeSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="python-algorithm" className="python-code-section">
      <div className="section-header">
        <div className="section-badge">
          <Terminal size={14} />
          Source Implementation
        </div>
        <h2 className="section-title">Python Algorithm Implementation</h2>
        <p className="section-subtitle">
          Core Python logic running inside the Flask backend to calculate the root
        </p>
      </div>

      <div className="code-layout-grid">
        {/* Left: Code Box */}
        <div className="code-box-wrapper glass-card">
          <div className="code-box-header">
            <div className="code-lang-tag">
              <span className="code-dot red"></span>
              <span className="code-dot yellow"></span>
              <span className="code-dot green"></span>
              <span className="code-file-name">ga_solver.py</span>
            </div>
            <button
              type="button"
              className="copy-btn"
              onClick={handleCopy}
              title="Copy Python Code"
            >
              {copied ? (
                <>
                  <Check size={14} color="#10b981" />
                  <span style={{ color: '#10b981' }}>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <pre className="code-pre">
            <code className="code-content">{PYTHON_SNIPPET}</code>
          </pre>
        </div>

        {/* Right: Explanations */}
        <div className="code-explanations">
          <h3 className="expl-heading">
            <Code2 size={18} className="expl-icon" />
            Key Component Explanations
          </h3>

          <div className="expl-list">
            {GA_EXPLANATIONS.map((item, idx) => (
              <div key={idx} className="expl-card glass-card">
                <span className="expl-topic">{item.topic}</span>
                <p className="expl-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
