import React, { useState } from "react";

const NavTabs = ({ activeTab, setActiveTab }) => {
  const toggleMenu = () => setIsMenuOpened((prev) => !prev);
  const closeMenu = () => setIsMenuOpened(false);

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    closeMenu();
  };

  return (
    <nav className="tabs">
      <div className="tabs-desktop">
        <button
          onClick={() => setActiveTab("home")}
          className={activeTab === "home" ? "active" : ""}
        >
          Головна
        </button>
        <button
          onClick={() => setActiveTab("studying")}
          className={activeTab === "studying" ? "active" : ""}
        >
          Навчання
        </button>
        <button
          onClick={() => setActiveTab("pricelist")}
          className={activeTab === "pricelist" ? "active" : ""}
        >
          Прайс-ліст
        </button>
        <button
          onClick={() => setActiveTab("care")}
          className={activeTab === "care" ? "active" : ""}
        >
          Догляд
        </button>
      </div>
      <div className="mobile-nav">
        <img src="/assets/images/lsd-footer-logo.png"></img>
        <div
          className={`hamburger ${isMenuOpened ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {isMenuOpened && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <button
              onClick={() => handleTabClick("home")}
              className={activeTab === "home" ? "active" : ""}
            >
              Головна
            </button>
            <button
              onClick={() => handleTabClick("studying")}
              className={activeTab === "studying" ? "active" : ""}
            >
              Навчання
            </button>
            <button
              onClick={() => handleTabClick("pricelist")}
              className={activeTab === "pricelist" ? "active" : ""}
            >
              Прайс-ліст
            </button>
            <button
              onClick={() => handleTabClick("care")}
              className={activeTab === "care" ? "active" : ""}
            >
              Догляд
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavTabs;
