import React from "react";
import { Link } from "react-router-dom";
import user from "../images/user.png";
import { MdSearch } from "react-icons/md";
import "./Header.scss";

function Header({ loginStatus, onLogin, onLogout, onClick, onChange, date }) {
  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">
          <Link className="header__link" to="/">
            BOX OFFICE
          </Link>
        </h1>
        {loginStatus ? (
          <div className="login">
            <button onClick={onLogout}>
              <Link className="login__link" to="/">
                로그아웃
              </Link>
            </button>
            <div>
              <img src={user} />
            </div>
          </div>
        ) : (
          <div className="login">
            <button className="login__btn" onClick={onLogin}>
              <Link className="login__link" to="/login">
                로그인 / 가입
              </Link>
            </button>
          </div>
        )}

        <div className="search__content">
          <input
            className="search__input"
            placeholder="yyyymmdd"
            onChange={onChange}
          />
          <button className="search__button" onClick={onClick}>
            <MdSearch />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
