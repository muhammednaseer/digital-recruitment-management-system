import React, { useState, useEffect } from 'react';

const REVIEWERS = [
  { id: 1, name: 'Sarah Chen', role: 'HR Manager', initials: 'SC' },
  { id: 2, name: 'James Okafor', role: 'Hiring Manager', initials: 'JO' },
  { id: 3, name: 'Priya Nair', role: 'Technical Lead', initials: 'PN' },
  { id: 4, name: 'Marcus Webb', role: 'Department Head', initials: 'MW' },
  { id: 5, name: 'Leila Ahmadi', role: 'Legal & Compliance', initials: 'LA' },
];

const CVReviewWorkflow = () => {
  const [step, setStep] = useState(1);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [emails, setEmails] = useState({});
  const [loadingStatus, setLoadingStatus] = useState({});

  const toggleReviewer = (reviewerId) => {
    setSelectedReviewers((prev) =>
      prev.includes(reviewerId)
        ? prev.filter((id) => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  const handleRouteCV = async () => {
    // Initialize loading states before switching steps
    const newLoadingStatus = {};
    selectedReviewers.forEach(id => {
      newLoadingStatus[id] = true;
    });
    setLoadingStatus(newLoadingStatus);

    setStep(2);
    const selected = REVIEWERS.filter((r) => selectedReviewers.includes(r.id));

    selected.forEach(async (reviewer) => {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: `Draft a short routing notification email to ${reviewer.name} (${reviewer.role}) asking them to review the attached CV for [Position].`,
              },
            ],
          }),
        });
        const data = await response.json();
        const content = data.content[0].text;
        setEmails((prev) => ({ ...prev, [reviewer.id]: content }));
      } catch (error) {
        console.error('Error calling Anthropic API:', error);
        setEmails((prev) => ({ ...prev, [reviewer.id]: 'Failed to generate email.' }));
      } finally {
        setLoadingStatus((prev) => ({ ...prev, [reviewer.id]: false }));
      }
    });
  };

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');

        :root {
          --dark-navy: #0A192F;
          --warm-amber: #FFB347;
          --off-white: #F8F9FA;
          --slate: #8892B0;
          --transition-speed: 0.4s;
        }

        .app-container {
          font-family: 'DM Sans', sans-serif;
          background-color: var(--dark-navy);
          color: var(--off-white);
          min-height: 100vh;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          margin-bottom: 40px;
          color: var(--warm-amber);
        }

        .progress-indicator {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 20px;
          color: var(--slate);
        }

        .step-content {
          width: 100%;
          max-width: 800px;
          animation: fadeInSlide var(--transition-speed) ease-out;
        }

        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reviewer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .reviewer-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .reviewer-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--warm-amber);
        }

        .reviewer-card.selected {
          border-color: var(--warm-amber);
          background: rgba(255, 179, 71, 0.1);
        }

        .avatar {
          width: 48px;
          height: 48px;
          background: var(--warm-amber);
          color: var(--dark-navy);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 16px;
          font-size: 1.2rem;
        }

        .reviewer-info .name {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .reviewer-info .role {
          color: var(--slate);
          font-size: 0.9rem;
        }

        .checkbox-wrapper {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid var(--slate);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .checkbox.checked {
          background: var(--warm-amber);
          border-color: var(--warm-amber);
          animation: checkScale 0.2s ease-in-out;
        }

        @keyframes checkScale {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .checkbox span {
          color: var(--dark-navy);
          font-size: 14px;
          font-weight: bold;
        }

        .route-button, .back-button {
          background: var(--warm-amber);
          color: var(--dark-navy);
          border: none;
          padding: 16px 32px;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .route-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .route-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 179, 71, 0.3);
        }

        .confirmation-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }

        .confirmation-card {
          background: rgba(255, 255, 255, 0.05);
          border-left: 4px solid var(--warm-amber);
          padding: 24px;
          border-radius: 0 8px 8px 0;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .reviewer-identity .name {
          font-weight: 700;
          margin-right: 8px;
        }

        .reviewer-identity .role {
          color: var(--slate);
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.pending {
          background: rgba(255, 179, 71, 0.2);
          color: var(--warm-amber);
        }

        .status-badge.complete {
          background: rgba(76, 175, 80, 0.2);
          color: #81C784;
        }

        .email-content {
          background: rgba(0, 0, 0, 0.2);
          padding: 16px;
          border-radius: 4px;
          font-size: 0.95rem;
          line-height: 1.6;
          white-space: pre-wrap;
          font-family: 'DM Sans', sans-serif;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid var(--warm-amber);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="progress-indicator">
        Step {step} of 2
      </div>

      {step === 1 ? (
        <div className="step-content" key="step1">
          <h1>Select Reviewers</h1>
          <div className="reviewer-grid">
            {REVIEWERS.map((reviewer) => (
              <div
                key={reviewer.id}
                className={`reviewer-card ${selectedReviewers.includes(reviewer.id) ? 'selected' : ''}`}
                onClick={() => toggleReviewer(reviewer.id)}
              >
                <div className="avatar">{reviewer.initials}</div>
                <div className="reviewer-info">
                  <div className="name">{reviewer.name}</div>
                  <div className="role">{reviewer.role}</div>
                </div>
                <div className="checkbox-wrapper">
                  <div className={`checkbox ${selectedReviewers.includes(reviewer.id) ? 'checked' : ''}`}>
                    {selectedReviewers.includes(reviewer.id) && <span>✓</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="route-button"
            disabled={selectedReviewers.length === 0}
            onClick={handleRouteCV}
          >
            Route CV
          </button>
        </div>
      ) : (
        <div className="step-content" key="step2">
          <h1>Route & Confirm</h1>
          <div className="confirmation-panel">
            {REVIEWERS.filter(r => selectedReviewers.includes(r.id)).map((reviewer) => (
              <div key={reviewer.id} className="confirmation-card">
                <div className="card-header">
                  <div className="reviewer-identity">
                    <span className="name">{reviewer.name}</span>
                    <span className="role">({reviewer.role})</span>
                  </div>
                  <span className={`status-badge ${loadingStatus[reviewer.id] ? 'pending' : 'complete'}`}>
                    {loadingStatus[reviewer.id] ? 'Generating...' : 'Pending Review'}
                  </span>
                </div>
                <div className="email-content">
                  {loadingStatus[reviewer.id] ? (
                    <div className="spinner"></div>
                  ) : (
                    <pre>{emails[reviewer.id]}</pre>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="back-button" onClick={() => setStep(1)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default CVReviewWorkflow;
