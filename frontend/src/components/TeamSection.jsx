import React from 'react';
import { UserCheck, Award, GraduationCap } from 'lucide-react';

const TEAM_MEMBERS = [
  { name: 'Chayan Choudhury', id: '241001001103', role: 'Team Member' },
  { name: 'Soumik Dey', id: '241001001033', role: 'Team Member' },
  { name: 'Jyoti Roy', id: '241001001093', role: 'Team Member' },
  { name: 'Debnandan Kar', id: '241001001063', role: 'Team Member' },
  { name: 'Sharmistha Das', id: '241001001117', role: 'Team Member' },
];

export default function TeamSection() {
  return (
    <section id="project-team" className="team-section">
      <div className="section-header">
        <div className="section-badge">
          <GraduationCap size={14} />
          B.Tech CS / AI
        </div>
        <h2 className="section-title">Project Team</h2>
        <p className="section-subtitle">
          Department of Computer Science & Engineering / Artificial Intelligence
        </p>
      </div>

      <div className="team-grid">
        {TEAM_MEMBERS.map((member, idx) => (
          <div key={idx} className="team-card glass-card">
            <div className="member-avatar">
              <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="member-info">
              <h4 className="member-name">{member.name}</h4>
              <div className="member-id-pill">
                <span className="id-label">Student ID:</span>
                <span className="id-number">{member.id}</span>
              </div>
              <span className="member-role">
                <Award size={13} className="role-icon" />
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
