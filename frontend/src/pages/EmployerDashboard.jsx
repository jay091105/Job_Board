import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const [jobsResponse, applicationsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/jobs', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          axios.get('http://localhost:5000/api/applications', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        setJobs(jobsResponse.data.data || []);
        setApplications(applicationsResponse.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJobStatusChange = async (jobId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/jobs/${jobId}`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, status } : job
      ));
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleApplicationStatusChange = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/applications/${applicationId}`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-4 sm:mb-0">Employer Dashboard</h1>
          <Link
            to="/post-job"
            className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-glow transition duration-300 w-full sm:w-auto text-center"
          >
            Post New Job
          </Link>
        </div>

        <div className="bg-white/80 rounded-2xl shadow-xl overflow-hidden border-2 border-primary-300 hover:border-primary-500 hover:shadow-glow transition-all duration-300">
          <div className="flex flex-col sm:flex-row border-b-2 border-primary-300">
            <button
              className={`px-4 py-2 sm:px-6 sm:py-3 text-left transition duration-200 ${
                activeTab === 'jobs' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-primary-600 hover:bg-primary-50'
              }`}
              onClick={() => setActiveTab('jobs')}
            >
              My Jobs
            </button>
            <button
              className={`px-4 py-2 sm:px-6 sm:py-3 text-left transition duration-200 ${
                activeTab === 'applications' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-primary-600 hover:bg-primary-50'
              }`}
              onClick={() => setActiveTab('applications')}
            >
              Applications
            </button>
          </div>

          {activeTab === 'jobs' && (
            <div className="p-6">
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-primary-600 mb-2">No jobs posted yet</h3>
                  <p className="text-primary-500 mb-4">Start by posting your first job</p>
                  <Link
                    to="/post-job"
                    className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-glow transition duration-300 inline-block"
                  >
                    Post a Job
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {jobs.map(job => (
                    <div key={job._id} className="bg-white/80 border-2 border-primary-300 rounded-2xl p-6 shadow-xl hover:border-primary-500 hover:shadow-glow transition-all duration-300">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-primary-900 mb-2">{job.title}</h3>
                          <p className="text-primary-600 mb-2">{job.company}</p>
                          <p className="text-primary-500 mb-2">{job.location}</p>
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
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-300 w-full sm:w-auto text-center"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/jobs/${job._id}/edit`}
                            className="bg-primary-100 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-200 transition duration-300 w-full sm:w-auto text-center"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="p-6">
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-primary-600 mb-2">No applications yet</h3>
                  <p className="text-primary-500 mb-4">Applications for your jobs will appear here</p>
                  <Link
                    to="/post-job"
                    className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-glow transition duration-300 inline-block"
                  >
                    Post a Job
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {applications.map(application => (
                    <div key={application._id} className="bg-white/80 border-2 border-primary-300 rounded-2xl p-6 shadow-xl hover:border-primary-500 hover:shadow-glow transition-all duration-300">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-primary-900 mb-2">{application.job.title}</h3>
                          <p className="text-primary-600 mb-2">{application.candidate.name}</p>
                          <p className="text-primary-500 mb-2">{application.candidate.email}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              application.status === 'interview' ? 'bg-primary-100 text-primary-800' :
                              application.status === 'offered' ? 'bg-primary-100 text-primary-800' :
                              application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-primary-100 text-primary-800'
                            }`}>
                              {application.status}
                            </span>
                            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                              {new Date(application.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link
                            to={`/applications/${application._id}`}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-300 w-full sm:w-auto text-center"
                          >
                            View Application
                          </Link>
                          <Link
                            to={`/jobs/${application.job._id}`}
                            className="bg-primary-100 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-200 transition duration-300 w-full sm:w-auto text-center"
                          >
                            View Job
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard; 