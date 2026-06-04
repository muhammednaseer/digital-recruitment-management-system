import React, { useState } from 'react';

const RatingField = ({ label, value, onChange, error }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
              value === num
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
};

const SectionCard = ({ title, ratingValue, ratingOnChange, commentValue, commentOnChange, error }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">{title}</h3>
      <RatingField label="Rating (1-5)" value={ratingValue} onChange={ratingOnChange} error={error} />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Comments</label>
        <textarea
          value={commentValue}
          onChange={(e) => commentOnChange(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          rows="3"
          placeholder={`Specific feedback for ${title.toLowerCase()}...`}
        ></textarea>
      </div>
    </div>
  );
};

const SuccessScreen = ({ onReset }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-3">Feedback Submitted!</h2>
      <p className="text-slate-600 mb-10 max-w-md mx-auto">
        The interview evaluation has been successfully recorded in the system.
      </p>
      <button
        onClick={onReset}
        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm active:transform active:scale-95"
      >
        Submit Another Evaluation
      </button>
    </div>
  );
};

const InterviewFeedbackForm = () => {
  const initialState = {
    candidateName: '',
    position: '',
    interviewDate: '',
    interviewerName: '',
    interviewRound: '',
    evaluations: {
      technical: { rating: 0, comments: '' },
      communication: { rating: 0, comments: '' },
      problemSolving: { rating: 0, comments: '' },
      culturalFit: { rating: 0, comments: '' },
      leadership: { rating: 0, comments: '' },
    },
    overallRecommendation: '',
    overallComments: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleEvaluationChange = (section, type, value) => {
    setFormData(prev => ({
      ...prev,
      evaluations: {
        ...prev.evaluations,
        [section]: { ...prev.evaluations[section], [type]: value }
      }
    }));
    if (errors[`eval_${section}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`eval_${section}`];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.candidateName.trim()) newErrors.candidateName = 'Candidate name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.interviewDate) newErrors.interviewDate = 'Interview date is required';
    if (!formData.interviewerName.trim()) newErrors.interviewerName = 'Interviewer name is required';
    if (!formData.interviewRound) newErrors.interviewRound = 'Interview round is required';

    Object.keys(formData.evaluations).forEach(section => {
      if (formData.evaluations[section].rating === 0) {
        newErrors[`eval_${section}`] = 'Rating is required';
      }
    });

    if (!formData.overallRecommendation) newErrors.overallRecommendation = 'Recommendation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <SuccessScreen onReset={resetForm} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interview Feedback Form</h1>
          <p className="mt-2 text-lg text-slate-600">Please provide detailed feedback for the candidate evaluation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={(e) => handleInputChange('candidateName', e.target.value)}
                  className={`w-full p-2.5 border rounded-md outline-none transition-all ${errors.candidateName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                  placeholder="Full Name"
                />
                {errors.candidateName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.candidateName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position Applied For</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className={`w-full p-2.5 border rounded-md outline-none transition-all ${errors.position ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                  placeholder="e.g. Senior Software Engineer"
                />
                {errors.position && <p className="mt-1 text-xs text-red-500 font-medium">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interview Date</label>
                <input
                  type="date"
                  value={formData.interviewDate}
                  onChange={(e) => handleInputChange('interviewDate', e.target.value)}
                  className={`w-full p-2.5 border rounded-md outline-none transition-all ${errors.interviewDate ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                />
                {errors.interviewDate && <p className="mt-1 text-xs text-red-500 font-medium">{errors.interviewDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interviewer Name</label>
                <input
                  type="text"
                  value={formData.interviewerName}
                  onChange={(e) => handleInputChange('interviewerName', e.target.value)}
                  className={`w-full p-2.5 border rounded-md outline-none transition-all ${errors.interviewerName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                  placeholder="Your Name"
                />
                {errors.interviewerName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.interviewerName}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Interview Round</label>
                <select
                  value={formData.interviewRound}
                  onChange={(e) => handleInputChange('interviewRound', e.target.value)}
                  className={`w-full p-2.5 border rounded-md outline-none transition-all ${errors.interviewRound ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                >
                  <option value="">Select Round</option>
                  <option value="Phone Screen">Phone Screen</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural Fit">Cultural Fit</option>
                  <option value="Final">Final</option>
                </select>
                {errors.interviewRound && <p className="mt-1 text-xs text-red-500 font-medium">{errors.interviewRound}</p>}
              </div>
            </div>
          </div>

          {/* Evaluation Sections */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Evaluation Sections</h2>

            <SectionCard
              title="Technical Skills"
              ratingValue={formData.evaluations.technical.rating}
              ratingOnChange={(val) => handleEvaluationChange('technical', 'rating', val)}
              commentValue={formData.evaluations.technical.comments}
              commentOnChange={(val) => handleEvaluationChange('technical', 'comments', val)}
              error={errors.eval_technical}
            />

            <SectionCard
              title="Communication"
              ratingValue={formData.evaluations.communication.rating}
              ratingOnChange={(val) => handleEvaluationChange('communication', 'rating', val)}
              commentValue={formData.evaluations.communication.comments}
              commentOnChange={(val) => handleEvaluationChange('communication', 'comments', val)}
              error={errors.eval_communication}
            />

            <SectionCard
              title="Problem Solving"
              ratingValue={formData.evaluations.problemSolving.rating}
              ratingOnChange={(val) => handleEvaluationChange('problemSolving', 'rating', val)}
              commentValue={formData.evaluations.problemSolving.comments}
              commentOnChange={(val) => handleEvaluationChange('problemSolving', 'comments', val)}
              error={errors.eval_problemSolving}
            />

            <SectionCard
              title="Cultural Fit"
              ratingValue={formData.evaluations.culturalFit.rating}
              ratingOnChange={(val) => handleEvaluationChange('culturalFit', 'rating', val)}
              commentValue={formData.evaluations.culturalFit.comments}
              commentOnChange={(val) => handleEvaluationChange('culturalFit', 'comments', val)}
              error={errors.eval_culturalFit}
            />

            <SectionCard
              title="Leadership / Initiative"
              ratingValue={formData.evaluations.leadership.rating}
              ratingOnChange={(val) => handleEvaluationChange('leadership', 'rating', val)}
              commentValue={formData.evaluations.leadership.comments}
              commentOnChange={(val) => handleEvaluationChange('leadership', 'comments', val)}
              error={errors.eval_leadership}
            />
          </div>

          {/* Overall Recommendation Section */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Final Decision</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-4">Overall Recommendation</label>
              <div className="flex flex-wrap gap-4">
                {['Strong Hire', 'Hire', 'Neutral', 'No Hire', 'Strong No Hire'].map((rec) => (
                  <label key={rec} className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${
                    formData.overallRecommendation === rec
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}>
                    <input
                      type="radio"
                      name="recommendation"
                      value={rec}
                      checked={formData.overallRecommendation === rec}
                      onChange={(e) => handleInputChange('overallRecommendation', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="ml-2 text-sm font-medium text-slate-700">{rec}</span>
                  </label>
                ))}
              </div>
              {errors.overallRecommendation && <p className="mt-2 text-xs text-red-500 font-medium">{errors.overallRecommendation}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Overall Comments (Summary)</label>
              <textarea
                value={formData.overallComments}
                onChange={(e) => handleInputChange('overallComments', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                rows="5"
                placeholder="Provide a final summary of the interview and candidate potential..."
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-10 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all active:transform active:scale-95 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Feedback...
                </>
              ) : (
                'Submit Interview Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewFeedbackForm;
