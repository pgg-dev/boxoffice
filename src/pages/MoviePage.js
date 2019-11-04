import React from "react";
import MovieContainer from "../containers/MovieContainer";

function MoviePage({ match }) {
  console.log("pages/MoviePage");
  const { rank } = match.params;

  console.log(match);
  return <MovieContainer rank={rank} />;
}

export default MoviePage;
