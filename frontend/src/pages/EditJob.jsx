import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostJob from './PostJob';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Format the job data to match the form structure
        const jobData = response.data.data;
        setJob({
          ...jobData,
          skills: Array.isArray(jobData.skills) ? jobData.skills.join(', ') : jobData.skills,
          benefits: jobData.benefits || [],
          applicationDeadline: jobData.applicationDeadline ? 
            new Date(jobData.applicationDeadline).toISOString().split('T')[0] : 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to fetch job details. Please try again.');
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'employer') {
      fetchJob();
    } else {
      setError('You must be logged in as an employer to edit jobs.');
      setLoading(false);
    }
  }, [id, isAuthenticated, user]);

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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-red-50 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-red-50 rounded-lg p-6 text-center">
            <p className="text-red-600">Job not found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <PostJob isEditing={true} initialData={job} jobId={id} />;
};

export default EditJob; 