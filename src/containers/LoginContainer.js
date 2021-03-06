import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import Login from "../components/Login";
import { setHeaderVisibility, setLogin } from "../modules/movies";

function LoginContainer({ history }) {
  console.log("containers/LoginContainer");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderVisibility(false));
    return () => {
      dispatch(setHeaderVisibility(true));
    };
  }, [dispatch]);

  const responseGoogle = res => {
    console.log(res);
    loginProvider("google", res.googleId, res.profileObj.name);
  };

  const responseKakao = res => {
    console.log(res);
    window.Kakao.API.request({
      url: "/v2/user/me",
      success: res => {
        console.log(res);
        loginProvider("kakao", res.id, res.properties.nickname);
      },
      fail: error => {
        console.log(error);
      }
    });
  };

  const responseFail = err => {
    console.error(err);
  };

  const loginProvider = (provider, id, name) => {
    window.sessionStorage.setItem("provider", provider);
    dispatch(setLogin(provider, id, name));
    history.goBack();
  };

  return (
    <Login
      responseGoogle={responseGoogle}
      responseKakao={responseKakao}
      responseFail={responseFail}
    />
  );
}

export default withRouter(LoginContainer);
