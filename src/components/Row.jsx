import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import axios from '../axios';
import { mockMovies, mockTrending, mockAction, mockComedy } from '../mockData';
import './Row.css';

// Simple cache for API responses
const apiCache = new Map();

const Row = memo(function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowRef = useRef(null);

  // Memoize duplicated movies to prevent unnecessary re-renders
  const duplicatedMovies = useMemo(() => {
    if (!movies.length) return [];
    return [...movies, ...movies, ...movies];
  }, [movies]);

  useEffect(() => {
    async function fetchData() {
      // Check cache first
      if (apiCache.has(fetchUrl)) {
        console.log(`Using cached data for ${title}`);
        setMovies(apiCache.get(fetchUrl));
        setLoading(false);
        return;
      }
      
      // Check if API key is available
      const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
      
      if (!API_KEY) {
        console.log(`No API key found, using mock data for ${title}`);
        // Use mock data immediately if no API key
        let mockData = mockMovies;
        if (title.includes('Trending')) mockData = mockTrending;
        else if (title.includes('Action')) mockData = mockAction;
        else if (title.includes('Comedy')) mockData = mockComedy;
        
        setMovies(mockData);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Fetching ${title}...`);
        const request = await axios.get(fetchUrl);
        console.log(`${title} response:`, request.data);
        // OMDb returns Search array instead of results
        if (request.data.Search) {
          // Cache the response
          apiCache.set(fetchUrl, request.data.Search);
          setMovies(request.data.Search);
          setError(null);
        } else {
          setError('No data available');
        }
      } catch (err) {
        console.error(`Error fetching ${title}:`, err.response?.data || err.message);
        console.log(`Using mock data for ${title}`);
        // Fallback to mock data based on title
        let mockData = mockMovies;
        if (title.includes('Trending')) mockData = mockTrending;
        else if (title.includes('Action')) mockData = mockAction;
        else if (title.includes('Comedy')) mockData = mockComedy;
        
        setMovies(mockData);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchUrl, title]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="row">
      {loading && (
        <>
          <h2>{title}</h2>
          <div className="row__loading"></div>
        </>
      )}
      
      {error && !loading && (
        <>
          <h2>{title}</h2>
          <div className="row__error">{error}</div>
        </>
      )}
      
      {!loading && !error && (
        <>
          <h2>{title}</h2>
          <div className="row__container">
            <button 
              className="row__scrollButton row__scrollButtonLeft" 
              onClick={() => scroll('left')}
            >
              &#8249;
            </button>
            <div className="row__posters" ref={rowRef}>
              {duplicatedMovies.map(
                (movie, index) =>
                  movie.Poster && movie.Poster !== 'N/A' && (
                    <img
                      className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
                      key={`${movie.imdbID}-${index}`}
                      src={movie.Poster}
                      alt={movie.Title}
                      loading="lazy"
                      decoding="async"
                    />
                  )
              )}
            </div>
            <button 
              className="row__scrollButton row__scrollButtonRight" 
              onClick={() => scroll('right')}
            >
              &#8250;
            </button>
          </div>
        </>
      )}
    </div>
  );
});

export default Row;
