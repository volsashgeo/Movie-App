import React, { Component } from 'react';
import { Spin, Alert, Pagination } from 'antd';
import { debounce } from 'lodash';
import './app.css';

import MovieService from '../../services/moovie-service';
import MovieList from '../movie-list';
import SearchPanel from '../search-panel';

export default class App extends Component {
  movieService = new MovieService();

  state = {
    moviesFromServer: [],
    loading: true,
    error: false,
    searchValue: '',
    totalPages: 0,
    totalResults: 0,
    page: 1,
  };

  noSuchMovie = null;

  componentDidMount() {
    this.updateMovie(this.state.searchValue, this.state.page);
  }

  componentDidUpdate() {
    this.updateMovie(this.state.searchValue, this.state.page);
    if (this.state.moviesFromServer.length === 0) {
      this.noSuchMovie = 'Фильмы с таким названием не найдены';
    } else {
      this.noSuchMovie = null;
    }
  }

  onError() {
    this.setState(() => ({
      error: true,
      loading: false,
    }));
  }

  onPageChange = (page) =>
    this.setState(() => ({
      page,
    }));

  onInputChange = debounce((event) => {
    this.setState(() => ({
      searchValue: event.target.value,
    }));
  }, 800);

  updateMovie(title) {
    this.movieService
      .getMovieByTitle(title, this.state.page)
      .then(({ moviesByTitle, movieTitleTotalResults, movieTitleTotalPages }) => {
        this.setState({
          moviesFromServer: [...moviesByTitle],
          loading: false,
          totalResults: movieTitleTotalResults,
          totalPages: movieTitleTotalPages,
        });
      })
      .catch(this.onError);
  }

  render() {
    const { moviesFromServer, loading, error, page, searchValue } = this.state;

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

    const showPagination =
      !searchValue || this.noSuchMovie ? null : (
        <Pagination
          className="pagination"
          defaultPageSize={20}
          defaultCurrent={this.state.totalPages}
          total={this.state.totalResults}
          onChange={this.onPageChange}
          showTotal={() => `Всего фильмов найдено: ${this.state.totalResults}`}
        />
      );

    return (
      <div>
        <SearchPanel onInputChange={this.onInputChange} />
        <p className="no-such-movie">{searchValue ? this.noSuchMovie : null}</p>
        <p>{loading ? <Spin /> : null}</p>
        {errorMessage}
        {fullScreenLoading}
        <MovieList moviesFromServer={moviesFromServer} loading={loading} error={error} page={page} />
        {showPagination}
      </div>
    );
  }
}
