import React, { useState, useRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import NavTabs from "./components/common/NavTabs";

import Home from "./pages/Home";
import Studying from "./pages/Studying";
import PriceList from "./pages/PriceList";
import Care from "./pages/Care";

import Footer from "./components/common/Footer";

const App = () => {
  const location = useLocation();

  return (
    <>
      <NavTabs />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studying" element={<Studying />} />
        <Route path="/pricelist" element={<PriceList />} />
        <Route path="/care" element={<Care />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
