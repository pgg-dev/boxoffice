import React from "react";
import { Route, Switch } from "react-router-dom";
import MoviePage from "./pages/MoviePage";
import MovieListPage from "./pages/MovieListPage";
import LoginPage from "./pages/LoginPage";
import styled, { createGlobalStyle } from "styled-components";
import HeaderContainer from "./containers/HeaderContainer";

function App() {
  console.log("App");
  return (
    <React.Fragment>
      <GlobalStyle />
      <Container>
        <HeaderContainer />
        <Switch>
          <Route path="/" component={MovieListPage} exact />
          <Route path="/login" component={LoginPage} />
          <Route path="/:rank" component={MoviePage} />
        </Switch>
      </Container>
    </React.Fragment>
  );
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #eff3f7
  }
    `;
const Container = styled.div`
  flex-direction: column;
  box-sizing: border-box;
  padding: 30px;
`;
export default App;
