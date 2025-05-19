import React from "react";
import "../styles/styles.css";
import FadeInBlurForCarousel from "./FadeInBlurForCarousel";

const images = [
  "/assets/images/piercing2-resized.avif",
  "/assets/images/piercing1-resized.avif",
  "/assets/images/piercing3-resized.avif",
  "/assets/images/piercing4-resized.avif",
  "/assets/images/piercing5-resized.avif",
  "/assets/images/piercing6-resized.avif",
  "/assets/images/piercing7-resized.avif",
  "/assets/images/piercing8-resized.avif",
  "/assets/images/piercing9-resized.avif",
  "/assets/images/piercing10-resized.avif",
];

const CarouselPiercing = () => {
  return (
    <div className="carousel-wrapper carousel-piercing">
      <FadeInBlurForCarousel>
        <h2>Роботи з пірсингом</h2>
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
