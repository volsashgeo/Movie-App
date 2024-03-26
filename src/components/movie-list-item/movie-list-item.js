import React, { Component } from 'react';
import './movie-list-item.css';
import { Spin } from 'antd';

import noPosterImg from './no-poster.jpg';

export default class MovieListItem extends Component {
  render() {
    const { currentMovie, loading, error } = this.props;

    const hasData = !(loading || error);
    // const errorMessage = error ? (
    //   <Alert
    //     message="Возникла ошибка, попробуйте перезагрузить страницу"
    //     description="Error Description"
    //     type="error"
    //     closable
    //     // onClose={onClose}
    //   />
    // ) : null;
    const spinner = loading ? <Spin size="large" /> : null;
    const content = hasData ? <MovieListItemView currentMovie={currentMovie} loading={loading} /> : null;

    return (
      <div className="movie-list-item">
        {/* {errorMessage} */}
        {spinner}
        {content}
      </div>
    );
  }
}

function MovieListItemView({ currentMovie }) {
  const { title, releaseDate, genres, posterPath, description } = currentMovie;

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

  const shortDescription = makeShortDescription(description, 200);

  const posterUrl = posterPath === null ? noPosterImg : `https://image.tmdb.org/t/p/w500${posterPath}`;

  return (
    <>
      <img className="movie-list-item__poster" src={posterUrl} alt={title} />
      <div className="movie-list-item__info">
        <h3 className="movie-list-item__title">{title}</h3>
        <p className="movie-list-item__release-date">{releaseDate}</p>
        <div className="movie-list-item__genres">
          <span className="movie-list-item__genre">{genres[0]}</span>
          <span className="movie-list-item__genre">{genres[1]}</span>
          <span className="movie-list-item__genre">{genres[2]}</span>
        </div>
        <p className="movie-list-item__description">{shortDescription}</p>
      </div>
    </>
  );
}
