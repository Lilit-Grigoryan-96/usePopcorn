import { useRef } from "react";
import { useKey } from "../hooks/useKey";
export default function Search({ onSearch, query }) {
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
