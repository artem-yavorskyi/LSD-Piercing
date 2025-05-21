import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavTabs = ({ activeTab, setActiveTab }) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const isActive = (path) => location.pathname === path;

  const location = useLocation();

  const toggleMenu = () => setIsMenuOpened((prev) => !prev);
  const closeMenu = () => setIsMenuOpened(false);

  const handleTabClick = (path) => {
    closeMenu();
  };

  return (
    <nav className="tabs">
      <div className="tabs-desktop">
        <Link to="/" className={isActive("/") ? "active" : ""}>
          Головна
        </Link>

        <Link to="/studying" className={isActive("/studying") ? "active" : ""}>
          Навчання
        </Link>

        <Link
          to="/pricelist"
          className={isActive("/pricelist") ? "active" : ""}
        >
          Прайс-ліст
        </Link>

        <Link to="/care" className={isActive("/care") ? "active" : ""}>
          Догляд
        </Link>
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
            <Link
              to="/"
              onClick={() => handleTabClick("/")}
              className={isActive("/") ? "active" : ""}
            >
              Головна
            </Link>
            <Link
              to="/studying"
              onClick={() => handleTabClick("/studying")}
              className={isActive("/studying") ? "active" : ""}
            >
              Навчання
            </Link>
            <Link
              to="/pricelist"
              onClick={() => handleTabClick("/pricelist")}
              className={isActive("/pricelist") ? "active" : ""}
            >
              Прайс-ліст
            </Link>
            <Link
              to="/care"
              onClick={handleTabClick("/care")}
              className={isActive("/care") ? "active" : ""}
            ></Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavTabs;
