import React from 'react';
import { Dna, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-left">
          <div className="footer-icon-box">
            <Dna size={18} />
          </div>
          <p className="footer-main-text">
            <strong>Genetic Algorithm Using Python | B.Tech AI Project</strong>
          </p>
        </div>

        <div className="footer-right">
          <span className="footer-subtext">Computer Science & Artificial Intelligence</span>
          <button 
            type="button" 
            className="scroll-top-btn" 
            onClick={scrollToTop}
            title="Back to Top"
          >
            <ArrowUp size={16} />
            Top
          </button>
        </div>
      </div>
    </footer>
  );
}
