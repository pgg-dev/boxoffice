import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

function Header({ loginStatus, onLogin, onLogout }) {
  return (
    <HeaderContainer>
      {loginStatus ? (
        <LoginButton onClick={onLogout}>
          <LoginLink to="/">로그아웃</LoginLink>
        </LoginButton>
      ) : (
        <LoginButton onClick={onLogin}>
          <LoginLink to="/login">로그인 / 가입</LoginLink>
        </LoginButton>
      )}
      <HomeTitle>
        <HomeLink to="/">BOX OFFICE</HomeLink>
      </HomeTitle>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  text-align: center;
`;

const LoginButton = styled.button`
  position: relative;
  right: -100%;
  padding: 7px;
  box-sizing: border-box;
  font-size: 17px;
  font-family: "Nanum Gothic", sans-serif;
  font-weight: 800;
  background: #03cf5d;
  border: 3px solid #03cf5d;
  border-radius: 20px;
`;

const LoginLink = styled(Link)`
  text-decoration: none;
  color: white;
`;

const HomeTitle = styled.h1`
  font-size: 65px;
  font-family: "Viga", sans-serif;
  letter-spacing: 5px;
  margin: 30px;
`;

const HomeLink = styled(Link)`
  text-decoration: none;
  color: #03cf5d;
`;

export default Header;
