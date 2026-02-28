import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios';
import { mockMovies, mockTrending, mockAction, mockComedy } from '../mockData';
import './Row.css';

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      // Check if API key is available
      const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
      
      if (!API_KEY) {
        console.log(`No API key found, using mock data for ${title}`);
        // Use mock data immediately if no API key
        let mockData = mockMovies;
        if (title.includes('Trending')) mockData = mockTrending;
        else if (title.includes('Action')) mockData = mockAction;
        else if (title.includes('Comedy')) mockData = mockComedy;
        
        const duplicatedMockData = [...mockData, ...mockData, ...mockData];
        setMovies(duplicatedMockData);
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
          // Duplicate movies to fill the row and create seamless scroll
          const moviesList = request.data.Search;
          const duplicatedMovies = [...moviesList, ...moviesList, ...moviesList];
          setMovies(duplicatedMovies);
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
        
        // Duplicate to fill the row
        const duplicatedMockData = [...mockData, ...mockData, ...mockData];
        setMovies(duplicatedMockData);
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
              {movies.map(
                (movie) =>
                  movie.Poster && movie.Poster !== 'N/A' && (
                    <img
                      className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
                      key={movie.imdbID}
                      src={movie.Poster}
                      alt={movie.Title}
                      loading="lazy"
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
}

export default Row;
