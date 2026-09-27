import React from 'react';
import { Users, Activity, Award, GitMerge, Dna, RefreshCw, Trophy } from 'lucide-react';

const GA_STEPS = [
  {
    name: 'Population',
    icon: Users,
    color: '#3b82f6',
    desc: 'An initial set of random candidate numbers (x values) is created across a chosen search interval.'
  },
  {
    name: 'Fitness',
    icon: Activity,
    color: '#06b6d4',
    desc: 'Each x value is plugged into the equation. The closer f(x) is to zero, the higher its fitness score.'
  },
  {
    name: 'Selection',
    icon: Award,
    color: '#10b981',
    desc: 'Candidates with better fitness are chosen using tournament selection to pass their traits to the next round.'
  },
  {
    name: 'Crossover',
    icon: GitMerge,
    color: '#8b5cf6',
    desc: 'Pairs of selected parents blend their values together to produce new offspring candidate roots.'
  },
  {
    name: 'Mutation',
    icon: Dna,
    color: '#ec4899',
    desc: 'Small random adjustments are occasionally applied to offspring to maintain diversity and explore new values.'
  },
  {
    name: 'New Generation',
    icon: RefreshCw,
    color: '#f59e0b',
    desc: 'The best individuals (elites) and new offspring form the next generation, replacing weaker candidates.'
  },
  {
    name: 'Best Root',
    icon: Trophy,
    color: '#10b981',
    desc: 'After repeating across generations, the population converges onto the optimal approximate root.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="section-header">
        <div className="section-badge">Algorithm Architecture</div>
        <h2 className="section-title">How the Genetic Algorithm Finds the Root</h2>
        <p className="section-subtitle">
          An evolutionary search strategy inspired by natural selection to find where f(x) = 0
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="pipeline-flow-card glass-card">
        <div className="pipeline-header-tag">
          <span>Flow Pipeline:</span>
          <strong>Population → Fitness → Selection → Crossover → Mutation → New Generation → Best Root</strong>
        </div>

        <div className="steps-grid">
          {GA_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="step-card">
                <div className="step-badge" style={{ backgroundColor: `${step.color}20`, color: step.color, borderColor: `${step.color}40` }}>
                  Step {idx + 1}
                </div>
                <div className="step-icon-wrapper" style={{ color: step.color }}>
                  <Icon size={26} />
                </div>
                <h4 className="step-title">{step.name}</h4>
                <p className="step-desc">{step.desc}</p>
                {idx < GA_STEPS.length - 1 && (
                  <div className="step-connector">→</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
