import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMovies } from "../modules/movies";
import MovieList from "../components/MovieList";

function MovieListContainer() {
  console.log("MovieListContainer");

  const { data, loading, error } = useSelector(state => state.movies.movies);
  const dispatch = useDispatch();

  let changeDate = "";
  const handleChange = e => {
    console.log("handleChange");
    changeDate = e.target.value;
  };

  const handleClick = e => {
    console.log("handleClick");
    dispatch(getMovies(changeDate));
  };

  useEffect(() => {
    if (data) return;
    dispatch(getMovies(changeDate));
  }, [dispatch, changeDate]);
  //data 의존성 추가하면 날짜값 재설정시 계속 호출됨

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <MovieList
      onChange={handleChange}
      onClick={handleClick}
      movies={data}
      // date={date}
    />
  );
}

export default MovieListContainer;
