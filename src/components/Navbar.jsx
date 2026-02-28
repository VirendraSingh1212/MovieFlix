import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

function Navbar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`navbar ${show ? 'navbar__scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="navbar__container">
        <div className="navbar__left">
          <h1 className="navbar__logo">MovieFlix</h1>
          <ul className="navbar__menu">
            <li className="navbar__menuItem active">Home</li>
            <li className="navbar__menuItem">Movies</li>
            <li className="navbar__menuItem">Series</li>
            <li className="navbar__menuItem">My List</li>
          </ul>
        </div>
        <div className="navbar__right">
          <button className="navbar__icon" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <button className="navbar__icon" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
          </button>
          <div className="navbar__profile">
            <img
              className="navbar__avatar"
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="User Avatar"
            />
            <svg className="navbar__dropdown" width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
