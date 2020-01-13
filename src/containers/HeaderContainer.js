import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import { getUser } from "../modules/movies";
import { getMovies } from "../modules/movies";
import moment from "moment";
import { withRouter } from "react-router-dom";

function HeaderContainer() {
  console.log("/containers/HeaderContainer");

  const { visible } = useSelector(state => state.movies);
  const { period } = useSelector(state => state.movies.movies);
  const { login, id,name } = useSelector(state => state.movies.user);
  const dispatch = useDispatch();
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate("");
    const getSession = window.sessionStorage.getItem("provider");
    if (!login && getSession) {
      if (getSession === "kakao") {
        if (!window.Kakao.hasOwnProperty("Auth")) {
          window.Kakao.init("09cacdaaabf08e5b95d7d9c603f1361b");
        }
        window.Kakao.Auth.getStatusInfo(data => {
          if (data.status === "connected") {
            dispatch(getUser(data.user.id));
          }
        });
      } else {
        if (!window.gapi.hasOwnProperty("auth2")) {
          window.gapi.load("auth2", () => {
            window.gapi.auth2
              .init({
                client_id:
                  "822311017221-vqnjoe6mjbljr9cp1dvoeahjil2mhh9v.apps.googleusercontent.com"
              })
              .then(user => {
                const userId = user.currentUser.get().getId();
                dispatch(getUser(userId));
              });
          });
        }
      }
    }
  }, [dispatch, id, login]);

  if (!visible) return null;

  const handleChange = e => {
    setDate(e.target.value);
  };

  const handleSearch = e => {
    e.preventDefault();
    if (!isDateFormat(date)) {
      alert("날짜를 정확히 입력해주세요.");
    } else {
      dateCheck();
    }
  };

  function isDateFormat(val) {
    var regex_date = /^\d{4}\d{1,2}\d{1,2}$/;
    // Check the pattern
    if (!regex_date.test(val)) {
      return false;
    }

    var year = val[0] + val[1] + val[2] + val[3];
    var month = val[4] + val[5];
    var day = val[6] + val[7];
    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month === 0 || month > 12) {
      return false;
    }
    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLength[1] = 29;
    }
    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  }

  const fixedDate = moment().format("YYYYMMDD") - 1;
  const sunday =
    moment()
      .startOf("isoWeek")
      .format("YYYYMMDD") - 1;
  const dateCheck = () => {
    if (fixedDate < parseInt(date)) {
      period === "daily"
        ? alert("가장 최근 데이터는 어제입니다.")
        : alert("가장 최근 데이터는 저번 주입니다.");
    } else {
      if (period === "daily") {
        dispatch(getMovies(period, date));
      } else {
        if (sunday - 6 <= parseInt(date) && parseInt(date) <= sunday) {
          dispatch(getMovies(period, date));
        } else if (sunday > parseInt(date)) {
          dispatch(getMovies(period, date));
        } else {
          alert("가장 최근 데이터는 저번 주입니다.");
        }
      }
    }
  };

  const handleClick = () => {
    dispatch(getMovies("daily", fixedDate));
  };
  return (
    <Header
      login={login}
      onSearch={handleSearch}
      onChange={handleChange}
      period={period}
      date={date}
      onClick={handleClick}
      name={name}
    />
  );
}

export default withRouter(HeaderContainer);
