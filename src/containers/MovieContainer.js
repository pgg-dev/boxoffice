import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Movie from "../components/Movie";
import { getMovie } from "../modules/movies";

function MovieContainer({ rank }) {
  const { data, loading, error } = useSelector(state => state.movies.movie);
  const { status } = useSelector(state => state.movies.login);
  const dispatch = useDispatch();
  const databaseURL = "https://boxoffice-app.firebaseio.com";

  useEffect(() => {
    dispatch(getMovie(rank));
    readComment();
  }, [rank, dispatch]);

  const test = "";
  const readComment = () => {
    console.log("readComment");
    fetch(`${databaseURL}/comments.json`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(data => console.log(data));
  };

  const writeComment = comment => {
    console.log("write");
    return fetch(`${databaseURL}/comments.json`, {
      method: "POST",
      body: JSON.stringify(comment)
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    });
    // .then(data => {
    //   let nextState = this.state.words;
    //   nextState[data.name] = word;
    //   this.setState({ words: nextState });
    // });
  };

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return <div>데이터 없음</div>;

  return <Movie movie={data} isLogin={status} />;
}

export default MovieContainer;
