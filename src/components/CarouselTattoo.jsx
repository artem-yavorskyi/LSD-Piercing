import React from "react";
import "../styles/styles.css";
import FadeInBlurForCarousel from "./FadeInBlurForCarousel";

const images = [
  "/assets/images/tattoo1-resized.avif",
  "/assets/images/tattoo2-resized.avif",
  "/assets/images/tattoo3-resized.avif",
  "/assets/images/tattoo4-resized.avif",
  "/assets/images/tattoo5-resized.avif",
  "/assets/images/tattoo6-resized.avif",
  "/assets/images/tattoo7-resized.avif",
  "/assets/images/tattoo8-resized.avif",
  "/assets/images/tattoo9-resized.avif",
  "/assets/images/tattoo10-resized.avif",
];

const CarouselTattoo = () => {
  return (
    <div className="carousel-wrapper carousel-tattoo">
      <FadeInBlurForCarousel>
        <h2>Роботи з тату</h2>
        <div className="track-tattoo">
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

export default CarouselTattoo;
