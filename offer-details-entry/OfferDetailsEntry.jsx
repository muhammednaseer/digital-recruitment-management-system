import React, { useState } from 'react';
import {
  Plus,
  X,
  ChevronDown,
  Save,
  Eye,
  Calendar,
  DollarSign,
  Briefcase,
  Users,
  Building,
  AlertCircle,
  Check
} from 'lucide-react';

const OfferDetailsEntry = () => {
  // Form State
  const [formData, setFormData] = useState({
    salary: '',
    currency: 'USD',
    frequency: 'Annual',
    keyTerms: [
      'Health Insurance',
      'Remote Work'
    ],
    customTerm: '',
    startDate: '',
    expiryDate: '',
    jobTitle: '',
    department: '',
    reportingManager: '',
    notes: ''
  });

  // Validation State
  const [errors, setErrors] = useState({});
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Constants
  const currencies = ['USD', 'AED', 'GBP', 'EUR', 'CAD', 'AUD', 'SGD'];
  const frequencies = ['Annual', 'Monthly', 'Hourly'];
  const suggestedTerms = [
    'Equity / Stock Options',
    'Sign-on Bonus',
    'Relocation Assistance',
    'Remote Work',
    'Flexible Hours',
    'Health Insurance',
    'Performance Bonus',
    'Non-compete Clause',
    'Probation Period'
  ];

  // Handlers
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

  const toggleKeyTerm = (term) => {
    setFormData(prev => {
      const exists = prev.keyTerms.includes(term);
      if (exists) {
        return { ...prev, keyTerms: prev.keyTerms.filter(t => t !== term) };
      } else {
        return { ...prev, keyTerms: [...prev.keyTerms, term] };
      }
    });
  };

  const addCustomTerm = () => {
    if (formData.customTerm.trim()) {
      if (!formData.keyTerms.includes(formData.customTerm.trim())) {
        setFormData(prev => ({
          ...prev,
          keyTerms: [...prev.keyTerms, prev.customTerm.trim()],
          customTerm: ''
        }));
      } else {
        handleInputChange('customTerm', '');
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.salary) newErrors.salary = 'Salary amount is required';
    if (isNaN(formData.salary)) newErrors.salary = 'Please enter a valid number';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Offer expiry date is required';

    setErrors(newErrors);
    return newErrors;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log('Offer Details Preview:', formData);
      alert('Offer details logged to console. Check developer tools.');
    } else {
      const firstError = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstError);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSaveDraft = () => {
    setIsDraftSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsDraftSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  // Sub-components
  const InputWrapper = ({ label, error, children, id }) => (
    <div className="flex flex-col space-y-1.5 mb-6">
      <label className="text-sm font-medium text-slate-700 font-sans">{label}</label>
      <div id={id} className="relative">
        {children}
      </div>
      {error && (
        <div className="flex items-center text-red-500 text-xs mt-1">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  );

  const SectionHeading = ({ children }) => (
    <h2 className="text-xl font-serif text-slate-900 mb-6 border-b border-slate-100 pb-2">
      {children}
    </h2>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-medium text-slate-900 tracking-tight">Create Job Offer</h1>
            <p className="text-slate-500 mt-2 font-sans">Fill in the details below to generate a candidate offer letter.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isDraftSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              {isDraftSaving ? 'Saving...' : showSuccess ? (
                <><Check className="w-4 h-4 text-green-500" /> Saved</>
              ) : (
                <><Save className="w-4 h-4" /> Save Draft</>
              )}
            </button>
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
            >
              <Eye className="w-4 h-4" /> Preview Offer
            </button>
          </div>
        </header>

        <form className="grid grid-cols-1 lg:grid-cols-2 gap-12" onSubmit={(e) => e.preventDefault()}>
          {/* Left Column: Salary + Key Terms */}
          <div className="space-y-10">
            {/* Salary Section */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <SectionHeading>Salary & Compensation</SectionHeading>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputWrapper label="Currency">
                  <div className="relative">
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                    >
                      {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </InputWrapper>

                <div className="md:col-span-2">
                  <InputWrapper label="Final Salary Amount" error={errors.salary} id="salary">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="0.00"
                        value={formData.salary}
                        onChange={(e) => handleInputChange('salary', e.target.value)}
                        className={`w-full bg-slate-50 border ${errors.salary ? 'border-red-300' : 'border-slate-200'} rounded-xl px-10 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
                      />
                    </div>
                  </InputWrapper>
                </div>
              </div>

              <InputWrapper label="Pay Frequency">
                <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                  {frequencies.map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleInputChange('frequency', f)}
                      className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                        formData.frequency === f
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </InputWrapper>
            </section>

            {/* Key Terms Section */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <SectionHeading>Key Terms & Perks</SectionHeading>

              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 font-sans block mb-3">Select terms to include</label>
                <div className="flex flex-wrap gap-2">
                  {suggestedTerms.map(term => {
                    const isSelected = formData.keyTerms.includes(term);
                    return (
                      <button
                        key={term}
                        type="button"
                        onClick={() => toggleKeyTerm(term)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {term}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Add custom term..."
                  value={formData.customTerm}
                  onChange={(e) => handleInputChange('customTerm', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomTerm()}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={addCustomTerm}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Custom Tags Display (only those not in suggested) */}
              {formData.keyTerms.filter(t => !suggestedTerms.includes(t)).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.keyTerms.filter(t => !suggestedTerms.includes(t)).map(term => (
                    <span
                      key={term}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full transition-all duration-200"
                    >
                      {term}
                      <button
                        type="button"
                        onClick={() => toggleKeyTerm(term)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Other Details + Notes */}
          <div className="space-y-10">
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <SectionHeading>Offer Details</SectionHeading>

              <div className="space-y-4">
                <InputWrapper label="Job Title" error={errors.jobTitle} id="jobTitle">
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Senior Product Designer"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className={`w-full bg-slate-50 border ${errors.jobTitle ? 'border-red-300' : 'border-slate-200'} rounded-xl px-10 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
                    />
                  </div>
                </InputWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWrapper label="Department" error={errors.department} id="department">
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Engineering"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className={`w-full bg-slate-50 border ${errors.department ? 'border-red-300' : 'border-slate-200'} rounded-xl px-10 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
                      />
                    </div>
                  </InputWrapper>

                  <InputWrapper label="Reporting Manager">
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Manager's Name"
                        value={formData.reportingManager}
                        onChange={(e) => handleInputChange('reportingManager', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </InputWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWrapper label="Start Date" error={errors.startDate} id="startDate">
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className={`w-full bg-slate-50 border ${errors.startDate ? 'border-red-300' : 'border-slate-200'} rounded-xl px-10 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
                      />
                    </div>
                  </InputWrapper>

                  <InputWrapper label="Offer Expiry" error={errors.expiryDate} id="expiryDate">
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className={`w-full bg-slate-50 border ${errors.expiryDate ? 'border-red-300' : 'border-slate-200'} rounded-xl px-10 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
                      />
                    </div>
                  </InputWrapper>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <SectionHeading>Additional Notes</SectionHeading>
              <InputWrapper label="Special Conditions / Private Notes">
                <textarea
                  rows="6"
                  placeholder="Enter any additional conditions or notes for HR..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                ></textarea>
              </InputWrapper>
            </section>
          </div>
        </form>

        {/* Footer actions for mobile */}
        <div className="mt-12 flex lg:hidden items-center justify-center gap-4">
          <button
            onClick={handleSaveDraft}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={handlePreview}
            className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-white bg-indigo-600 rounded-xl"
          >
            <Eye className="w-4 h-4" /> Preview Offer
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        .font-sans {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }

        /* Custom date picker icon removal for cleaner look if browser supports */
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}} />
    </div>
  );
};

export default OfferDetailsEntry;
