import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import savedJobsService from '../services/savedJobsService';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await savedJobsService.getSavedJobs();
        setSavedJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch saved jobs');
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleRemoveJob = async (jobId) => {
    try {
      await savedJobsService.removeSavedJob(jobId);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (err) {
      setError('Failed to remove job');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-6">Saved Jobs</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white/80 rounded-2xl shadow-xl border-2 border-primary-300 p-8 text-center hover:border-primary-500 hover:shadow-glow transition-all duration-300">
            <h2 className="text-xl font-semibold text-primary-900 mb-2">No Saved Jobs</h2>
            <p className="text-primary-600 mb-4">You haven't saved any jobs yet.</p>
            <Link to="/jobs" className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {savedJobs.map(job => (
              <div key={job._id} className="bg-white rounded-lg shadow-soft border border-primary-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-primary-900 mb-2">
                      <Link to={`/jobs/${job._id}`} className="hover:text-primary-700 transition-colors">
                        {job.title}
                      </Link>
                    </h2>
                    <p className="text-primary-600 mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                        {job.type}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemoveJob(job._id)}
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Remove from Saved
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs; 