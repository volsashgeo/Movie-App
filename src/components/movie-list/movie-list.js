import React, { Component } from 'react';

import MovieGenresListContext from '../movie-genres-context';
import MovieListItem from '../movie-list-item';

import './movie-list.css';

let elements = [];
export default class MovieList extends Component {
  static contextType = MovieGenresListContext;

  render() {
    const { moviesFromServer, loading, error, guestSessionId, tabRated, ratedMovies, onGetAnyRating } = this.props;

    const movieGenresList = this.context;
    const arrForMap = tabRated ? ratedMovies : moviesFromServer;

    elements = arrForMap.map((movie) => {
      const { id, title, releaseDate, description, genres, posterPath, ratingAverage, ratingByMe } = movie;
      const genresArr = [];

      for (const genre of genres) {
        for (const item of movieGenresList) {
          if (item.id === genre) {
            genresArr.push(item.name);
          }
        }
      }

      const currentMovie = {
        id,
        title,
        releaseDate,
        genresArr,
        description,
        posterPath,
        ratingAverage,
        ratingByMe,
      };

      return (
        <MovieListItem
          currentMovie={currentMovie}
          loading={loading}
          error={error}
          key={id}
          movieGenresList={movieGenresList}
          guestSessionId={guestSessionId}
          ratedMovies={ratedMovies}
          onGetAnyRating={(rating) => onGetAnyRating(rating)}
        />
      );
    });

    return <ul className="movie-list">{elements}</ul>;
  }
}
