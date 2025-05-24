import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBriefcase, FaRegClock, FaCheckCircle, FaBookmark, FaUserEdit, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CandidateDashboard = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    savedJobs: 0
  });
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileCompletion, setProfileCompletion] = useState({
    basicInfo: true,
    resume: false,
    skills: false,
    experience: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch applications using the correct endpoint
        const applicationsResponse = await axios.get('http://localhost:5000/api/applications/candidate', { headers });
        
        // Fetch saved jobs using the correct endpoint
        const savedJobsResponse = await axios.get('http://localhost:5000/api/jobs/saved', { headers });
        // Fetch user profile
        const profileResponse = await axios.get('http://localhost:5000/api/users/profile', { headers });
        const userData = profileResponse.data.data;

        setApplications(applicationsResponse.data.data || []);
        setSavedJobs(savedJobsResponse.data.data || []);

        const stats = {
          totalApplications: (applicationsResponse.data.data || []).length,
          interviews: (applicationsResponse.data.data || []).filter(app => app.status === 'interview').length,
          offers: (applicationsResponse.data.data || []).filter(app => app.status === 'offered').length,
          savedJobs: (savedJobsResponse.data.data || []).length
        };
        setStats(stats);

        // Profile completion logic
        const hasBasicInfo = !!userData.name && !!userData.email;
        const hasResume = !!userData.resume;
        const hasSkills = Array.isArray(userData.skills) ? userData.skills.length > 0 : false;
        const hasExperience = Array.isArray(userData.experience) ? userData.experience.length > 0 && !!userData.experience[0].description : false;
        setProfileCompletion({
          basicInfo: hasBasicInfo,
          resume: hasResume,
          skills: hasSkills,
          experience: hasExperience
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || error.message || 'Error loading dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUnsaveJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}/save`);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
      setStats(prev => ({
        ...prev,
        savedJobs: prev.savedJobs - 1
      }));
    } catch (error) {
      console.error('Error unsaving job:', error);
      setError(error.response?.data?.message || 'Error unsaving job');
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => {
    const CardContent = () => (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 mb-1 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-${color}-50 flex items-center justify-center`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
      </div>
    );

    try {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg border-l-4 border-${color}-500 transition-all duration-300`}
        >
          <CardContent />
        </motion.div>
      );
    } catch (error) {
      return (
        <div className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg border-l-4 border-${color}-500 transition-all duration-300`}>
          <CardContent />
        </div>
      );
    }
  };

  const ApplicationCard = ({ application }) => {
    const content = (
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-800">{application.job.title}</h3>
          <p className="text-gray-600 text-sm">{application.job.company}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          application.status === 'interview' ? 'bg-blue-100 text-blue-800' :
          application.status === 'offered' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </span>
      </div>
    );

    try {
      return (
        <motion.div
          key={application._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary-300 transition-all duration-300"
        >
          {content}
        </motion.div>
      );
    } catch (error) {
      return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary-300 transition-all duration-300">
          {content}
        </div>
      );
    }
  };

  const SavedJobCard = ({ job, onUnsave }) => {
    const content = (
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-medium text-gray-800">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{job.type}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{job.location}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to={`/jobs/${job._id}`}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-300"
          >
            View Job
          </Link>
          <button
            onClick={() => onUnsave(job._id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-300"
          >
            Unsave
          </button>
        </div>
      </div>
    );

    try {
      return (
        <motion.div
          key={job._id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-300 transition-all duration-300"
        >
          {content}
        </motion.div>
      );
    } catch (error) {
      return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-300 transition-all duration-300">
          {content}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900">Candidate Dashboard</h1>
          <div className="flex gap-4 ml-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300 shadow-sm border border-gray-200"
            >
              <FaUserEdit className="text-gray-600" />
              Edit Profile
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-300 shadow-sm"
            >
              <FaSearch />
              Find Jobs
            </Link>
          </div>
        </div>

        {/* Main dashboard card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-primary-300">
          <div className="flex gap-8 border-b border-gray-200 px-6">
            {['overview', 'applications', 'saved', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 text-lg font-medium transition-colors duration-300 relative ${
                  activeTab === tab
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-primary-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h2>
                  {applications.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                      <p className="text-gray-600 mb-4">No applications yet</p>
                      <Link
                        to="/jobs"
                        className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-300"
                      >
                        Browse Jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.slice(0, 3).map((application) => (
                        <ApplicationCard key={application._id} application={application} />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Completion</h2>
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="space-y-4">
                      {Object.entries({
                        'Basic Information': profileCompletion.basicInfo,
                        'Resume': profileCompletion.resume,
                        'Skills': profileCompletion.skills,
                        'Experience': profileCompletion.experience
                      }).map(([section, isComplete]) => (
                        <div key={section} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 font-medium">{section}</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isComplete ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {isComplete ? (
                              <FaCheckCircle className="text-green-600 text-sm" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                      <Link
                        to="/profile"
                        className="block text-center mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-300"
                      >
                        Complete Your Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-4">
                {applications.map((application) => (
                  <ApplicationCard key={application._id} application={application} />
                ))}
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedJobs.map((job) => (
                  <SavedJobCard key={job._id} job={job} onUnsave={handleUnsaveJob} />
                ))}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Completion Status</h2>
                  <div className="space-y-6">
                    {Object.entries({
                      'Basic Information': profileCompletion.basicInfo,
                      'Resume': profileCompletion.resume,
                      'Skills': profileCompletion.skills,
                      'Experience': profileCompletion.experience
                    }).map(([section, isComplete]) => (
                      <div key={section} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-800">{section}</h3>
                          <p className="text-sm text-gray-600">
                            {isComplete ? 'Completed' : 'Incomplete - Click to update'}
                          </p>
                        </div>
                        {isComplete ? (
                          <FaCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <Link
                            to="/profile"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-300"
                          >
                            Complete
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard; 