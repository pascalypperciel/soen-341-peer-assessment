import React from "react";
import "./styles/styles.scss";
import navigation from "./data/data";
import Logo from "../Assets/conco-logo.png";

import Header from "./Header";

export default function Main() {
  return (
    <div className="App">
      <Header items={navigation} logo={<img src={Logo} alt="Logo" height={150} />} navPosition="center" />
      
    </div>
  );
}