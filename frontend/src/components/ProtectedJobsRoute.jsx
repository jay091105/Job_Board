import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import JobListings from '../pages/JobListings';

const ProtectedJobsRoute = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated && user?.role === 'employer') {
    return <Navigate to="/employer/dashboard" replace />;
  }

  return <JobListings />;
};

export default ProtectedJobsRoute; 