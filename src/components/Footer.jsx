import React from "react";
import "../styles/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="container footer">
      <p>
        LSD PIERCING | Телефон: <a>+380 97 451 1990</a> |{" "}
        <a target="_blank" href="https://maps.app.goo.gl/6YjnMiK5TpeTRmvu6">
          <i className="fas fa-map-marker-alt" aria-hidden="true"></i> Вінниця,
          вул. Тетаральна, 4
        </a>
      </p>
      <a target="_blank" href="https://www.instagram.com/piercing.lsd/">
        <i className="fab fa-instagram"></i> {`Instagram | `}
      </a>
      <a target="_blank" href="https://t.me/LSDpiercing">
        <i className="fab fa-telegram"></i> Telegram
      </a>
    </footer>
  );
};

export default Footer;
