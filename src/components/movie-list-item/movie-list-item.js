import React, { Component } from 'react';
import './movie-list-item.css';
import './no-poster.jpg';

export default class MovieListItem extends Component {
  shortDescription(description) {
    const arr = description.split(' ');

    if (description.length <= 195) {
      return description;
    }

    let str = '';

    for (let i = 0; i < arr.length - 1; i++) {
      str += `${arr[i]} `;
      if (str.length + arr[i + 1].length > 195) break;
    }
    return `${str} ...`;
  }

  render() {
    const {
      currentMovie: { title, releaseDate, genres, posterPath },
    } = this.props;

    let {
      currentMovie: { description },
    } = this.props;

    description = this.shortDescription(description);

    console.log('description', description.length);
    const posterUrl = posterPath === null ? require('./no-poster.jpg') : `https://image.tmdb.org/t/p/w500${posterPath}`;

    return (
      <div className="movie-list-item">
        <img className="movie-list-item__poster" src={posterUrl} alt={title} />
        <div className="movie-list-item__info">
          <h3 className="movie-list-item__title">{title}</h3>
          <p className="movie-list-item__release-date">{releaseDate}</p>
          <div className="movie-list-item__genres">
            <span className="movie-list-item__genre">{genres[0]}</span>
            <span className="movie-list-item__genre">{genres[1]}</span>
            <span className="movie-list-item__genre">{genres[2]}</span>
          </div>
          <p className="movie-list-item__description">{description}</p>
        </div>
      </div>
    );
  }
}
