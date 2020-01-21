import React from "react";
import { Link, NavLink } from "react-router-dom";
import moment from "moment";
import "../styles/MovieList.scss";

function MovieList({
  onClick,
  movieList,
  date,
  showRange,
  onChangeDate,
  period,
  activeStyle,
  nextDate
}) {
  return (
    <section className="section section-main">
      <div className="inner">
        <div className="period-box">
          <ul>
            <NavLink exact to="/" activeStyle={activeStyle}>
              <li onClick={e => onClick("daily")}>일간</li>
            </NavLink>

            <NavLink to="/weekly" activeStyle={activeStyle}>
              <li onClick={e => onClick("weekly")}>주간</li>
            </NavLink>
          </ul>

          <div className="period-date">
            <button
              name="prev"
              className="btn-prev"
              onClick={onChangeDate}
            ></button>
            <span>
              {period === "daily"
                ? moment(date.toString()).format("YYYY.MM.DD")
                : moment(showRange[0]).format("YYYY.MM.DD") +
                  " ~ " +
                  moment(showRange[1]).format("YYYY.MM.DD")}
            </span>
            <button
              name="next"
              className={`btn-next ${nextDate()}`}
              onClick={onChangeDate}
            ></button>
          </div>
        </div>

        <ul className="movie-list">
          {movieList.map((movie, index) => (
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
    </section>
  );
}

export default MovieList;
