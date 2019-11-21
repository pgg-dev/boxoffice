import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Movie from "../components/Movie";
import {
  getMovie,
  addComment,
  getComment,
  deleteComment
} from "../modules/movies";

function MovieContainer({ movieId }) {
  const { data, loading, error } = useSelector(state => state.movies.movie);
  const { status, id } = useSelector(state => state.movies.login);
  const { comments } = useSelector(state => state.movies);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMovie(movieId));
    dispatch(getComment(movieId));
  }, [dispatch, movieId]);

  let text = null;
  let changComment = [];
  const handleChange = e => {
    console.log("handleChange");
    text = e.target.value;
  };

  const handleClick = e => {
    console.log("handleClick");
    changComment = comments;
    if (!status) {
      alert("로그인 해주세요.");
    } else if (changComment.length) {
      changComment.forEach(item => {
        if (item.writer === id) {
          alert("이미 작성한 리뷰가 존재합니다.");
        }
      });
    } else {
      changComment.push({ text: text, writer: id });
      dispatch(addComment(changComment, movieId));
    }
  };

  const handleDelete = e => {
    console.log("handDelete");
    dispatch(deleteComment(movieId, id));
  };

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <Movie
      movie={data}
      isLogin={status}
      writer={id}
      comments={comments}
      onChange={handleChange}
      onClick={handleClick}
      onDelete={handleDelete}
    />
  );
}

export default MovieContainer;
