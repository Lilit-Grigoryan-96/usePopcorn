import { useEffect, useState } from "react";
import { useKey } from "../hooks/useKey";
import StarRating from "./StarRating";
import Loader from "./Loader";

const KEY = "9c01488235e9ae2f0d2828a66d87827c";

export default function MovieDetails({
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
