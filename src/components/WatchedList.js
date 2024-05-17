import WatchedMovie from "./WatchedMovie";

export default function WatchedList({
  watched,
  selectedId,
  onDeleteWatchedMovie,
}) {
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
