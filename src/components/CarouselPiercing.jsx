import React from "react";
import "../styles/styles.css";
import FadeInBlurForCarousel from "./FadeInBlurForCarousel";

const images = [
  "/assets/images/piercing1.avif",
  "/assets/images/piercing2.avif",
  "/assets/images/piercing3.avif",
  "/assets/images/piercing4.avif",
  "/assets/images/piercing5.avif",
  "/assets/images/piercing6.avif",
  "/assets/images/piercing7.avif",
  "/assets/images/piercing8.avif",
  "/assets/images/piercing9.avif",
  "/assets/images/piercing10.avif",
];

const CarouselPiercing = () => {
  return (
    <div className="carousel-wrapper carousel-piercing">
      <h2>Роботи з пірсингом</h2>
      <FadeInBlurForCarousel>
        <div className="track-piercing">
          {[...images, ...images].map((img, index) => (
            <div className="carousel-item" key={index}>
              <img src={img} alt={`Зображення ${index}`} />
            </div>
          ))}
        </div>
      </FadeInBlurForCarousel>
    </div>
  );
};

export default CarouselPiercing;
