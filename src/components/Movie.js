import React from "react";
import "../styles/Movie.scss";
import classNames from "classnames";
import Modal from "./Modal";

function Movie({
  movie,
  isLogin,
  comments,
  onChange,
  onAddComment,
  onDelete,
  starCheck,
  onScore,
  starGroup,
  id,
  onAddWishList,
  heart,
  text,
  loginModal,
  loginCheck
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
            <button onClick={onAddWishList}>
              <span className={classNames("empty", { heart })}>하트</span>
              <span>보고싶어요</span>
            </button>
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
                value={text}
                onChange={onChange}
                placeholder={
                  isLogin
                    ? "영화 리뷰를 작성해 주세요."
                    : "로그인 후 이용 가능한 서비스입니다."
                }
              />
              <button onClick={onAddComment}>등록</button>
            </div>
            <Modal isOpen={loginModal} onClick={loginCheck}>
              로그인이 필요한 서비스입니다.
              <br />
              로그인 페이지로 이동 하시겠습니까?
            </Modal>
          </div>

          <ul className="review-list">
            {comments.map((item, index) => (
              <li key={index}>
                <div>
                  <strong>{item.name}</strong>
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
