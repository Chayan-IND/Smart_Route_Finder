import React from 'react';
import Navbar from './components/Navbar';
import RootFinder from './components/RootFinder';
import HowItWorks from './components/HowItWorks';
import PythonCodeSection from './components/PythonCodeSection';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="container main-content">
        {/* Section 1: Main Smart Root Finder */}
        <RootFinder />

        {/* Section 2: How It Works */}
        <HowItWorks />

        {/* Section 3: Python GA Implementation */}
        <PythonCodeSection />

        {/* Section 4: Project Team */}
        <TeamSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
