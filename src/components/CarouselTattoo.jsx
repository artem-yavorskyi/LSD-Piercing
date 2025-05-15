import React from "react";
import "../styles/styles.css";
import FadeInBlurForCarousel from "./FadeInBlurForCarousel";

const images = [
  "/assets/images/tattoo1.avif",
  "/assets/images/tattoo2.avif",
  "/assets/images/tattoo3.avif",
  "/assets/images/tattoo4.avif",
  "/assets/images/tattoo5.avif",
  "/assets/images/tattoo6.avif",
  "/assets/images/tattoo7.avif",
  "/assets/images/tattoo8.avif",
  "/assets/images/tattoo9.avif",
  "/assets/images/tattoo10.avif",
];

const CarouselTattoo = () => {
  return (
    <div className="carousel-wrapper carousel-tattoo">
      <h2>Роботи з тату</h2>
      <FadeInBlurForCarousel>
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
