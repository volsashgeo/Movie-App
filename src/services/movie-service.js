import { format } from 'date-fns';

const apiKey = '296b67c3cf00aaaa67f8d03f51e157be';

function searchMovieByTitleUrl(title, page = 1) {
  return `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}&page=${page}`;
}

// получить массив жанров
function getArrOfGenres() {
  return `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${apiKey}`;
}

// получить гостевую сессию
function getGuestSessionUrl() {
  return `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${apiKey}`;
}

// адрес на добавление рейтинга POST-запросом
function getAddRatingUrl(movieId, sessionId) {
  return `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${sessionId}`;
}

// получить оцененные фильмы

function getRatedMoviesUrl(sessionId) {
  return `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=${apiKey}`;
}

export default class MovieService {
  async getResource(url, options) {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, recieved ${res.status}`);
    }

    const body = await res.json();
    return body;
  }

  async getMovieByTitle(title, page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
    const res = await this.getResource(searchMovieByTitleUrl(title, page), options);

    const movieTitleTotalResults = res.total_results;
    const moviesByTitle = res.results.map(this.transformData);

    return {
      moviesByTitle,
      movieTitleTotalResults,
    };
  }

  getMovieGenres = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
    const res = await this.getResource(getArrOfGenres(), options);

    const movieGenres = res.genres;

    return [...movieGenres];
  };

  getGuestSessionId = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
    const res = await this.getResource(getGuestSessionUrl(), options);

    const guestSessionValue = res.guest_session_id;
    return guestSessionValue;
  };

  addRating = async (movieId, sessionId, ratingValue) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: ratingValue,
      }),
    };

    const res = await this.getResource(getAddRatingUrl(movieId, sessionId), options);
    const rateMovie = res;

    return rateMovie;
  };

  getRatedMovies = async (sessionId) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
    const res = await this.getResource(getRatedMoviesUrl(sessionId), options);

    const movieRatedTotalResults = res.total_results;
    const ratedMovies = res.results.map(this.transformData);

    return {
      ratedMovies,
      movieRatedTotalResults,
    };
  };

  transformData(movies) {
    return {
      id: movies.id,
      title: movies.original_title,
      releaseDate: movies.release_date ? format(movies.release_date, 'PP') : 'unknown release date',
      genres: movies.genre_ids,
      description: movies.overview,
      posterPath: movies.poster_path,
      ratingAverage: movies.vote_average,
      ratingByMe: movies.rating ?? 0,
    };
  }
}
