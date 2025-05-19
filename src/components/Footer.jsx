import React from "react";
import "../styles/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="container footer">
      <div className="footer-wrapper">
        <div className="footer-group">
          <div className="logo">
            <img src="/assets/images/lsd-footer-logo.png" alt="lsd-logo" />
          </div>

          <div className="connection">
            <div className="footer-title">
              <span> &copy;</span>
              <p>2025 LSD PIERCING |</p>
            </div>
            <div className="phone-number">
              <p>Телефон:</p>
              <a className="phone-number-link" href="tel:380974511990">
                +380974511990
              </a>
            </div>
          </div>
        </div>

        <div className="footer-group">
          <div className="location">
            <a
              className="maps-link"
              target="_blank"
              href="https://maps.app.goo.gl/6YjnMiK5TpeTRmvu6"
            >
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>{" "}
              Вінниця, вул. Тетаральна, 4
            </a>
          </div>

          <div className="social">
            <a
              className="instagram-link"
              target="_blank"
              href="https://www.instagram.com/piercing.lsd/"
            >
              <i className="fab fa-instagram"></i> {`Instagram  `}
            </a>
            <span>| </span>

            <a
              className="telegram-link"
              target="_blank"
              href="https://t.me/LSDpiercing"
            >
              <i className="fab fa-telegram"></i> Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
