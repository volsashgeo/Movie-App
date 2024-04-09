import React, { Component } from 'react';
import { Spin, Alert, Pagination, Tabs } from 'antd';
import { debounce } from 'lodash';
import './app.css';

import MovieService from '../../services/movie-service';
import MovieList from '../movie-list';
import SearchPanel from '../search-panel';
import MovieGenresListContext from '../movie-genres-context';

export default class App extends Component {
  movieService = new MovieService();

  state = {
    moviesFromServer: [],
    ratedMovies: [],
    tabRated: false,
    loading: true,
    error: false,
    searchValue: '',
    movieSearchedTotalResults: 0,
    movieRatedTotalResults: 0,
    page: 1,
    movieGenresList: [],
    guestSessionId: null,
    gotAnyRating: false,
  };

  tabsItems = [
    {
      key: '1',
      label: 'Search',
    },
    {
      key: '2',
      label: 'Rated',
    },
  ];

  noSuchMovie = null;

  componentDidMount() {
    this.updateMovie(this.state.searchValue, this.state.page);
    this.getGenres();
    this.getGuestSession();
  }

  componentDidUpdate() {
    this.updateMovie(this.state.searchValue, this.state.page);
    this.noSuchMovie = this.state.moviesFromServer.length === 0 ? 'Фильмы с таким названием не найдены' : null;
  }

  onGetAnyRating = (rating) => {
    if (rating) {
      this.setState({ gotAnyRating: true });
    }
  };

  onError() {
    this.setState({
      error: true,
      loading: false,
    });
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

  getGenres() {
    this.movieService
      .getMovieGenres()
      .then((res) => {
        this.setState({
          movieGenresList: res,
        });
      })
      .catch(this.onError);
  }

  getGuestSession() {
    this.movieService
      .getGuestSessionId()
      .then((res) => {
        this.setState({
          guestSessionId: res,
        });
      })
      .catch(this.onError);
  }

  onTabChange = (key) => {
    if (key === '2') {
      this.setState({ tabRated: true });
      if (this.state.gotAnyRating) {
        this.getRatedMoviesFromServer(this.state.guestSessionId);
      }
    }
    if (key === '1') {
      this.setState({ tabRated: false });
    }
  };

  getRatedMoviesFromServer(sessionId) {
    this.movieService
      .getRatedMovies(sessionId)
      .then(({ ratedMovies, movieRatedTotalResults }) => {
        this.setState({
          ratedMovies: [...ratedMovies],
          loading: false,
          movieRatedTotalResults,
        });
      })
      .catch(this.onError);
  }

  updateMovie(title) {
    this.movieService
      .getMovieByTitle(title, this.state.page)
      .then(({ moviesByTitle, movieTitleTotalResults }) => {
        this.setState({
          moviesFromServer: [...moviesByTitle],
          loading: false,
          movieSearchedTotalResults: movieTitleTotalResults,
        });
      })
      .catch(this.onError);
  }

  render() {
    const {
      moviesFromServer,
      ratedMovies,
      loading,
      error,
      page,
      searchValue,
      movieGenresList,
      guestSessionId,
      tabRated,
      movieSearchedTotalResults,
      movieRatedTotalResults,
    } = this.state;

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

    const total = tabRated ? movieRatedTotalResults : movieSearchedTotalResults;

    const showPagination =
      !searchValue || this.noSuchMovie ? null : (
        <Pagination
          className="pagination"
          defaultPageSize={20}
          showSizeChanger={false}
          defaultCurrent={1}
          total={total}
          onChange={this.onPageChange}
          showTotal={() => `Всего фильмов найдено: ${total}`}
        />
      );

    const showSearchPanel = tabRated ? null : <SearchPanel onInputChange={this.onInputChange} />;
    const showNoSuchMovie = searchValue ? this.noSuchMovie : null;
    const hideNoSuchMovieWhenRated = tabRated ? null : showNoSuchMovie;
    return (
      <div>
        <Tabs
          defaultActiveKey="1"
          items={this.tabsItems}
          onChange={this.onTabChange}
          centered
          className="tabs tabs__top"
        />
        {showSearchPanel}
        <p className="no-such-movie">{hideNoSuchMovieWhenRated}</p>
        <div>{loading ? <Spin /> : null}</div>
        {errorMessage}
        {fullScreenLoading}
        <MovieGenresListContext.Provider value={movieGenresList}>
          <MovieList
            moviesFromServer={moviesFromServer}
            ratedMovies={ratedMovies}
            loading={loading}
            error={error}
            page={page}
            guestSessionId={guestSessionId}
            tabRated={tabRated}
            onGetAnyRating={this.onGetAnyRating}
          />
        </MovieGenresListContext.Provider>
        {showPagination}
      </div>
    );
  }
}
