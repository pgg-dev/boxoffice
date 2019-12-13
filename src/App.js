import React from "react";
import { Route, Switch } from "react-router-dom";
import MoviePage from "./pages/MoviePage";
import MovieListPage from "./pages/MovieListPage";
import HearderPage from "./pages/HearderPage";
import LoginPage from "./pages/LoginPage";
import "./App.scss";

function App() {
  console.log("App");
  return (
    <div className="container">
      <HearderPage />
      <Switch>
        <Route path="/" component={MovieListPage} exact />
        <Route path="/login" component={LoginPage} />
        <Route path="/:movieId" component={MoviePage} />
      </Switch>
    </div>
  );
}

export default App;
