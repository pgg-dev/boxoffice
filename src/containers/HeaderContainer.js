import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import { setLogout, setLogin } from "../modules/movies";
import { getMovies } from "../modules/movies";
import moment from "moment";

function HeaderContainer() {
  console.log("/containers/HeaderContainer");
  const { visible } = useSelector(state => state.movies);
  const { period, date } = useSelector(state => state.movies.movies);
  const { status, provider, id } = useSelector(state => state.movies.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!status && provider) {
      const provider = window.sessionStorage.getItem("provider");

      if (provider === "kakao") {
        if (!window.Kakao.hasOwnProperty("Auth")) {
          window.Kakao.init("09cacdaaabf08e5b95d7d9c603f1361b");
        }
        window.Kakao.Auth.getStatusInfo(data => {
          // dispatch(
          //   setLogin(provider, data.user.id, data.user.properties.nickname)
          // );
        });
      } else {
        if (window.gapi.hasOwnProperty("auth2")) {
          const logout = window.gapi.auth2.getAuthInstance();
          logout.signOut();
          console.log("구글 로그아웃 성공");
          dispatch(setLogout());
          window.sessionStorage.clear();
        } else {
          window.gapi.load("auth2", () => {
            window.gapi.auth2.init({
              client_id:
                "822311017221-vqnjoe6mjbljr9cp1dvoeahjil2mhh9v.apps.googleusercontent.com"
            });
          });
        }
      }
    }
  }, [dispatch, id, status]);

  if (!visible) return null;

  const onLogout = () => {
    console.log("onLogout");
    if (provider === "kakao") {
      window.Kakao.Auth.logout();
      console.log("카카오 로그아웃 성공");
      dispatch(setLogout());
      window.sessionStorage.clear();
    } else {
      const logout = window.gapi.auth2.getAuthInstance();
      logout.signOut();
      console.log("구글 로그아웃 성공");
      dispatch(setLogout());
      window.sessionStorage.clear();
    }
  };
  // switch (provider) {
  //   case "kakao":
  //     return window.Kakao.Auth.logout();
  //   case "google":
  //     const logout = window.gapi.auth2.getAuthInstance();
  //     logout.signOut();
  //     return console.log("구글 로그아웃 성공");
  //   default:
  //     break;
  // }
  // dispatch(setLogout());
  // window.sessionStorage.clear();

  let changeDate = "";
  const handleChange = e => {
    changeDate = e.target.value;
  };

  const handleClick = e => {
    if (!isDateFormat(changeDate)) {
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

  const dateCheck = () => {
    const fixedDate = moment().format("YYYYMMDD") - 1;
    if (fixedDate < parseInt(changeDate)) {
      alert("검색 할 수 없습니다.");
    } else {
      if (period === "daily") {
        if (fixedDate === parseInt(changeDate)) {
          dispatch(getMovies(changeDate, period, false));
        } else {
          dispatch(getMovies(changeDate, period, true));
        }
      } else {
        const sunday =
          moment()
            .startOf("isoWeek")
            .format("YYYYMMDD") - 1;

        if (
          sunday - 6 <= parseInt(changeDate) &&
          parseInt(changeDate) <= sunday
        ) {
          dispatch(getMovies(changeDate, "weekly", false));
        } else if (sunday > parseInt(changeDate)) {
          dispatch(getMovies(changeDate, "weekly", true));
        } else {
          alert("가장 최근 데이터는 저번 주입니다.");
        }
      }
    }

    // if (period === "daily") {
    //   if (fixedDate < changeDate) {
    //     alert("검색 할 수 없습니다.");
    //   } else {
    //     if (fixedDate === changeDate) {
    //       dispatch(getMovies(changeDate, period, false));
    //     } else {
    //       dispatch(getMovies(changeDate, period, true));
    //     }
    //   }
    // } else {
    //   const sunday =
    //     moment()
    //       .startOf("isoWeek")
    //       .format("YYYYMMDD") - 1;
    //   console.log(sunday);
    //   console.log(changeDate);

    //   if (sunday <= changeDate) {
    //     dispatch(getMovies(changeDate, "weekly", false));
    //   } else {
    //     alert("검색 할 수 없습니다.");
    //   }
    // }
  };
  return (
    <Header
      loginStatus={status}
      onLogout={onLogout}
      onClick={handleClick}
      onChange={handleChange}
      date={date}
    />
  );
}

export default HeaderContainer;
