import React, { useState, useEffect } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  useParams,
} from "react-router-dom";
import "./App.css";
import CategoriasPage from "./pages/Categorias";
import ScoreBoard from "./components/Home/scoreBoard";
import Header from "./components/Common/Header";
import Lobby from "./components/Home/Lobby";
import LandingPage from "./components/Home/LandingPage";
import InitialPage from "./pages/Pogodi";
import Create from "./components/Home/Create";
import VikingosPage from "./pages/Vikingos";
import Music from "./components/Common/Music";
//import Graph from "./components/Common/Graph";
import Game from "./components/Pogodi/Game";
import es from "./locals/es.json";
import en from "./locals/en.json";
import fr from "./locals/en.json";
import { IntlProvider } from "react-intl";
const data = {
  es: es,
  en: en,
  fr: fr
};
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [language, setLanguage] = useState("en");
  const [localeMessages, setLocaleMessages] = useState({});
  useEffect(() => {
    let le = navigator.language.split(/[-_]/)[0];
    if ( ! (le in data))
    {
      le = 'en';
    }
    setLanguage (le);

    const inf = data[le];
    setLocaleMessages(inf);
  });
  return (
    <Router>
      <IntlProvider locale={language} messages={localeMessages}>
        <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <main>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/score-board/:farita/:username"  exact component={ScoreBoard} />
            <Route path="/lobby/:farita/:username" exact component={Lobby} />
            <Route
              path="/:farita/pogodi/:username"
              exact
              component={InitialPage}
            />
            <Route path="/create/:username" exact component={Create} />
            <Route path="/pogodiPlay" exact component={Game} />
            <Route
              path="/:farita/categorias-explosivas/:username"
              exact
              component={CategoriasPage}
            />
            <Route
              path="/:farita/Vikingos/:username"
              exact
              component={VikingosPage}
            />
          </Switch>
        </main>
      </IntlProvider>
    </Router>
  );
}

export default App;
