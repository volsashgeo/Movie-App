import { format } from 'date-fns';

const apiKey = '296b67c3cf00aaaa67f8d03f51e157be';

function searchMovieByTitleUrl(title, page = 1) {
  return `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}&page=${page}`;
}

// let movieTitleTotalPages = null;
// let movieTitleTotalResults = null;
export default class MovieService {
  async getResource(url) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, recieved ${res.status}`);
    }

    const body = await res.json();
    return body;
  }

  async getMovieByTitle(title, page) {
    const res = await this.getResource(searchMovieByTitleUrl(title, page));

    const movieTitleTotalPages = res.total_pages;
    const movieTitleTotalResults = res.total_results;
    const moviesByTitle = res.results.map(this.transformData);

    return {
      moviesByTitle,
      movieTitleTotalResults,
      movieTitleTotalPages,
    };
  }

  transformData(movies) {
    return {
      id: movies.id,
      title: movies.original_title,
      releaseDate: movies.release_date ? format(movies.release_date, 'PP') : 'unknown release date',
      genres: movies.genre_ids,
      description: movies.overview,
      posterPath: movies.poster_path,
    };
  }
}

//! working
// const filmServ = new MovieService();

// filmServ.getMovieByTitle('x-men').then((movies) => {
//   movies.forEach((movie) => {
//     console.log(movie.title);
//   });
// });

// this.movieService.getMovieByTitle(title).then((responce) => {
//   const movies = responce.results;

//   const newArr = [];

//   movies.forEach((movie) => {
//     const movieInfo = {
//       id: movie.id,
//       title: movie.original_title,
//       releaseDate: movie.release_date ? format(movie.release_date, 'PP') : 'unknown',
//       genres: movie.genre_ids,
//       description: movie.overview,
//     };

//     newArr.push(movieInfo);
//   });
//   this.setState(() => ({
//     moviesFromServer: newArr,
//     loading: false,
//   }));
// });
