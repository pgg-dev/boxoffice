import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Movie from "../components/Movie";
import { getMovie, addComment, getComment } from "../modules/movies";

function MovieContainer({ rank }) {
  const { date } = useSelector(state => state.movies.movies);
  const { data, loading, error } = useSelector(state => state.movies.movie);
  const { status, id } = useSelector(state => state.movies.login);
  const { comment } = useSelector(state => state.movies);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMovie(rank));
    dispatch(getComment(date, rank));
  }, [dispatch, date, rank]);

  let text = null;
  let changComment = [];
  const handleChange = e => {
    console.log("handleChange");
    text = e.target.value;
  };

  const handleClick = e => {
    console.log("handleClick");
    if (!status) {
      alert("로그인 해주세요.");
    } else {
      changComment = comment;
      changComment.push({ text: text, writer: id });
      dispatch(addComment(changComment, rank, date, id));
    }
  };

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <Movie
      movie={data}
      isLogin={status}
      writer={id}
      comment={comment}
      onChange={handleChange}
      onClick={handleClick}
    />
  );
}

export default MovieContainer;
