import React from "react";
import MovieContainer from "../containers/MovieContainer";

function MoviePage({ match }) {
  console.log("pages/MoviePage");
  const { movieId } = match.params;

  return <MovieContainer movieId={movieId} />;
}

export default MoviePage;
