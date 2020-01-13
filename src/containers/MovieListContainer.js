import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMovies } from "../modules/movies";
import MovieList from "../components/MovieList";
import load from "../images/load.gif";
import moment from "moment";

function MovieListContainer({ path }) {
  console.log("MovieListContainer");

  const { movieList, loading, error, date, showRange, period } = useSelector(
    state => state.movies.movies
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // if (dailyData.length || weeklyData.length) return;
    // if (!dailyData.length && !weeklyData.length) {
    //   path.includes("weekly")
    //     ? dispatch(getMovies("weekly", sunday))
    //     : dispatch(getMovies("daily", fixedDate));
    // } else {
    // }

    if (movieList.length) return;
    if (!movieList.length) {
      path.includes("weekly")
        ? dispatch(getMovies("weekly", sunday))
        : dispatch(getMovies("daily", fixedDate));
    } else {
    }
  }, [dispatch]);
  //data 의존성 추가하면 날짜값 재설정시 계속 호출됨
  //change 추가하면 계속 오늘자 데이터나옴

  //SyntheticEvent!!!!!!!!!!!!!!!!!!!!

  const fixedDate = moment().format("YYYYMMDD") - 1;
  const sunday =
    moment()
      .startOf("isoWeek")
      .format("YYYYMMDD") - 1;

  const handleClick = period => {
    if (period === "weekly") {
      date > sunday
        ? dispatch(getMovies(period, sunday))
        : dispatch(getMovies(period, date));
    } else {
      dispatch(getMovies(period, date));
    }
  };

  const handleChangeDate = e => {
    if (e.target.name === "prev") {
      period === "daily"
        ? dispatch(getMovies(period, parseInt(date) - 1))
        : dispatch(getMovies(period, parseInt(showRange[0]) - 1));
    } else {
      period === "daily"
        ? dispatch(getMovies(period, parseInt(date) + 1))
        : dispatch(getMovies(period, parseInt(showRange[1]) + 1));
    }
  };

  const nextDate = () => {
    console.log("nextDate");
    if (period === "daily") {
      return date !== fixedDate ? "on" : "";
    } else {
      return parseInt(showRange[1]) !== sunday ? "on" : "";
    }
  };

  const activeStyle = {
    color: "red",
    border: "1px solid red",
    fontWeight: "bold"
  };

  if (loading)
    return (
      <div>
        <img src={load} alt="Loading" />
      </div>
    );
  if (error) return <div>에러 발생</div>;
  if (!movieList.length) return <div>데이터 없음</div>;

  return (
    <MovieList
      loading={loading}
      onClick={handleClick}
      date={date}
      movieList={movieList}
      showRange={showRange}
      onChangeDate={handleChangeDate}
      period={period}
      activeStyle={activeStyle}
      nextDate={nextDate}
    />
  );
}

export default MovieListContainer;
