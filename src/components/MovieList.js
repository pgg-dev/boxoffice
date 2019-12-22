import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "./MovieList.scss";
import classNames from "classnames";

function MovieList({
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
    <div className="movie-content">
      <div className="movie-content__inner">
        <div className="period">
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

          <div className="period__date">
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
        <ul className="movie-list">
          {movies.map((movie, index) => (
            <li className="movie-list__item" key={index}>
              <h1 className="rank">{index + 1}</h1>
              <Link to={`/${movie.id}`}>
                <img className="poster" src={movie.poster} alt={movie.title} />
              </Link>
              <div className="movie-info">
                <span className="movie-info__title">
                  {movie.title.length > 12
                    ? `${movie.title.substring(0, 12)}...`
                    : movie.title}
                </span>
                <span className="movie-info__grade" grade={movie.grade}>
                  {movie.grade}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MovieList;
