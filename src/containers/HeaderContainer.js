import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import { setLogout, setLogin } from "../modules/movies";

function HeaderContainer() {
  console.log("/containers/HeaderContainer");
  const { visible } = useSelector(state => state.movies);
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

  return <Header loginStatus={status} onLogout={onLogout} />;
}

export default HeaderContainer;
