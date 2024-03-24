import React, { Component } from 'react';
import { DatePicker } from 'antd';

import MovieService from '../../services/moovie-service';
import MovieList from '../movie-list';

const searchMovieTitle = 'return';

export default class App extends Component {
  movieService = new MovieService();

  constructor() {
    super();
    this.updateMovie(searchMovieTitle);
  }

  state = {
    moviesFromServer: [],
  };

  updateMovie(title) {
    this.movieService.getMovieByTitle(title).then((movies) => {
      this.setState({
        moviesFromServer: [...movies],
      });
    });
  }

  render() {
    const { moviesFromServer } = this.state;
    console.log('App: moviesFromServer[0] ', moviesFromServer);
    return (
      <div>
        <MovieList moviesFromServer={moviesFromServer} />
        <DatePicker />
      </div>
    );
  }
}
