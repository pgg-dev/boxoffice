import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Movie from "../components/Movie";
import {
  getMovie,
  addComment,
  getComment,
  deleteComment,
  setStarRating
} from "../modules/movies";
import moment from "moment";

function MovieContainer({ movieId }) {
  const { star } = useSelector(state => state.movies);
  const { data, loading, error } = useSelector(state => state.movies.movie);
  const { status, name, id } = useSelector(state => state.movies.login);
  const { comments } = useSelector(state => state.movies);
  const { weeklyData, dailyData, period } = useSelector(
    state => state.movies.movies
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(period);
    console.log(JSON.parse(window.localStorage.getItem(period)));

    dispatch(getMovie(movieId));
    dispatch(setStarRating(""));
    dispatch(getComment(movieId));
    deleteBtnVisible();
  }, [dispatch, movieId]);

  let visibility = "hidden";
  const deleteBtnVisible = () => {
    console.log("btn함수");
    comments.forEach(comment => {
      if (comment.id === id) {
        visibility = "visible";
      }
    });
    console.log(visibility);
  };

  const starCheck = val => {
    return val === star ? "on" : "";
  };

  const handleScore = filter => {
    console.log(filter);
    dispatch(setStarRating(filter));
  };
  const starGroup = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  let text = null;
  let changComment = [];
  const handleChange = e => {
    console.log("handleChange");
    text = e.target.value;
  };

  const handleClick = e => {
    console.log("handleClick");
    changComment = comments;
    console.log(name);
    if (!status) {
      alert("로그인 해주세요.");
    } else if (changComment.length) {
      changComment.forEach(item => {
        if (item.id === id) {
          alert("이미 작성한 리뷰가 존재합니다.");
        }
      });
    } else {
      changComment.push({
        text: text,
        name: name,
        id: id,
        score: star,
        reg_date: moment().format("YYYY.MM.DD")
      });
      dispatch(addComment(changComment, movieId));
      dispatch(setStarRating(""));
    }
  };

  const handleDelete = e => {
    console.log("handDelete");
    dispatch(deleteComment(movieId, id));
    dispatch(setStarRating(""));
  };

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <Movie
      movie={data}
      isLogin={status}
      comments={comments}
      onChange={handleChange}
      onClick={handleClick}
      onDelete={handleDelete}
      starCheck={starCheck}
      onScore={handleScore}
      starGroup={starGroup}
      id={id}
    />
  );
}

export default MovieContainer;
