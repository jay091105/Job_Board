import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [application, setApplication] = useState({
    resume: null,
    coverLetter: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details');
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => {
    setApplication({
      ...application,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setApplication({
      ...application,
      resume: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to apply for this job');
        navigate('/login');
        return;
      }

      // Check if user is a candidate
      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'candidate') {
        setError('Only candidates can apply for jobs');
        return;
      }

      if (!application.resume) {
        setError('Please upload your resume');
        return;
      }

      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('resume', application.resume);
      formData.append('coverLetter', application.coverLetter || '');

      await axios.post('http://localhost:5000/api/applications', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setError(null);
      navigate('/candidate/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error.response?.status === 401) {
        setError('Please login to apply for this job');
        navigate('/login');
      } else if (error.response?.status === 403) {
        setError('Only candidates can apply for jobs');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || 'Failed to submit application. Please try again.');
      } else {
        setError('Failed to submit application. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Job Details */}
          <div className="bg-white/80 rounded-2xl shadow-xl border-2 border-primary-300 p-6 mb-6 hover:border-primary-500 hover:shadow-glow transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary-900 mb-2">{job.title}</h1>
                <p className="text-primary-600 mb-2">{job.company}</p>
                <p className="text-primary-500 mb-4">{job.location}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                    {job.jobType}
                  </span>
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                    {job.experience}
                  </span>
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                    ${job.salary}
                  </span>
                </div>
              </div>
              {userRole !== 'employer' && (
                <button
                  onClick={() => {
                    if (!localStorage.getItem('token')) {
                      setError('Please login to apply for this job');
                      navigate('/login');
                      return;
                    }
                    setShowApplyForm(!showApplyForm);
                  }}
                  className="bg-gradient-primary text-white px-6 py-2 rounded-lg hover:shadow-glow transition duration-300"
                >
                  {showApplyForm ? 'Cancel' : 'Apply Now'}
                </button>
              )}
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Job Description</h2>
              <p className="text-primary-600 whitespace-pre-wrap mb-6">{job.description}</p>

              <h2 className="text-xl font-semibold text-primary-900 mb-4">Requirements</h2>
              <p className="text-primary-600 whitespace-pre-wrap mb-6">{job.requirements}</p>

              <h2 className="text-xl font-semibold text-primary-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {job.skills.map((skill, index) => (
                  <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Application Form */}
          {showApplyForm && (
            <div className="bg-white rounded-lg shadow-soft border border-primary-100 p-6">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">Apply for this Position</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-primary-700 mb-2">Resume</label>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-primary-100 rounded"
                    required
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="text-sm text-primary-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                </div>
                <div className="mb-4">
                  <label className="block text-primary-700 mb-2">Cover Letter</label>
                  <textarea
                    name="coverLetter"
                    value={application.coverLetter}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-primary-100 rounded"
                    rows="4"
                    placeholder="Tell us why you're interested in this position..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-primary text-white py-2 rounded-lg hover:shadow-glow transition duration-300"
                >
                  Submit Application
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 