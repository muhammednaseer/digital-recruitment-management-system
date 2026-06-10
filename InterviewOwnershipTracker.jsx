import React, { useState, useEffect } from 'react';

const INITIAL_CANDIDATES = [
  { id: 1, name: 'John Doe', status: 'Approved', leadName: '', leadRole: '' },
  { id: 2, name: 'Jane Smith', status: 'Pending Review', leadName: '', leadRole: '' },
  { id: 3, name: 'Alice Johnson', status: 'Approved', leadName: '', leadRole: '' },
  { id: 4, name: 'Bob Brown', status: 'Rejected', leadName: '', leadRole: '' },
];

const InterviewOwnershipTracker = () => {
  const [candidates, setCandidates] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('HR');

  useEffect(() => {
    const savedData = localStorage.getItem('interviewCandidates');
    if (savedData) {
      setCandidates(JSON.parse(savedData));
    } else {
      setCandidates(INITIAL_CANDIDATES);
    }
  }, []);

  useEffect(() => {
    if (candidates.length > 0) {
      localStorage.setItem('interviewCandidates', JSON.stringify(candidates));
    }
  }, [candidates]);

  const handleAssign = (id) => {
    setCandidates(prev => prev.map(c =>
      c.id === id ? { ...c, leadName: newName, leadRole: newRole } : c
    ));
    setAssigningId(null);
    setNewName('');
    setNewRole('HR');
  };

  return (
    <div className="app-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');

        :root {
          --bg-navy: #0A192F;
          --accent-amber: #FFB347;
          --text-white: #E6F1FF;
          --text-gray: #8892B0;
          --card-bg: #112240;
          --border-color: #233554;
        }

        .app-wrapper {
          min-height: 100vh;
          background-color: var(--bg-navy);
          color: var(--text-white);
          font-family: 'DM Sans', sans-serif;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 1000px;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          margin-bottom: 30px;
          color: var(--accent-amber);
          border-bottom: 2px solid var(--accent-amber);
          padding-bottom: 10px;
        }

        .candidate-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 10px;
        }

        th {
          text-align: left;
          padding: 15px;
          color: var(--text-gray);
          font-weight: 500;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        tr {
          background-color: var(--card-bg);
          transition: transform 0.2s;
        }

        tr:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        td {
          padding: 20px 15px;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        td:first-child {
          border-left: 1px solid var(--border-color);
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          font-weight: 700;
        }

        td:last-child {
          border-right: 1px solid var(--border-color);
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-badge.approved {
          background-color: rgba(45, 201, 110, 0.2);
          color: #2DC96E;
          border: 1px solid #2DC96E;
        }

        .status-badge.pending-review {
          background-color: rgba(255, 179, 71, 0.2);
          color: var(--accent-amber);
          border: 1px solid var(--accent-amber);
        }

        .status-badge.rejected {
          background-color: rgba(255, 78, 78, 0.2);
          color: #FF4E4E;
          border: 1px solid #FF4E4E;
        }

        .unassigned {
          color: var(--text-gray);
          font-style: italic;
        }

        .assigned-info {
          display: flex;
          flex-direction: column;
        }

        .lead-name {
          font-weight: 600;
          color: var(--text-white);
        }

        .lead-role {
          font-size: 0.8rem;
          color: var(--accent-amber);
        }

        .assignment-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        input, select {
          background: var(--bg-navy);
          border: 1px solid var(--border-color);
          color: var(--text-white);
          padding: 8px;
          border-radius: 4px;
          font-family: 'DM Sans', sans-serif;
        }

        input:focus, select:focus {
          outline: none;
          border-color: var(--accent-amber);
        }

        button {
          background-color: var(--accent-amber);
          color: var(--bg-navy);
          border: none;
          padding: 10px 18px;
          border-radius: 4px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        button:hover:not(:disabled) {
          background-color: #E5A13F;
          transform: scale(1.05);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        button.cancel {
          background: transparent;
          color: var(--text-gray);
          border: 1px solid var(--text-gray);
          margin-left: 10px;
        }

        button.cancel:hover {
          color: var(--text-white);
          border-color: var(--text-white);
          background: transparent;
        }

        .button-group {
          display: flex;
          align-items: center;
        }
      `}</style>

      <div className="container">
        <h1>Interview Ownership Tracker</h1>
        <table className="candidate-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Status</th>
              <th>Interview Lead</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate.id}>
                <td>{candidate.name}</td>
                <td>
                  <span className={`status-badge ${candidate.status.toLowerCase().replace(' ', '-')}`}>
                    {candidate.status}
                  </span>
                </td>
                <td>
                  {assigningId === candidate.id ? (
                    <div className="assignment-form">
                      <input
                        type="text"
                        placeholder="Lead Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                      />
                      <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                        <option value="HR">HR</option>
                        <option value="Hiring Manager">Hiring Manager</option>
                        <option value="Team Lead">Team Lead</option>
                      </select>
                    </div>
                  ) : (
                    candidate.leadName ? (
                      <div className="assigned-info">
                        <span className="lead-name">{candidate.leadName}</span>
                        <span className="lead-role">{candidate.leadRole}</span>
                      </div>
                    ) : (
                      <span className="unassigned">Unassigned</span>
                    )
                  )}
                </td>
                <td>
                  {candidate.status === 'Approved' && (
                    assigningId === candidate.id ? (
                      <div className="button-group">
                        <button onClick={() => handleAssign(candidate.id)} disabled={!newName}>Confirm</button>
                        <button onClick={() => setAssigningId(null)} className="cancel">Cancel</button>
                      </div>
                    ) : (
                      !candidate.leadName && (
                        <button onClick={() => setAssigningId(candidate.id)}>Assign Lead</button>
                      )
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewOwnershipTracker;
