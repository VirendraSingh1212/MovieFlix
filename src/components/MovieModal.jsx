import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MovieModal.css';

function MovieModal({ movie, isOpen, onClose }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!movie) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="movieModal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="movieModal"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Close button */}
            <button className="movieModal__close" onClick={onClose} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>

            <div className="movieModal__content">
              {/* Poster */}
              <div className="movieModal__poster">
                <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.png'} 
                  alt={movie.Title}
                />
              </div>

              {/* Details */}
              <div className="movieModal__details">
                <h2 className="movieModal__title">{movie.Title}</h2>
                
                <div className="movieModal__meta">
                  <span className="movieModal__rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e50914">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {movie.imdbRating || 'N/A'}
                  </span>
                  <span className="movieModal__year">{movie.Year}</span>
                  <span className="movieModal__rated">{movie.Rated || 'PG-13'}</span>
                  <span className="movieModal__runtime">{movie.Runtime || 'N/A'}</span>
                </div>

                <p className="movieModal__plot">{movie.Plot}</p>

                <div className="movieModal__info">
                  <div className="movieModal__infoRow">
                    <span className="movieModal__label">Genre:</span>
                    <span className="movieModal__value">{movie.Genre}</span>
                  </div>
                  <div className="movieModal__infoRow">
                    <span className="movieModal__label">Director:</span>
                    <span className="movieModal__value">{movie.Director}</span>
                  </div>
                  <div className="movieModal__infoRow">
                    <span className="movieModal__label">Cast:</span>
                    <span className="movieModal__value">{movie.Actors}</span>
                  </div>
                </div>

                <div className="movieModal__buttons">
                  <button className="btn-primary movieModal__playBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Play Now
                  </button>
                  <button className="btn-outline movieModal__addBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Add to List
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MovieModal;
