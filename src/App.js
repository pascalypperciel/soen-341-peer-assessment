import React from "react";
import "./styles/styles.scss";
import navigation from "./data";
import { ReactComponent as Logo } from "./assets/concordia-university-1.svg";

import Header from "./components/Header";

export default function App() {
  return (
    <div className="App">
      <Header items={navigation} logo={<Logo />} navPosition="center" />
      <section className="hero">
        <img src="Concordia-background.jpg" alt="Extinctable" />
      </section>
    </div>
  );
}
