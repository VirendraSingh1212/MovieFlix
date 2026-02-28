import React, { useState, useEffect, memo } from 'react';
import axios from '../axios';
import { tmdbImageBaseURL } from '../axios';
import requests from '../requests';
import { mockMovies } from '../mockData';
import './Banner.css';

// Cache for banner data
let bannerCache = null;

// High-quality backdrop images from TMDB (no API key needed for images)
const highQualityBackdrops = [
  `${tmdbImageBaseURL}/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`, // Stranger Things
  `${tmdbImageBaseURL}/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg`, // Interstellar
  `${tmdbImageBaseURL}/s3TBrRGB1iav7gFOCNx3H31MoES.jpg`, // Inception
  `${tmdbImageBaseURL}/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg`, // Avengers
  `${tmdbImageBaseURL}/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg`, // Avengers Endgame
  `${tmdbImageBaseURL}/fydUcbKQLyzMX2g5R5jlGCAr6ka.jpg`, // The Dark Knight
  `${tmdbImageBaseURL}/gG9fTyDL03fiKnPyfhzgYxuLofA.jpg`, // The Matrix
  `${tmdbImageBaseURL}/lOr9NKxh4vMweufMOUDJjJTZRro.jpg`, // Dune
  `${tmdbImageBaseURL}/xJHokMbljvjADYdit5fK5VQsXEG.jpg`, // Avatar
  `${tmdbImageBaseURL}/5vNW7gR7h3E5U8YJq9W8z1Q8J7.jpg`, // Popular series
];

const Banner = memo(function Banner() {
  const [movie, setMovie] = useState(null);
  const [backdropUrl, setBackdropUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Check cache first
      if (bannerCache) {
        console.log('Using cached banner data');
        setMovie(bannerCache.movie);
        setBackdropUrl(bannerCache.backdropUrl);
        setLoading(false);
        return;
      }
      
      // Check if API key is available
      const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
      
      if (!API_KEY) {
        console.log('No API key found, using mock data for banner');
        const randomMovie = mockMovies[Math.floor(Math.random() * mockMovies.length)];
        const randomBackdrop = highQualityBackdrops[Math.floor(Math.random() * highQualityBackdrops.length)];
        bannerCache = { movie: randomMovie, backdropUrl: randomBackdrop };
        setMovie(randomMovie);
        setBackdropUrl(randomBackdrop);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching banner data...');
        const request = await axios.get(requests.fetchNetflixOriginals);
        console.log('Banner response:', request.data);
        // OMDb returns Search array instead of results
        if (request.data.Search && request.data.Search.length > 0) {
          const randomMovie = request.data.Search[Math.floor(Math.random() * request.data.Search.length)];
          // Fetch full details for the selected movie
          const detailRequest = await axios.get(`?i=${randomMovie.imdbID}&apikey=${API_KEY}`);
          // Pick a random high-quality backdrop
          const randomBackdrop = highQualityBackdrops[Math.floor(Math.random() * highQualityBackdrops.length)];
          bannerCache = { movie: detailRequest.data, backdropUrl: randomBackdrop };
          setMovie(detailRequest.data);
          setBackdropUrl(randomBackdrop);
          setError(null);
        } else {
          setError('No data available');
        }
      } catch (err) {
        console.error('Error fetching banner data:', err.response?.data || err.message);
        console.log('Using mock data for banner');
        // Fallback to mock data on error
        const randomMovie = mockMovies[Math.floor(Math.random() * mockMovies.length)];
        const randomBackdrop = highQualityBackdrops[Math.floor(Math.random() * highQualityBackdrops.length)];
        bannerCache = { movie: randomMovie, backdropUrl: randomBackdrop };
        setMovie(randomMovie);
        setBackdropUrl(randomBackdrop);
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
        backgroundImage: backdropUrl 
          ? `url("${backdropUrl}")`
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
});

export default Banner;
