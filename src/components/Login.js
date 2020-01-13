import React from "react";
import GoogleLogin from "react-google-login";
import KakaoLogin from "react-kakao-login";
import styled from "styled-components";
import { Link } from "react-router-dom";
import "../styles/Login.scss";

function Login({ responseGoogle, responseKakao, responseFail }) {
  return (
    <div className="login-container">
      <div className="login-inner">
        <div className="login-contents">
          <span className="home-name">
            <Link to="/" className="home-link">
              BOX OFFICE
            </Link>
          </span>
          <GoogleLogin
            clientId="822311017221-h01ovlahim0ki0mo0k2pt9qv7260u3r3.apps.googleusercontent.com"
            render={renderProps => (
              <GoogleButton
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                구글로 시작
              </GoogleButton>
            )}
            onSuccess={responseGoogle}
            onFailure={responseFail}
          />

          <KakaoButton
            jsKey="09cacdaaabf08e5b95d7d9c603f1361b"
            buttonText="카카오로 시작"
            onSuccess={responseKakao}
            onFailure={responseFail}
          />
        </div>
      </div>
    </div>
  );
}

const KakaoButton = styled(KakaoLogin)`
  padding: 0;
  margin: 10px;
  width: 230px;
  height: 49px;
  line-height: 49px;
  color: #3c1e1e;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`;

const GoogleButton = styled.button`
  padding: 0;
  margin: 10px;
  width: 230px;
  height: 49px;
  line-height: 49px;
  color: #3c1e1e;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`;

export default Login;
