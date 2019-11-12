import React from "react";
import MovieContainer from "../containers/MovieContainer";

function MoviePage({ match }) {
  console.log("pages/MoviePage");
  const { movieID } = match.params;

  console.log(match);
  return <MovieContainer movieID={movieID} />;
}

export default MoviePage;
