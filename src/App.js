import { useEffect, useRef, useState } from "react";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
import StarRating from "./StarRating";
import "./index.css";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "9c01488235e9ae2f0d2828a66d87827c";

export default function App() {
  const [query, setQuery] = useState(""); //
  const [selectedId, setSelectedId] = useState(null); //

  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSearch(inp) {
    setQuery(inp);
  }

  function handleSelectMovie(id) {
    setSelectedId((currentId) => (currentId === id ? null : id));
    // console.log(id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovies(movie) {
    setWatched((currentWatched) => [...currentWatched, movie]);
  }

  function handleDeleteWatchedMovie(watchedId) {
    setWatched((currentWatched) =>
      currentWatched.filter((el) => watchedId !== el.id)
    );
  }

  const { movies, isLoading, error } = useMovies(query);

  return (
    <>
      <NavBar>
        <Logo />
        <Search onSearch={handleSearch} query={query} />
        <NavResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MoviesList movies={movies} />} */}

          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMsg msg={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovies}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
        {/* <WatchedBox /> */}
      </Main>
    </>
  );
}
// navbar
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn 🎞</h1>
    </div>
  );
}
function Search({ onSearch, query }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    onSearch("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSearch(e.target.value)}
      ref={inputEl}
    />
  );
}

function NavResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
//loader
function Loader() {
  return <p className="loader">Loading...</p>;
}
//error
function ErrorMsg({ msg }) {
  return (
    <p className="error">
      <span>📛</span>
      {msg}
    </p>
  );
}
//Main
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// box
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.id} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.id)}>
      {movie.backdrop_path && (
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt={`${movie.original_title} poster`}
        />
      )}

      <h3>{movie.original_title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.release_date}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const {
    genres: genres,
    overview: overview,
    title: title,
    poster_path: poster_path,
    release_date: release_date,
    runtime: runtime,
    vote_average: vote_average,
    id: id,
  } = movie;
  // console.log(watched);

  const isWatched = watched.map((movie) => movie.id).includes(selectedId);

  function handleAddList() {
    onAddWatchedMovie({
      Poster: `https://image.tmdb.org/t/p/original/${poster_path}`,
      Title: title,
      imdbRating: vote_average,
      runtime: runtime,
      id: id,
      userRating,
    });
    onCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setLoading(true);
        const res = await fetch(
          ` https://api.themoviedb.org/3/movie/${selectedId}?api_key=${KEY}`
        );
        const data = await res.json();
        setMovie(data);
        console.log(data, selectedId);
        setLoading(false);
      }
      getMovieDetails();
    },

    [selectedId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useKey("Escape", onCloseMovie);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button onClick={onCloseMovie} className="btn-back">
            &larr;
          </button>
          <header>
            <img
              src={`https://image.tmdb.org/t/p/original/${poster_path}`}
              alt={`${title} poster`}
            />
            <div className="details-overview">
              <h3>{title}</h3>
              <p>
                {release_date}
                <span>⏳</span>
                <span>{runtime} min</span>
              </p>
              <p>
                {genres?.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </p>
              <p>
                <span>⭐️</span>
                <span>{vote_average} Rating</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    color="yellow"
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button onClick={handleAddList} className="btn-add">
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>you rated with movie</p>
              )}
            </div>
            <p>
              <em>{overview}</em>
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, selectedId, onDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.id}
          selectedId={selectedId}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatchedMovie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => onDeleteWatchedMovie(movie.id)}
      >
        X
      </button>
    </li>
  );
}
