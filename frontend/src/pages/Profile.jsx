import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    company: '',
    resume: null,
    experience: '',
    education: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentResume, setCurrentResume] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = response.data.data;

        // --- Hardened fix for skills, experience, education to always show as plain text, no matter how deeply nested or stringified ---
        function extractDescriptionDeep(field) {
          let parsed = field;
          let lastDescription = '';
          let safety = 0;
          while (parsed && safety < 10) {
            safety++;
            if (typeof parsed === 'string') {
              try {
                const tryParse = JSON.parse(parsed);
                parsed = tryParse;
                continue;
              } catch {
                // If it's a string and not JSON, check if it looks like a description
                return parsed;
              }
            }
            if (Array.isArray(parsed) && parsed[0]) {
              if (typeof parsed[0].description === 'string') {
                lastDescription = parsed[0].description;
                parsed = parsed[0].description;
                continue;
              } else {
                parsed = parsed[0];
                continue;
              }
            }
            if (typeof parsed === 'object' && parsed !== null) {
              if (typeof parsed.description === 'string') {
                lastDescription = parsed.description;
                parsed = parsed.description;
                continue;
              }
              // If object but no description, break
              break;
            }
            break;
          }
          return lastDescription || '';
        }

        function extractSkillsDeep(skillsField) {
          let parsed = skillsField;
          let safety = 0;
          while (parsed && safety < 10) {
            safety++;
            if (typeof parsed === 'string') {
              // If it looks like a stringified array, always parse and join
              if (/^\[.*\]$/.test(parsed)) {
                try {
                  const arr = JSON.parse(parsed);
                  if (Array.isArray(arr)) return arr.join(', ');
                } catch {}
              }
              try {
                const tryParse = JSON.parse(parsed);
                parsed = tryParse;
                continue;
              } catch {
                return parsed;
              }
            }
            if (Array.isArray(parsed)) {
              return parsed.join(', ');
            }
            break;
          }
          return '';
        }

        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          bio: userData.bio || '',
          skills: extractSkillsDeep(userData.skills),
          company: userData.company || '',
          experience: extractDescriptionDeep(userData.experience),
          education: extractDescriptionDeep(userData.education)
        });
        setCurrentResume(userData.resume);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
      setFormData({
        ...formData,
        resume: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          // Always send a real array to the backend
          const arr = formData[key]
            .split(',')
            .map(skill => skill.trim())
            .filter(Boolean);
          formDataToSubmit.append(key, JSON.stringify(arr));
        } else if (key === 'resume' && formData[key]) {
          formDataToSubmit.append(key, formData[key]);
        } else if (key === 'experience' && formData[key]) {
          formDataToSubmit.append(key, JSON.stringify([
            {
              title: 'Work Experience',
              description: formData[key],
              from: new Date(),
              current: true
            }
          ]));
        } else if (key === 'education' && formData[key]) {
          formDataToSubmit.append(key, JSON.stringify([
            {
              school: 'Education',
              description: formData[key],
              from: new Date(),
              current: true
            }
          ]));
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      await axios.put('http://localhost:5000/api/users/profile', formDataToSubmit, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(true);
      navigate('/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-primary-100 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-primary-100 rounded w-3/4"></div>
                <div className="h-4 bg-primary-100 rounded w-1/2"></div>
                <div className="h-4 bg-primary-100 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-soft border border-primary-100 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center text-primary-900 mb-6">Profile Settings</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-primary-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-primary-100 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-primary-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-primary-100 rounded-lg"
                required
                disabled
              />
            </div>

            <div>
              <label className="block text-primary-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-primary-100 rounded-lg"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-primary-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-primary-100 rounded-lg"
                placeholder="Enter your location"
              />
            </div>

            {user?.role === 'employer' && (
              <div>
                <label className="block text-primary-700 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-3 border border-primary-100 rounded-lg"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-primary-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-3 border border-primary-100 rounded-lg"
                rows="4"
                placeholder="Tell us about yourself"
              />
            </div>

            {user?.role === 'candidate' && (
              <>
                <div>
                  <label className="block text-primary-700 mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full p-3 border border-primary-100 rounded-lg"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                </div>

                <div>
                  <label className="block text-primary-700 mb-2">Resume</label>
                  {currentResume && (
                    <div className="mb-2">
                      <a
                        href={`http://localhost:5000${currentResume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        View Current Resume
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    className="w-full p-3 border border-primary-100 rounded-lg"
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="text-sm text-primary-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                </div>

                <div>
                  <label className="block text-primary-700 mb-2">Experience</label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-3 border border-primary-100 rounded-lg"
                    rows="4"
                    placeholder="Describe your work experience"
                  />
                </div>

                <div>
                  <label className="block text-primary-700 mb-2">Education</label>
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full p-3 border border-primary-100 rounded-lg"
                    rows="4"
                    placeholder="Describe your educational background"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 