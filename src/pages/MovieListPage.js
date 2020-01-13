import React from "react";
import MovieListContainer from "../containers/MovieListContainer";

function MovieListPage({ match, location }) {
  console.log("pages/MovieListPage");
  console.log(match);
  console.log(location);
  const { path } = match;
  return <MovieListContainer path={path} />;
}

export default MovieListPage;
