import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MdSearch } from "react-icons/md";
import moment from "moment";

function MovieList({ onChange, onClick, movies, date }) {
  return (
    <MovieListContainer>
      <Search>
        <SearchData placeholder="yyyymmdd" onChange={onChange} />
        <SearchButton onClick={onClick}>
          <MdSearch />
        </SearchButton>
      </Search>
      <DateInfo>
        {moment(date.toString()).format("YYYY년 M월 D일")}
        기준
      </DateInfo>
      <Movies>
        {movies.map((movie, index) => (
          <Movie key={index}>
            <Rank>{index + 1}</Rank>
            <Link to={`/${movie.id}`}>
              <Poster src={movie.poster} alt={movie.title} />
            </Link>
            <MovieTitle>{movie.title}</MovieTitle>
          </Movie>
        ))}
      </Movies>
    </MovieListContainer>
  );
}

const MovieListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Nanum Gothic", sans-serif;
`;
const Search = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 470px;
  height: 45px;
  border: 2px solid #03cf5d;
  background: white;
  margin-bottom: 80px;
`;
const SearchData = styled.input`
  flex: 1;
  margin-left: 10px;
  border: 0;
  outline: none;
  font-size: 18px;
  font-weight: bold;
`;
const SearchButton = styled.button`
  display: flex;
  justify-content: center;
  width: 50px;
  outline: none;
  border: 0;
  background: #03cf5d;
  cursor: pointer;
  color: white;
  font-weight: bold;
  font-size: 30px;
`;
const DateInfo = styled.span`
  padding-left: 7%;
  font-size: 18px;
  align-self: flex-start;
`;
const Movies = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-family: "Nanum Gothic", sans-serif;
`;
const Movie = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 250px;
  margin: 0px 3% 20px;
`;
const Rank = styled.h1`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  text-align: center;
  width: 44px;
  height: 40px;
  background: #03cf5d;
  color: white;
  opacity: 0.8;
  position: relative;
  top: 22px;
  left: -20px;
`;
const Poster = styled.img`
  border: 1px solid #d9d9d9;
  height: 300px;
`;
const MovieTitle = styled.span`
  margin-top: 0;
  font-size: 25px;
  font-weight: bold;
`;

export default MovieList;
