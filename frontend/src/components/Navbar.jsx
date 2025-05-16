import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check if user is logged in and get their role
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <nav className="bg-gradient-primary shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-heading font-bold text-white">
            JobBoard
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="sm:hidden text-white hover:text-primary-100 focus:outline-none transition-colors duration-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center space-x-7">
            <Link
              to="/jobs"
              className="text-white hover:text-primary-100 transition duration-200 text-lg font-medium"
            >
              Jobs
            </Link>
            {isLoggedIn && userRole === 'employer' && (
              <Link
                to="/post-job"
                className="text-white hover:text-primary-100 transition duration-200 text-lg font-medium"
              >
                Post Job
              </Link>
            )}
            
            {isLoggedIn ? (
              <>
                <Link
                  to={userRole === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
                  className="text-white hover:text-primary-100 transition duration-200 text-lg font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-accent text-white px-4 py-2 rounded-lg hover:shadow-glow transition duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 hover:shadow-glow transition duration-200 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-secondary text-white px-4 py-2 rounded-lg hover:shadow-glow transition duration-200 font-medium"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden py-2 bg-white shadow-soft rounded-lg mt-2">
            <div className="flex flex-col space-y-2">
              <Link
                to="/jobs"
                className="text-secondary-600 hover:text-primary-600 transition duration-200 px-4 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              {isLoggedIn && userRole === 'employer' && (
                <Link
                  to="/post-job"
                  className="text-secondary-600 hover:text-primary-600 transition duration-200 px-4 py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Job
                </Link>
              )}
              {isLoggedIn ? (
                <>
                  <Link
                    to={userRole === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
                    className="text-secondary-600 hover:text-primary-600 transition duration-200 px-4 py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-gradient-accent text-white px-4 py-2 rounded-lg hover:shadow-glow transition duration-200 mx-4 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-glow transition duration-200 mx-4 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                    className="bg-gradient-secondary text-white px-4 py-2 rounded-lg hover:shadow-glow transition duration-200 mx-4 font-medium"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 