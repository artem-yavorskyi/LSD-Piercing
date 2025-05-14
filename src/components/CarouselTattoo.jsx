import React from "react";
import "../styles/styles.css";
import FadeInBlur from "./FadeInBlur";

const images = [
  "/assets/images/tattoo1.JPG",
  "/assets/images/tattoo2.JPG",
  "/assets/images/tattoo3.JPG",
  "/assets/images/tattoo4.JPG",
  "/assets/images/tattoo5.JPG",
  "/assets/images/tattoo6.JPG",
  "/assets/images/tattoo7.JPG",
  "/assets/images/tattoo8.JPG",
  "/assets/images/tattoo9.JPG",
  "/assets/images/tattoo10.JPG",
];

const CarouselTattoo = () => {
  return (
    <div className="carousel-wrapper carousel-tattoo">
      <h2>Роботи з тату</h2>
      <FadeInBlur delay={0.1}>
        <div className="track-tattoo">
          {[...images, ...images].map((img, index) => (
            <div className="carousel-item" key={index}>
              <img src={img} alt={`Зображення ${index}`} />
            </div>
          ))}
        </div>
      </FadeInBlur>
    </div>
  );
};

export default CarouselTattoo;
