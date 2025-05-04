import React from "react";
import "../styles/styles.css";

const images = [
  "/assets/images/piercing1.JPG",
  "/assets/images/piercing2.JPG",
  "/assets/images/piercing3.JPG",
  "/assets/images/piercing4.JPG",
  "/assets/images/piercing5.JPG",
  "/assets/images/piercing6.JPG",
  "/assets/images/piercing7.JPG",
  "/assets/images/piercing8.JPG",
  "/assets/images/piercing9.JPG",
  "/assets/images/piercing10.JPG",
];

const CarouselPiercing = () => {
  return (
    <div className="carousel-wrapper carousel-piercing">
      <h2>Роботи з пірсингом</h2>
      <div className="track-piercing">
        {[...images, ...images].map((img, index) => (
          <div className="carousel-item" key={index}>
            <img src={img} alt={`Зображення ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselPiercing;
