import React from "react";
import "./styles/styles.scss";
import navigation from "./data";
import Logo from "../Assets/conco-logo.png"

import Header from "./Header2";

export default function Header2() {
  return (
    <div className="App">
      <Header items={navigation} logo={<Logo />} navPosition="center" />
      <section className="hero">
        <img src="Concordia-background.jpg" alt="Extinctable" />
      </section>
    </div>
  );
}
