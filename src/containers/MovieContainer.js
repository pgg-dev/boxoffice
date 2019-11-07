import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Movie from "../components/Movie";
import { getMovie } from "../modules/movies";

function MovieContainer({ rank }) {
  const { data, loading, error } = useSelector(state => state.movies.movie);
  const { status } = useSelector(state => state.movies.login);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMovie(rank));
  }, [rank, dispatch]);

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return <div>데이터 없음</div>;

  return <Movie movie={data} isLogin={status} />;
}

export default MovieContainer;
