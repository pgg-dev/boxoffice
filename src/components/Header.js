import React from "react";
import { Link } from "react-router-dom";
import user from "../images/user.png";
import { MdSearch } from "react-icons/md";
import "./Header.scss";

function Header({ loginStatus, onLogin, onLogout, onClick, onChange }) {
  return (
    <div className="headerContainer">
      <h1 className="title">
        <Link className="HomeLink" to="/">
          BOX OFFICE
        </Link>
      </h1>
      <div className="box">
        <div className="search">
          <input
            className="searchData"
            placeholder="yyyymmdd"
            onChange={onChange}
          />
          <button className="searchButton" onClick={onClick}>
            <MdSearch />
          </button>
        </div>
      </div>
      {loginStatus ? (
        <div className="login">
          <button className="loginButton" onClick={onLogout}>
            <Link className="loginLink" to="/">
              로그아웃
            </Link>
          </button>
          <div>
            <img src={user} />
          </div>
        </div>
      ) : (
        <div className="login">
          <button className="loginButton" onClick={onLogin}>
            <Link className="loginLink" to="/login">
              로그인 / 가입
            </Link>
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
