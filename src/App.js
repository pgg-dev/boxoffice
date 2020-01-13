import React from "react";
import { Route, Switch } from "react-router-dom";
import MoviePage from "./pages/MoviePage";
import MovieListPage from "./pages/MovieListPage";
import HeaderContainer from "./containers/HeaderContainer";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import "./styles/App.scss";
function App() {
  console.log("App");
  return (
    <div className="wrap">
      <HeaderContainer />
      <Switch>
        <Route path="/weekly" component={MovieListPage} />
        <Route path="/user" component={UserPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/:movieId" component={MoviePage} />
        <Route path="/" component={MovieListPage} exact />
      </Switch>
    </div>
  );
}

export default App;
