import React from "react";
import styled from "styled-components";

function Movie({ movie, isLogin, comments, onChange, onClick, onDelete }) {
  console.log("components/Movie");

  return (
    <MovieContainer>
      <MovieInfo>
        <Img src={movie.poster} alt={movie.title} />
        <Title>{movie.title}</Title>

        <List>
          <li>개봉일 : {movie.openDt}</li>
          <li>
            장르 : {movie.genre} / {movie.runtime}분
          </li>
          <li>등급 : {movie.grade}</li>
          <li>감독 : {movie.director}</li>
          <li>
            배우 : {movie.actors[0]}, {movie.actors[1]}
          </li>
        </List>
        <Plot>줄거리</Plot>
        <PlotContent>{movie.plot}</PlotContent>
      </MovieInfo>
      <Comment>
        <CommentBox>
          <CommentText
            onChange={onChange}
            placeholder={
              isLogin
                ? "영화 리뷰를 작성해 주세요."
                : "로그인 후 이용가능한 서비스입니다."
            }
            readOnly={!isLogin}
          />
          <CommnetButton onClick={onClick}>입력</CommnetButton>
        </CommentBox>

        <CommentList>
          {comments.map((content, index) => (
            <CommentItem key={index}>
              <p> {content.text}</p>
              <CommentDelete onClick={onDelete}>삭제</CommentDelete>
            </CommentItem>
          ))}
        </CommentList>
      </Comment>
    </MovieContainer>
  );
}

const MovieContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MovieInfo = styled.div`
  box-sizing: border-box;
  width: 1000px;
  display: grid;
  justify-content: center;
  align-content: center;
  align-items: center;
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

const List = styled.ul`
  display: table;
  padding-top: 20px;
  padding-bottom: 20px;
  list-style: none;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
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

const Comment = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 850px;
`;
const CommentBox = styled.div`
  display: flex;
  height: 80px;
`;
const CommentText = styled.textarea`
  flex: 1;
`;
const CommnetButton = styled.button`
  width: 80px;
`;
const CommentList = styled.ul`
  list-style: none;
`;

const CommentItem = styled.li`
  border-top: 1px solid #d9d9d9;
  :last-child {
    border-bottom: 1px solid #d9d9d9;
  }
  padding: 20px 0 20px 20px;
`;

const CommentDelete = styled.button``;

export default Movie;
