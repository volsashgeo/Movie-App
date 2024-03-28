import React, { Component } from 'react';
// import { format } from 'date-fns';

import MovieListItem from '../movie-list-item';

import './movie-list.css';

let elements = [];
export default class MovieList extends Component {
  render() {
    const { moviesFromServer, loading, error } = this.props;

    elements = moviesFromServer.map((movie) => {
      const { id, title, releaseDate, description, genres, posterPath } = movie;

      const currentMovie = {
        id,
        title,
        releaseDate,
        genres,
        description,
        posterPath,
      };

      return <MovieListItem currentMovie={currentMovie} loading={loading} error={error} key={id} />;
    });

    return <ul className="movie-list">{elements}</ul>;
  }
}
