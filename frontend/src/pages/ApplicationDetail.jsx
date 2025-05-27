import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`http://localhost:5000/api/applications/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setApplication(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching application details:', error);
        setError(error.response?.data?.message || 'Error loading application details');
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/applications/${id}`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setApplication(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 rounded-2xl shadow-xl border-2 border-primary-300 p-6 hover:border-primary-500 hover:shadow-glow transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary-900 mb-2">{application.job.title}</h1>
                <p className="text-primary-600">{application.job.company}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === 'interview' ? 'bg-primary-100 text-primary-800' :
                  application.status === 'offered' ? 'bg-primary-100 text-primary-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-primary-100 text-primary-800'
                }`}>
                  {application.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Candidate Information</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {application.candidate.name}</p>
                  <p><span className="font-medium">Email:</span> {application.candidate.email}</p>
                  <p><span className="font-medium">Phone:</span> {application.candidate.phone || 'Not provided'}</p>
                  {application.candidate.location && (
                    <p><span className="font-medium">Location:</span> {application.candidate.location}</p>
                  )}
                  {application.candidate.bio && (
                    <p><span className="font-medium">Bio:</span> {application.candidate.bio}</p>
                  )}
                  {application.candidate.skills && (
                    <p><span className="font-medium">Skills:</span> {Array.isArray(application.candidate.skills) ? application.candidate.skills.join(", ") : application.candidate.skills}</p>
                  )}
                  {application.candidate.experience && (
                    <p>
                      <span className="font-medium">Experience:</span>{' '}
                      {(() => {
                        let exp = application.candidate.experience;
                        try {
                          if (typeof exp === 'string') {
                            const parsed = JSON.parse(exp);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                              return parsed[0].description || '2 years';
                            }
                          }
                          return exp.description || '2 years';
                        } catch (e) {
                          return '2 years';
                        }
                      })()}
                    </p>
                  )}
                  {application.candidate.education && (
                    <p>
                      <span className="font-medium">Education:</span>{' '}
                      {(() => {
                        let edu = application.candidate.education;
                        try {
                          if (typeof edu === 'string') {
                            const parsed = JSON.parse(edu);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                              return parsed[0].description || 'charusat';
                            }
                          }
                          return edu.description || 'charusat';
                        } catch (e) {
                          return 'charusat';
                        }
                      })()}
                    </p>
                  )}
                  {application.candidate.resume && (
                    <p><span className="font-medium">Resume:</span> <a href={`http://localhost:5000${application.candidate.resume}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Resume</a></p>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-4">Application Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Applied On:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(application.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {application.coverLetter && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Cover Letter</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>
            )}

            {application.resumeUrl && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Resume (for this application)</h2>
                <a
                  href={`http://localhost:5000${application.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
              >
                Go Back
              </button>
              <div className="flex gap-2">
                <select
                  value={application.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail; 