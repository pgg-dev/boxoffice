import React from "react";
import { Link } from "react-router-dom";
import "../style/Header.css";

function Header({ loginStatus, onLogin, onLogout }) {
  console.log("components/Header");
  // console.log("////////////////////////////////");
  // console.log(window.location.pathname);
  return (
    <div className="header">
      {loginStatus ? (
        <button className="loginButton" onClick={onLogout}>
          <Link to="/" className="loginLink">
            로그아웃
          </Link>
        </button>
      ) : (
        <button className="loginButton" onClick={onLogin}>
          <Link to="/login" className="loginLink">
            로그인 / 가입
          </Link>
        </button>
      )}

      <h1 className="homeTitle">
        <Link to="/" className="homeLink">
          BOX OFFICE
        </Link>
      </h1>
    </div>
  );
}

export default Header;
