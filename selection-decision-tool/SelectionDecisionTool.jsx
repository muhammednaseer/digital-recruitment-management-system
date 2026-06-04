
import React, { useState, useEffect } from 'react';

const SelectionDecisionTool = () => {
  const [candidates, setCandidates] = useState([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [candidateToReject, setCandidateToReject] = useState(null);

  // Initial mock data if localStorage is empty
  const initialCandidates = [
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'Senior Backend Engineer',
      department: 'Engineering',
      currentStage: 'Selection Decision',
      status: 'pending',
      interviewScore: 4.8,
      feedbackSummary: 'Excellent technical skills and great team fit.',
    },
    {
      id: '2',
      name: 'Bob Smith',
      role: 'Product Manager',
      department: 'Product',
      currentStage: 'Selection Decision',
      status: 'pending',
      interviewScore: 4.2,
      feedbackSummary: 'Strong product vision, slightly weak on technical specifications.',
    },
    {
      id: '3',
      name: 'Charlie Davis',
      role: 'Frontend Developer',
      department: 'Engineering',
      currentStage: 'Selection Decision',
      status: 'pending',
      interviewScore: 4.5,
      feedbackSummary: 'Great UI/UX sensibilities and solid React knowledge.',
    }
  ];

  useEffect(() => {
    const savedCandidates = localStorage.getItem('recruitment_candidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    } else {
      setCandidates(initialCandidates);
      localStorage.setItem('recruitment_candidates', JSON.stringify(initialCandidates));
    }
  }, []);

  const saveCandidates = (updatedCandidates) => {
    setCandidates(updatedCandidates);
    localStorage.setItem('recruitment_candidates', JSON.stringify(updatedCandidates));
  };

  const handleSelect = (id) => {
    const updatedCandidates = candidates.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'selected',
          currentStage: 'Offer Letter',
          decisionDate: new Date().toISOString()
        };
      }
      return c;
    });
    saveCandidates(updatedCandidates);
  };

  const initiateRejection = (candidate) => {
    setCandidateToReject(candidate);
    setShowRejectionModal(true);
  };

  const handleReject = () => {
    const updatedCandidates = candidates.map(c => {
      if (c.id === candidateToReject.id) {
        return {
          ...c,
          status: 'rejected',
          currentStage: 'Closed',
          rejectionReason: rejectionReason,
          decisionDate: new Date().toISOString()
        };
      }
      return c;
    });
    saveCandidates(updatedCandidates);
    setShowRejectionModal(false);
    setCandidateToReject(null);
    setRejectionReason('');
  };

  const resetData = () => {
    setCandidates(initialCandidates);
    localStorage.setItem('recruitment_candidates', JSON.stringify(initialCandidates));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Selection Decision</h1>
            <p className="mt-1 text-slate-600">Review candidates and make final hiring decisions.</p>
          </div>
          <button
            onClick={resetData}
            className="text-sm text-slate-500 hover:text-indigo-600 underline"
          >
            Reset Demo Data
          </button>
        </div>

        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                candidate.status === 'selected' ? 'border-green-200 ring-1 ring-green-100' :
                candidate.status === 'rejected' ? 'border-red-100 opacity-75' :
                'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-slate-800">{candidate.name}</h2>
                    {candidate.status === 'selected' && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                        Selected
                      </span>
                    )}
                    {candidate.status === 'rejected' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                        Rejected
                      </span>
                    )}
                    {candidate.status === 'pending' && (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                        Awaiting Decision
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 font-medium">{candidate.role} • {candidate.department}</p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-tight mb-1">Interview Score</p>
                      <p className="text-lg font-semibold text-slate-800">{candidate.interviewScore} / 5.0</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-tight mb-1">Current Stage</p>
                      <p className="text-lg font-semibold text-indigo-600">{candidate.currentStage}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tight mb-1">Feedback Summary</p>
                    <p className="text-sm text-slate-700 italic">"{candidate.feedbackSummary}"</p>
                  </div>

                  {candidate.status === 'rejected' && candidate.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-xs text-red-600 uppercase font-bold tracking-tight mb-1">Rejection Reason</p>
                      <p className="text-sm text-red-800">{candidate.rejectionReason}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col gap-3 justify-end min-w-[200px]">
                  {candidate.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleSelect(candidate.id)}
                        className="flex-1 py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm active:transform active:scale-95"
                      >
                        Select Candidate
                      </button>
                      <button
                        onClick={() => initiateRejection(candidate)}
                        className="flex-1 py-3 px-6 bg-white text-slate-700 font-bold border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors active:transform active:scale-95"
                      >
                        Reject
                      </button>
                    </>
                  ) : candidate.status === 'selected' ? (
                    <div className="text-center md:text-right">
                      <div className="inline-flex items-center text-green-600 font-bold mb-3">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Hiring Confirmed
                      </div>
                      <button
                        className="w-full py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
                        onClick={() => alert(`Navigating to ${candidate.currentStage} workflow...`)}
                      >
                        Proceed to {candidate.currentStage}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center md:text-right py-4">
                      <span className="text-slate-400 font-medium italic">Application Closed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reject Candidate</h3>
            <p className="text-slate-600 mb-6">
              You are about to reject <span className="font-semibold">{candidateToReject?.name}</span>. Please provide a reason for this decision (optional).
            </p>

            <label className="block text-sm font-medium text-slate-700 mb-2">Rejection Reason</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all mb-6"
              rows="4"
              placeholder="e.g. Lacks required technical depth in distributed systems..."
            ></textarea>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 py-3 px-4 bg-white text-slate-700 font-bold border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// For test environment, don't use export default if not using a bundler
if (typeof exports !== 'undefined') {
  module.exports = SelectionDecisionTool;
} else {
  window.SelectionDecisionTool = SelectionDecisionTool;
}
