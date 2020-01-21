import React from "react";
import { Link } from "react-router-dom";
import user from "../images/user.png";
import { MdSearch } from "react-icons/md";
import "../styles/Header.scss";

function Header({ login, onSearch, onChange, date, onClick, name }) {
  return (
    <header className="header section">
      <div className="inner">
        <h1 className="header-title" onClick={onClick}>
          <Link className="header-title__link" to="/">
            BOX OFFICE
          </Link>
        </h1>
        {login ? (
          <div className="login">
            <div className="user">
              <Link to="/user">
                <img src={user} />
                <span>
                  <strong>{name}</strong>님
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="login">
            <Link className="login__link" to="/login">
              <button className="login__btn">로그인 / 가입</button>
            </Link>
          </div>
        )}

        <form className="search__content">
          {/* <select>
            <option>날짜</option>
            <option>이름</option>
          </select> */}
          <input
            value={date}
            className="search__input"
            placeholder="yyyymmdd"
            onChange={onChange}
          />
          <button className="search__button" onClick={onSearch}>
            <MdSearch />
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
