import React from "react";
import GoogleLogin from "react-google-login";
import KakaoLogin from "react-kakao-login";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Login({ responseGoogle, responseKakao, responseFail }) {
  return (
    <Container>
      <HomeLink to="/">
        <HomeTitle>BOX OFFICE</HomeTitle>
      </HomeLink>

      <GoogleLogin
        clientId="822311017221-vqnjoe6mjbljr9cp1dvoeahjil2mhh9v.apps.googleusercontent.com"
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
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HomeTitle = styled.span`
  font-size: 65px;
  font-family: "Viga", sans-serif;
  letter-spacing: 5px;
  margin: 30px;
`;

const HomeLink = styled(Link)`
  text-decoration: none;
  color: #03cf5d;
`;
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
