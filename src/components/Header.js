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
        <Link to="/" className="loginLink">
          <button className="loginButton" onClick={onLogout}>
            로그아웃
          </button>
        </Link>
      ) : (
        <Link
          to="/login"
          className="loginLink"
          state={{ test: window.location.pathname }}
        >
          <button className="loginButton" onClick={onLogin}>
            로그인 / 가입
          </button>
        </Link>
      )}

      <Link to="/" className="homeLink">
        <h1 className="homeTitle">BOX OFFICE</h1>
      </Link>
    </div>
  );
}

export default Header;
