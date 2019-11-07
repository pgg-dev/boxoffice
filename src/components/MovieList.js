import React from "react";
import { Link } from "react-router-dom";
import "../style/MovieList.css";
import { MdSearch } from "react-icons/md";
import moment from "moment";

function MovieList({ onChange, onClick, movies, date }) {
  console.log("components/MovieList");

  return (
    <div className="contents">
      <div className="search">
        <input
          className="inputData"
          placeholder="yyyymmdd"
          onChange={onChange}
        />
        <button className="button" onClick={onClick}>
          <MdSearch />
        </button>
      </div>
      {/* <span className="dateInfo">
        {moment(date.toString()).format("YYYY년 M월 D일")} 기준
      </span> */}
      <div className="movies">
        {movies.map(movie => (
          <div className="movie" key={movie.rank}>
            <h1 className="rank">{movie.rank}</h1>
            <Link to={`/${movie.rank}`}>
              <img className="poster" src={movie.poster} alt={movie.title} />
            </Link>
            <span className="title">{movie.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
