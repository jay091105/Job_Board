import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-primary-800 text-white pt-16 pb-8 mt-[-1px]">
      {/* Wavy SVG Top Border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0" style={{height: '60px', zIndex: 2}}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#0ea5e9" fillOpacity="1" d="M0,32L48,53.3C96,75,192,117,288,117.3C384,117,480,75,576,74.7C672,75,768,117,864,133.3C960,149,1056,139,1152,117.3C1248,96,1344,64,1392,48L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"/>
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12">
          {/* Brand & Social */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0">
            <h3 className="text-2xl font-heading font-bold text-white mb-2">JobBoard</h3>
            <p className="text-white/80 mb-4 max-w-xs">
              Find your dream job or hire the best talent. We connect employers and job seekers worldwide.
            </p>
            <div className="flex space-x-4 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 shadow-glow">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary-200 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary-200 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-primary-200 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              </a>
            </div>
          </div>
          {/* Links */}
          <div className="flex-[2] grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-heading font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="hover:text-primary-200 transition">Browse Jobs</Link></li>
                <li><Link to="/employers" className="hover:text-primary-200 transition">For Employers</Link></li>
                <li><Link to="/candidates" className="hover:text-primary-200 transition">For Candidates</Link></li>
                <li><Link to="/about" className="hover:text-primary-200 transition">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/blog" className="hover:text-primary-200 transition">Blog</Link></li>
                <li><Link to="/career-advice" className="hover:text-primary-200 transition">Career Advice</Link></li>
                <li><Link to="/help-center" className="hover:text-primary-200 transition">Help Center</Link></li>
                <li><Link to="/faq" className="hover:text-primary-200 transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white mb-3">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><span className="text-primary-200">✉</span> <span>support@jobboard.com</span></li>
                <li className="flex items-center gap-2"><span className="text-primary-200">☎</span> <span>+1 (555) 123-4567</span></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-primary-700 flex flex-col md:flex-row items-center justify-between gap-4 text-white/70 text-sm">
          <span>© {new Date().getFullYear()} JobBoard. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary-200 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-200 transition">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-primary-200 transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 