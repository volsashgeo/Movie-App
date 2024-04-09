import React, { Component } from 'react';
import { Spin, Rate } from 'antd';
import './movie-list-item.css';

import MovieService from '../../services/movie-service';

import noPosterImg from './no-poster.jpg';

export default class MovieListItem extends Component {
  movieService = new MovieService();

  state = {
    rating: 0,
  };

  onRatingChange = (value) => {
    this.setState({ rating: value });
    this.addMovieRating(this.props.currentMovie.id, this.props.guestSessionId, value);
    this.props.onGetAnyRating(value);
  };

  addMovieRating(movieId, sessionId, ratingValue) {
    this.movieService.addRating(movieId, sessionId, ratingValue).catch(new Error());
  }

  render() {
    const { currentMovie, loading, error } = this.props;
    const hasData = !(loading || error);
    const spinner = loading ? <Spin size="large" /> : null;

    const content = hasData ? (
      <MovieListItemView
        currentMovie={currentMovie}
        loading={loading}
        onRatingChange={this.onRatingChange}
        rating={this.state.rating}
      />
    ) : null;

    return (
      <div className="movie-list-item">
        {spinner}
        {content}
      </div>
    );
  }
}

function makeShortDescription(text, stringLength = 200) {
  const arr = text.split(' ');

  if (text.length <= stringLength - 4) {
    return text;
  }

  let str = '';

  for (let i = 0; i < arr.length - 1; i++) {
    str += `${arr[i]} `;
    if (str.length + arr[i + 1].length > stringLength - 4) break;
  }
  return `${str} ...`;
}

function MovieListItemView({ currentMovie, loading, onRatingChange, rating }) {
  const { title, releaseDate, genresArr, posterPath, description, ratingAverage, ratingByMe } = currentMovie;

  const elems = genresArr.map((genre) => {
    const elem = (
      <span className="movie-list-item__genre" key={genre}>
        {genre}
      </span>
    );
    return elem;
  });

  let colorOfRating = '#66E900';

  if (ratingAverage >= 0 && ratingAverage < 3) {
    colorOfRating = '#E90000';
  }
  if (ratingAverage >= 3 && ratingAverage < 5) {
    colorOfRating = '#E97E00';
  }
  if (ratingAverage >= 5 && ratingAverage < 7) {
    colorOfRating = '#E9D100';
  }

  const styleOfRating = { borderColor: colorOfRating };

  const ratingFromServer = Math.floor(Number(ratingAverage) * 10) / 10;
  const shortDescription = makeShortDescription(description, 130);
  const posterUrl = posterPath === null ? noPosterImg : `https://image.tmdb.org/t/p/w500${posterPath}`;

  return !loading ? (
    <>
      <img className="movie-list-item__poster" src={posterUrl} alt={title} />
      <div className="movie-list-item__info">
        <div className="movie-list-item__title">
          <h3 className="movie-list-item__text">{title}</h3>
          <div className="movie-list-item__rating" style={styleOfRating}>
            {ratingFromServer}
          </div>
        </div>
        <p className="movie-list-item__release-date">{releaseDate}</p>
        <div className="movie-list-item__genres">{elems}</div>
        <p className="movie-list-item__description">{shortDescription}</p>
        <Rate count={10} className="movie-list-item__rate" onChange={onRatingChange} value={ratingByMe || rating} />
      </div>
    </>
  ) : (
    <Spin />
  );
}
