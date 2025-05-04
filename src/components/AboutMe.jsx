import React from "react";

const AboutMe = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="about-me">
      <h2>Про мене</h2>
      <div className="qoute-container">
        <p className="quote">
          Привіт! Я - Ліза. Працюю пірсером вже 4 роки і тату-майстром 2 роки.
          За цей час я навчилася створювати унікальні тату, виконувати
          різноманітний пірсинг, ставити мікродермали та створювати корсети. Моя
          мета — надавати клієнтам якісні послуги та допомагати втілювати їхні
          ідеї в реальність.
        </p>
      </div>
    </div>
  );
});

export default AboutMe;
