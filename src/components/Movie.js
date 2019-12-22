import React from "react";
import styled from "styled-components";
import "./Movie.scss";

function Movie({
  movie,
  isLogin,
  comments,
  onChange,
  onClick,
  onDelete,
  starCheck,
  onScore,
  starGroup,
  id
}) {
  console.log("components/Movie");

  return (
    <div className="movie-detail">
      <div className="movie-detail__inner">
        <div className="movie-info">
          <span className="movie-poster">
            <img src={movie.poster} alt={movie.title} />
          </span>
          <div className="movie-info__summary">
            <h2>{movie.title}</h2>
            <p>{movie.titleEng}</p>

            <ul>
              <li>
                <strong>개봉일 :</strong> {movie.openDt}
              </li>
              <li>
                <strong> 장르 : </strong>
                {movie.genre} / {movie.runtime}분
              </li>
              <li>
                <strong>등급 : </strong>
                {movie.grade}
              </li>
              <li>
                <strong>감독 : </strong> {movie.director}
              </li>
              <li>
                <strong>배우 : </strong> {movie.actors[0]}, {movie.actors[1]}
              </li>
            </ul>
          </div>
        </div>
        <div className="movie-plot">
          <h3>줄거리</h3>
          {movie.plot.split(".").map(line => (
            <p>{`${line}.`}</p>
          ))}
        </div>

        <div className="review">
          <div className="review__inner">
            <div className="score">
              {starGroup.map(item => (
                <span
                  className={`score__star ${starCheck(item)}`}
                  onClick={e => onScore(item)}
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="review__write">
              <textarea
                onChange={onChange}
                placeholder={
                  isLogin
                    ? "영화 리뷰를 작성해 주세요."
                    : "로그인 후 이용 가능한 서비스입니다."
                }
                readOnly={!isLogin}
              />
              <button onClick={onClick}>입력</button>
            </div>
          </div>

          <ul className="review-list">
            {comments.map((item, index) => (
              <li key={index}>
                <div>
                  <strong>{item.writer}</strong>
                  <div className="raking-grade">
                    <span className="raking-grade__star">
                      <span style={{ width: `${item.score * 10}%` }}>평점</span>
                    </span>
                    <strong>{item.score}</strong>
                    <span>/10</span>
                  </div>
                  <p> {item.text}</p>
                  <span>{item.reg_date}</span>
                  {item.id === id ? (
                    <button onClick={onDelete}>삭제</button>
                  ) : (
                    <></>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Movie;
