import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";

const MovieInfo = styled.div`
  display: grid;
  grid-template-columns: 230px 1fr;
  grid-template-rows: repeat(4, fit-content(100%));
  grid-template-areas:
    "img title"
    "img ul"
    "plot plot"
    "plotContent plotContent";
`;

const Img = styled.img`
  grid-area: img;
  /* grid-row: 1/3; */
`;

const Title = styled.h2`
  grid-area: title;
`;

const Line = styled.hr`
  border: 1px solid gray;
  grid-area: line;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  grid-area: ul;
`;

const Plot = styled.h3`
  /* grid-column: 1/3; */
  grid-area: plot;
`;

const PlotContent = styled.p`
  /* grid-column: 1/3; */
  grid-area: plotContent;
`;

function Movie({ movie, isLogin }) {
  console.log("components/Movie");
  console.log(isLogin);
  return (
    <MovieInfo>
      <Img src={movie.posters} alt={movie.movieNm} />
      <Title>{movie.movieNm}</Title>

      <List>
        <Line />
        <li>개봉일 : {moment(movie.openDt).format("YYYY년 M월 D일")}</li>
        <li>
          장르 : {movie.genre} / {movie.runtime}분
        </li>
        <li>등급 : {movie.rating[0].ratingGrade}</li>
        <li>감독 : {movie.director[0].directorNm}</li>
        <li>
          배우 : {movie.actor[0].actorNm}, {movie.actor[1].actorNm}
        </li>
        <Line />
      </List>
      <Plot>줄거리</Plot>
      <PlotContent>{movie.plot}</PlotContent>

      <div>
        <textarea
          placeholder={
            isLogin
              ? "영화 리뷰를 작성해 주세요."
              : "로그인 후 이용가능한 서비스입니다."
          }
        ></textarea>
        <button>입력</button>
      </div>
    </MovieInfo>
  );
}

export default Movie;
