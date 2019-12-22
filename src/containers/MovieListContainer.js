import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMovies } from "../modules/movies";
import MovieList from "../components/MovieList";
import load from "../images/load.gif";
import moment from "moment";

function MovieListContainer() {
  const {
    dailyData,
    weeklyData,
    loading,
    error,
    date,
    period,
    showRange,
    next
  } = useSelector(state => state.movies.movies);
  const dispatch = useDispatch();

  useEffect(() => {
    if (dailyData || weeklyData) return;
    dispatch(getMovies(date, "daily", next));
  }, [dispatch]);
  //data 의존성 추가하면 날짜값 재설정시 계속 호출됨
  //change 추가하면 계속 오늘자 데이터나옴

  //SyntheticEvent!!!!!!!!!!!!!!!!!!!!

  const fixedDate = moment().format("YYYYMMDD") - 1;
  const sunday =
    moment()
      .startOf("isoWeek")
      .format("YYYYMMDD") - 1;
  const handleClick = e => {
    if (e.target.innerHTML === "일간") {
      if (date === fixedDate) {
        dispatch(getMovies(date, "daily", false));
      } else {
        dispatch(getMovies(date, "daily", true));
      }
    } else {
      if (sunday - 6 <= date && date <= sunday) {
        dispatch(getMovies(date, "weekly", false));
      } else if (sunday > date) {
        dispatch(getMovies(date, "weekly", true));
      } else {
        alert("가장 최근 데이터는 저번 주입니다.");
      }
    }
  };

  const handlePrev = () => {
    if (period === "daily") {
      dispatch(getMovies(date - 1, period, true));
    } else {
      dispatch(getMovies(parseInt(showRange[0]) - 1, period, true));
    }
  };

  const handleNext = () => {
    if (period === "daily") {
      if (date !== fixedDate) {
        dispatch(getMovies(parseInt(date) + 1, period, true));
      } else {
        dispatch(getMovies(parseInt(date) + 1, period, false));
      }
    } else {
      if (parseInt(showRange[1]) + 7 === sunday) {
        dispatch(getMovies(parseInt(showRange[1]) + 1, period, false));
      } else {
        dispatch(getMovies(parseInt(showRange[1]) + 1, period, true));
      }
    }
  };

  if (loading && !dailyData && !weeklyData)
    return (
      <div>
        <img src={load} alt="Loading..." />
      </div>
    );
  if (error) return <div>에러 발생</div>;
  if (!dailyData && !weeklyData) return <div>데이터 없음</div>;

  return (
    <MovieList
      loading={loading}
      onClick={handleClick}
      date={date}
      movies={period === "daily" ? dailyData : weeklyData}
      period={period}
      showRange={showRange}
      onPrev={handlePrev}
      onNext={handleNext}
      next={next}
    />
  );
}

export default MovieListContainer;
