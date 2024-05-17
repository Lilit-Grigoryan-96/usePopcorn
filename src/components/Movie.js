export default function Movie({ movie, onSelectMovie }) {
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
