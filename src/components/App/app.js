import React, { Component } from 'react';
import { DatePicker, Spin, Alert } from 'antd';

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
    loading: true,
    error: false,
  };

  onError() {
    this.setState({
      error: true,
      loading: false,
    });
  }

  updateMovie(title) {
    this.movieService
      .getMovieByTitle(title)
      .then((movies) => {
        this.setState({
          moviesFromServer: [...movies],
          loading: false,
        });
      })
      .catch(this.onError);
  }

  render() {
    const { moviesFromServer, loading, error } = this.state;

    const fullScreenLoading = loading ? <Spin fullscreen size="large" /> : null;
    const errorMessage = error ? (
      <Alert
        message="Возникла ошибка, попробуйте перезагрузить страницу"
        description="Error Description"
        type="error"
        closable
        showIcon="true"
      />
    ) : null;

    return (
      <div>
        {errorMessage}
        {fullScreenLoading}
        <div style={{ textAlign: 'center' }}>{/* <Spin size="large" /> */}</div>
        <MovieList moviesFromServer={moviesFromServer} loading={loading} error={error} />
        <DatePicker />
      </div>
    );
  }
}
