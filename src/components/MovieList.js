import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
// import { MdSearch } from "react-icons/md";
import moment from "moment";
import "./MovieList.scss";
import classNames from "classnames";
import load from "../images/load.gif";

function MovieList({
  loading,
  onClick,
  movies,
  date,
  period,
  showRange,
  onPrev,
  onNext,
  next
}) {
  return (
    <div className="movieListContainer">
      <div className="date_area">
        <div className="date_box">
          <ul>
            <li
              className={period === "daily" ? "daily" : null}
              onClick={onClick}
            >
              일간
            </li>
            <li
              className={period === "weekly" ? "weekly" : null}
              onClick={onClick}
            >
              주간
            </li>
          </ul>
        </div>
        <div className="date_calendar">
          <button className="btn-prev" onClick={onPrev}></button>
          <span>
            {period === "daily"
              ? moment(date.toString()).format("YYYY.MM.DD")
              : moment(showRange[0]).format("YYYY.MM.DD") +
                " ~ " +
                moment(showRange[1]).format("YYYY.MM.DD")}
          </span>
          <button
            className={classNames("btn-next", { next })}
            onClick={onNext}
            disabled={!next}
          ></button>
        </div>
      </div>
      <ul className="movieList">
        {// loading ? (
        // <div>
        //   <img src={load} alt="Loading..." />
        // </div>
        // ) :

        movies.map((movie, index) => (
          <li className="movie" key={index}>
            <h1 className="rank">{index + 1}</h1>
            <Link to={`/${movie.id}`}>
              <img className="poster" src={movie.poster} alt={movie.title} />
            </Link>
            <div className="movieInfo">
              <span className="movieTitle">
                {movie.title.length > 14
                  ? `${movie.title.substring(0, 14)}...`
                  : movie.title}
              </span>
              <span className="grade" grade={movie.grade}>
                {movie.grade}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;
