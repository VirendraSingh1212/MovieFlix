import React, { useState, useEffect } from 'react';
import axios from '../axios';
import requests from '../requests';
import { mockMovies } from '../mockData';
import './Banner.css';

function Banner() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log('Fetching banner data...');
        const request = await axios.get(requests.fetchNetflixOriginals);
        console.log('Banner response:', request.data);
        // OMDb returns Search array instead of results
        if (request.data.Search && request.data.Search.length > 0) {
          const randomMovie = request.data.Search[Math.floor(Math.random() * request.data.Search.length)];
          // Fetch full details for the selected movie
          const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '31f8ed2e';
          const detailRequest = await axios.get(`?i=${randomMovie.imdbID}&apikey=${API_KEY}`);
          setMovie(detailRequest.data);
          setError(null);
        } else {
          setError('No data available');
        }
      } catch (err) {
        console.error('Error fetching banner data:', err.response?.data || err.message);
        console.log('Using mock data for banner');
        // Fallback to mock data on error
        setMovie(mockMovies[Math.floor(Math.random() * mockMovies.length)]);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  }

  if (loading) {
    return <div className="banner__loading"></div>;
  }

  if (error) {
    return <div className="banner__error">{error}</div>;
  }

  return (
    <header
      className="banner"
      style={{
        backgroundSize: 'cover',
        backgroundImage: movie?.Poster && movie.Poster !== 'N/A' 
          ? `url("${movie.Poster}")`
          : 'linear-gradient(180deg, #333 0%, #111 100%)',
        backgroundPosition: 'center center',
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.Title}
        </h1>
        <div className="banner__buttons">
          <button className="banner__button banner__buttonPlay">Play</button>
          <button className="banner__button banner__buttonList">My List</button>
        </div>
        <h1 className="banner__description">
          {truncate(movie?.Plot, 150)}
        </h1>
      </div>
      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;
