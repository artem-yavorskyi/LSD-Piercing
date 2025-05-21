import React, { useEffect, useRef, useState } from "react";

import "../../../styles/base/styles.css";
import FadeInBlurForCarousel from "../../common/FadeInBlurForCarousel";

const images = [
  "/assets/images/tattoo1-resized.avif",
  "/assets/images/tattoo2-resized.avif",
  "/assets.images/tattoo3-resized.avif",
  "/assets/images/tattoo4-resized.avif",
  "/assets/images/tattoo5-resized.avif",
  "/assets/images/tattoo6-resized.avif",
  "/assets/images/tattoo7-resized.avif",
  "/assets/images/tattoo8-resized.avif",
  "/assets/images/tattoo9-resized.avif",
  "/assets/images/tattoo10-resized.avif",
];

const CarouselTattoo = () => {
  const [translateX, setTranslateX] = useState(0);
  const trackRef = useRef(null);
  const animationFrameId = useRef(null);
  const singleSetWidth = useRef(0);
  const isAnimating = useRef(false);
  const initialPositionSet = useRef(false);

  useEffect(() => {
    const trackElement = trackRef.current;
    if (!trackElement) return;

    const measureWidth = () => {
      const items = trackElement.querySelectorAll(".carousel-item");
      let totalWidth = 0;
      const numItemsInSet = images.length;

      if (numItemsInSet === 0 || items.length === 0) {
        singleSetWidth.current = 0;
        return;
      }

      for (let i = 0; i < numItemsInSet && i < items.length; i++) {
        const item = items[i];
        const style = getComputedStyle(item);
        const marginRight = parseFloat(style.marginRight) || 0;
        totalWidth += item.offsetWidth + marginRight;
      }

      singleSetWidth.current = totalWidth;
    };

    const imagesLoadedAndMeasure = () => {
      const imgs = trackElement.querySelectorAll(".carousel-item img");
      const totalImgsInSet = images.length;

      if (totalImgsInSet === 0) {
        measureWidth();
        return;
      }

      const loadingPromises = Array.from(imgs)
        .slice(0, totalImgsInSet)
        .map((img) => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.addEventListener("load", resolve);
              img.addEventListener("error", resolve);
            }
          });
        });

      Promise.all(loadingPromises)
        .then(() => {
          measureWidth();

          if (singleSetWidth.current > 0 && !initialPositionSet.current) {
            setTranslateX(-singleSetWidth.current);
            initialPositionSet.current = true;
          }

          if (
            singleSetWidth.current > 0 &&
            !isAnimating.current &&
            initialPositionSet.current
          ) {
            animate();
            isAnimating.current = true;
          }
        })
        .catch((error) => {
          console.error("Error loading images:", error);
          measureWidth();
          if (
            singleSetWidth.current > 0 &&
            !isAnimating.current &&
            initialPositionSet.current
          ) {
            animate();
            isAnimating.current = true;
          }
        });
    };

    imagesLoadedAndMeasure();

    const animate = () => {
      const speed = 0.7;

      setTranslateX((prevX) => {
        let newX = prevX + speed;

        if (singleSetWidth.current > 0 && newX >= 0) {
          newX = newX - singleSetWidth.current;
        }

        return newX;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isAnimating.current = false;
    };
  }, []);

  return (
    <div className="carousel-wrapper carousel-tattoo">
      <FadeInBlurForCarousel>
        <h2>Роботи з тату</h2>
        <div
          className="track-tattoo"
          ref={trackRef}
          style={{
            transform: `translateX(${translateX}px)`,
            animation: "none",
            width: "max-content",
          }}
        >
          {[...images, ...images].map((img, index) => (
            <div className="carousel-item" key={`${index}-${img}`}>
              <img src={img} />
            </div>
          ))}
        </div>
      </FadeInBlurForCarousel>
    </div>
  );
};

export default CarouselTattoo;
