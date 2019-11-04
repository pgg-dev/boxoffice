import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Login from "../components/Login";
import { setHeaderVisibility, setLogin, goToHome } from "../modules/movies";

function LoginContainer() {
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
    loginProvider("google");
  };

  const responseKakao = res => {
    console.log(res);
    loginProvider("kakao");
  };

  const responseFail = err => {
    console.error(err);
  };

  const loginProvider = provider => {
    window.sessionStorage.setItem("provider", provider);

    // window.localStorage.setItem("kakaoAuth", res);

    dispatch(goToHome());

    dispatch(setLogin(provider));
  };

  return (
    <Login
      responseGoogle={responseGoogle}
      responseKakao={responseKakao}
      responseFail={responseFail}
    />
  );
}

export default LoginContainer;
