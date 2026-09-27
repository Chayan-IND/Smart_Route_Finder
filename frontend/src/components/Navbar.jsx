import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function Navbar() {
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="navbar-wrapper">
      <div className="container nav-container">
        <a href="#root-finder" className="nav-brand">
          <div className="nav-logo">
            <Cpu size={22} className="logo-icon" />
          </div>
          <div>
            <span className="brand-title">Smart Root Finder</span>
            <span className="brand-badge">Genetic Algorithm</span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#root-finder" className="nav-link">Root Finder</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#python-algorithm" className="nav-link">Python Code</a>
          <a href="#project-team" className="nav-link">Project Team</a>
        </nav>

        <div className="nav-status">
          <div 
            className={`status-pill ${backendStatus}`}
            title={backendStatus === 'online' ? 'Python Flask Backend is running' : 'Connecting to Python Flask Backend...'}
            onClick={checkHealth}
          >
            {backendStatus === 'online' && <CheckCircle2 size={14} className="status-icon" />}
            {backendStatus === 'offline' && <AlertCircle size={14} className="status-icon" />}
            {backendStatus === 'checking' && <RefreshCw size={14} className="status-icon spin" />}
            <span>Backend {backendStatus === 'online' ? 'Connected' : backendStatus === 'checking' ? 'Checking' : 'Offline'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
