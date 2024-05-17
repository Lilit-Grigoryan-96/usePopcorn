import { useEffect, useState } from "react";

const KEY = "9c01488235e9ae2f0d2828a66d87827c";

export function useMovies(query) {
  const [movies, setMovies] = useState([]); //
  const [isLoading, setLoading] = useState(true); //
  const [error, setError] = useState(""); //
  useEffect(
    function () {
      // fetch("https://api.themoviedb.org/3/discover/movie?api_key=" + KEY)
      //   .then((res) => res.json())
      //   .then((data) => setMovies(data.results));
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setLoading(true);
          setError("");
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${KEY}`,
            { signal: controller.signal }
          );
          // console.log(res);
          if (!res.ok) {
            throw new Error("Something went wrong when fetching movies");
          }

          const data = await res.json();

          if (data.results.length === 0) throw new Error("Movie not found");

          setMovies(data.results);
          setError("");
          // console.log(movies);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      }
      //   handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
