import { useState } from "react";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import NavBar from "./components/Navbar";
import Logo from "./components/Logo";
import Search from "./components/Search";
import NavResults from "./components/NavResults";
import Loader from "./components/Loader";
import ErrorMsg from "./components/ErrorMsg";
import Main from "./components/Main";
import Box from "./components/Box";
import MoviesList from "./components/MoviesList";
import MovieDetails from "./components/MovieDetails";
import WatchedSummary from "./components/WatchedSummary";
import WatchedList from "./components/WatchedList";
import "./index.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

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
      </Main>
    </>
  );
}
