import React, { useState } from 'react';
import './App.css';
import Row from './components/Row';
import Banner from './components/Banner';
import Navbar from './components/Navbar';
import CategoryPills from './components/CategoryPills';
import MovieModal from './components/MovieModal';
import requests from './requests';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="app">
      <Navbar />
      <Banner />
      <CategoryPills />
      <Row
        title="MovieFlix Originals"
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
        onMovieClick={handleMovieClick}
      />
      <Row 
        title="Trending Now" 
        fetchUrl={requests.fetchTrending}
        onMovieClick={handleMovieClick}
      />
      <Row 
        title="Top Rated" 
        fetchUrl={requests.fetchTopRated}
        onMovieClick={handleMovieClick}
      />
      <Row 
        title="Action Movies" 
        fetchUrl={requests.fetchActionMovies}
        onMovieClick={handleMovieClick}
      />
      <Row 
        title="Comedy Movies" 
        fetchUrl={requests.fetchComedyMovies}
        onMovieClick={handleMovieClick}
      />
      <Row 
        title="Horror Movies" 
        fetchUrl={requests.fetchHorrorMovies}
        onMovieClick={handleMovieClick}
      />
      <Row 
        title="Romance Movies" 
        fetchUrl={requests.fetchRomanceMovies}
        onMovieClick={handleMovieClick}
      />
      <Row 
        title="Documentaries" 
        fetchUrl={requests.fetchDocumentaries}
        onMovieClick={handleMovieClick}
      />
      
      <MovieModal 
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
