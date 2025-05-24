import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PostJob = ({ isEditing = false, initialData = null, jobId = null }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: 'Software Developer',
    description: `We are looking for a skilled Software Developer to join our team. The ideal candidate will be responsible for:

• Developing and maintaining high-quality software solutions
• Collaborating with cross-functional teams to define and implement new features
• Writing clean, efficient, and maintainable code
• Participating in code reviews and providing constructive feedback
• Troubleshooting and fixing bugs
• Staying up-to-date with emerging technologies`,
    requirements: `• Bachelor's degree in Computer Science or related field
• 3+ years of experience in software development
• Strong proficiency in JavaScript, React, and Node.js
• Experience with RESTful APIs and microservices
• Solid understanding of software design patterns and principles
• Excellent problem-solving and analytical skills
• Strong communication and teamwork abilities
• Experience with Git version control`,
    company: 'Tech Solutions Inc.',
    location: 'New York, NY',
    type: 'Full-time',
    category: 'Technology',
    experience: 'Mid-level',
    salary: '80000 - 100000',
    skills: 'JavaScript, React, Node.js, TypeScript, MongoDB, REST APIs',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    benefits: ['Health Insurance', 'Remote Work', 'Flexible Hours', 'Paid Time Off'],
    workSchedule: '9:00 AM - 5:00 PM EST',
    remote: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];
  const jobCategories = [
    'Technology', 'Healthcare', 'Education', 'Finance', 
    'Marketing', 'Sales', 'Design', 'Engineering', 
    'Customer Service', 'Administrative', 'Other'
  ];
  const benefitOptions = [
    'Health Insurance',
    '401(k)',
    'Remote Work',
    'Flexible Hours',
    'Paid Time Off',
    'Professional Development',
    'Gym Membership',
    'Stock Options'
  ];

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(initialData);
    }
  }, [isEditing, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'benefits') {
        const updatedBenefits = checked
          ? [...formData.benefits, value]
          : formData.benefits.filter(benefit => benefit !== value);
        
        setFormData(prev => ({
          ...prev,
          benefits: updatedBenefits
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.company.trim()) newErrors.company = 'Company name is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        break;
      case 2:
        if (!formData.description.trim()) newErrors.description = 'Job description is required';
        if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
        break;
      case 3:
        if (!formData.skills.trim()) newErrors.skills = 'At least one skill is required';
        if (!formData.salary.trim()) newErrors.salary = 'Salary range is required';
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep !== 3) {
      handleNext();
      return;
    }
    
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);
    
    if (!step1Valid || !step2Valid || !step3Valid) {
      return;
    }

    if (!isAuthenticated || user?.role !== 'employer') {
      setErrors({ general: 'You must be logged in as an employer to post a job.' });
      return;
    }

    try {
      setLoading(true);
      
      const formattedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };
      
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors({ general: 'Authentication token not found. Please login again.' });
        setLoading(false);
        return;
      }

      if (isEditing && jobId) {
        await axios.put(`http://localhost:5000/api/jobs/${jobId}`, formattedData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/jobs', formattedData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error posting job:', err);
      setErrors({
        general: err.response?.data?.message || 'Failed to post job. Please try again.'
      });
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === currentStep
                ? 'bg-primary-600 text-white'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 3 && (
            <div
              className={`h-1 w-16 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white/80 rounded-2xl shadow-xl border-2 border-green-500 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Job Posted Successfully!</h2>
            <p className="text-green-700 mb-4">Your job has been posted and is now live.</p>
            <div className="animate-pulse">Redirecting to dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-900 text-center mb-4">Post a New Job</h1>
          <p className="text-center text-gray-600 mb-8">Find the perfect candidate for your team</p>
          
          {renderStepIndicator()}
          
          {errors.general && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white/80 rounded-2xl shadow-xl border-2 border-primary-300 p-8 hover:border-primary-500 hover:shadow-glow transition-all duration-300">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">1</span>
                  Basic Information
                </h2>
                
                <div>
                  <label className="block text-primary-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full p-3 border-2 rounded-lg ${
                      errors.title ? 'border-red-500' : 'border-primary-200'
                    } focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200`}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-primary-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full p-3 border-2 rounded-lg ${
                      errors.company ? 'border-red-500' : 'border-primary-200'
                    } focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200`}
                    placeholder="e.g. Tech Solutions Inc."
                  />
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-primary-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full p-3 border-2 rounded-lg ${
                        errors.location ? 'border-red-500' : 'border-primary-200'
                      } focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200`}
                      placeholder="e.g. New York, NY"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-primary-700 mb-2">Job Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">2</span>
                  Job Details
                </h2>
                
                <div>
                  <label className="block text-primary-700 mb-2">Job Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className={`w-full p-3 border-2 rounded-lg ${
                      errors.description ? 'border-red-500' : 'border-primary-200'
                    } focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200`}
                    placeholder="Describe the role and responsibilities..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-primary-700 mb-2">Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full p-3 border-2 rounded-lg ${
                      errors.requirements ? 'border-red-500' : 'border-primary-200'
                    } focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200`}
                    placeholder="List the key requirements and qualifications..."
                  />
                  {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-primary-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                    >
                      {jobCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-primary-700 mb-2">Experience Level</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                    >
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">3</span>
                  Additional Details
                </h2>
                
                <div>
                  <label className="block text-primary-700 mb-2">Required Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className={`w-full p-3 border-2 rounded-lg ${
                      errors.skills ? 'border-red-500' : 'border-primary-200'
                    } focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200`}
                    placeholder="e.g. JavaScript, React, Node.js (comma separated)"
                  />
                  {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                </div>

                <div>
                  <label className="block text-primary-700 mb-2">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`w-full p-3 border-2 rounded-lg ${
                      errors.salary ? 'border-red-500' : 'border-primary-200'
                    } focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200`}
                    placeholder="e.g. 80000 - 100000"
                  />
                  {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                </div>

                <div>
                  <label className="block text-primary-700 mb-2">Benefits</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {benefitOptions.map(benefit => (
                      <label key={benefit} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="benefits"
                          value={benefit}
                          checked={formData.benefits.includes(benefit)}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-primary-700 mb-2">Application Deadline</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className={`${
                  currentStep === 3
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-primary-600 hover:bg-primary-700'
                } text-white px-6 py-2 rounded-lg transition duration-300 ml-auto`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : currentStep === 3 ? (
                  isEditing ? 'Update Job' : 'Post Job'
                ) : (
                  'Next Step'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob; 