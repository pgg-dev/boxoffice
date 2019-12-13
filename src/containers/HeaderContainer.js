import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import { setLogout, setLogin } from "../modules/movies";
import { getMovies } from "../modules/movies";
import moment from "moment";

function HeaderContainer() {
  console.log("/containers/HeaderContainer");
  const { visible } = useSelector(state => state.movies);
  const { period, next } = useSelector(state => state.movies.movies);
  const { status, provider, id } = useSelector(state => state.movies.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!status) {
      const provider = window.sessionStorage.getItem("provider");
      if (provider) {
        if (!id) {
          let resetId = null;
          if (provider === "kakao") {
            if (!window.Kakao.hasOwnProperty("Auth")) {
              window.Kakao.init("09cacdaaabf08e5b95d7d9c603f1361b");
            }
            window.Kakao.Auth.getStatusInfo(data => {
              resetId = data.user.id;
              dispatch(setLogin(provider, resetId));
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
        } else {
          dispatch(setLogin(provider, id));
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
    dateCheck();
  };

  const dateCheck = () => {
    const fixedDate = moment().format("YYYYMMDD") - 1;
    if (period === "daily") {
      if (fixedDate < changeDate) {
        alert("검색 할 수 없습니다.");
      } else {
        if (fixedDate === changeDate) {
          dispatch(getMovies(changeDate, period, false));
        } else {
          dispatch(getMovies(changeDate, period, true));
        }
      }
    } else {
      const monday = moment().startOf("isoWeek");
      if (monday >= changeDate) {
        console.log("///////////");
        console.log(monday);
        alert("검색 할 수 없습니다.");
      } else {
        dispatch(getMovies(changeDate, "weekly", true));
      }
    }
  };
  return (
    <Header
      loginStatus={status}
      onLogout={onLogout}
      onClick={handleClick}
      onChange={handleChange}
    />
  );
}

export default HeaderContainer;
