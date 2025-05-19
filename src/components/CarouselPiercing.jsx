import React, { useEffect, useRef, useState } from "react"; // Додано useState
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
  // Стан для відстеження зсуву по осі X
  const [translateX, setTranslateX] = useState(0);
  // Реф для доступу до елемента доріжки (.track-piercing)
  const trackRef = useRef(null);
  // Реф для зберігання ID кадру анімації
  const animationFrameId = useRef(null);
  // Реф для зберігання ширини одного повного набору зображень
  const singleSetWidth = useRef(0);

  // --- Додамо useEffect для JS-анімації ---

  // ... (хуки useState, useRef) ...

  useEffect(() => {
    const trackElement = trackRef.current;
    if (!trackElement) return;

    const measureWidth = () => {
      const items = trackElement.querySelectorAll(".carousel-item");
      let totalWidth = 0;
      // Вимірюємо ширину *одного* набору.
      // Оскільки в JSX рендериться 2 набори, беремо першу половину елементів.
      const numItemsInSet = images.length; // Кількість елементів в оригінальному масиві
      for (let i = 0; i < numItemsInSet && i < items.length; i++) {
        const item = items[i];
        const style = getComputedStyle(item);
        const marginRight = parseFloat(style.marginRight);
        totalWidth += item.offsetWidth + marginRight;
      }
      singleSetWidth.current = totalWidth;
      console.log("Measured single set width:", singleSetWidth.current); // Для налагодження

      // Якщо ширина виміряна, можна запустити анімацію, якщо вона ще не запущена
      if (singleSetWidth.current > 0 && !animationFrameId.current) {
        animate(); // Запускаємо анімацію
      }
    };

    // Функція для перевірки завантаження зображень та вимірювання
    const imagesLoadedAndMeasure = () => {
      const imgs = trackElement.querySelectorAll(".carousel-item img");
      const totalImgs = images.length; // Кількість у *одному* наборі

      if (totalImgs === 0) {
        // Якщо немає зображень, просто вимірюємо контейнери
        measureWidth();
        return;
      }

      let loadedCount = 0;
      imgs.forEach((img) => {
        const handleLoadOrError = () => {
          loadedCount++;
          if (loadedCount === totalImgs) {
            measureWidth(); // Вимірюємо тільки після завантаження всіх зображень одного набору
          }
        };
        if (img.complete) {
          handleLoadOrError();
        } else {
          img.addEventListener("load", handleLoadOrError);
          img.addEventListener("error", handleLoadOrError);
        }
      });
      // Якщо всі зображення вже в кеші і завантажені (наприклад, при швидкому оновленні)
      if (loadedCount === totalImgs) {
        measureWidth();
      }
    };

    // Запускаємо перевірку завантаження зображень та вимірювання
    imagesLoadedAndMeasure();

    // Функція для анімації
    const animate = () => {
      // Швидкість руху (можна налаштувати)
      const speed = 0.5; // Рухаємося на 0.5px за кадр

      setTranslateX((prevX) => {
        let newX = prevX - speed; // Рухаємося вліво

        // Перевіряємо, чи ми змістилися на відстань, рівну ширині одного набору зображень.
        // Використовуємо singleSetWidth.current, яке виміряно після рендерингу та завантаження.
        if (singleSetWidth.current > 0 && newX <= -singleSetWidth.current) {
          // Миттєво "переставляємо" позицію, додаючи ширину одного набору.
          // Це повертає нас на початок візуально першого набору, який тепер знаходиться там, де був другий.
          newX = newX + singleSetWidth.current;
          console.log("Resetting position. NewX:", newX); // Для налагодження
        }

        return newX;
      });

      // Запитуємо наступний кадр анімації
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Важливо: анімацію запускаємо або після вимірювання ширини, або вона сама
    // має враховувати випадок singleSetWidth.current === 0
    // Запустимо анімацію одразу, але логіка скидання врахує singleSetWidth > 0
    animationFrameId.current = requestAnimationFrame(animate);

    // Функція очищення: зупиняємо анімацію при демонтажі компонента
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Очищення слухачів подій, якщо ви їх додавали до зображень вручну
      const trackEl = trackRef.current;
      if (trackEl) {
        const imgs = trackEl.querySelectorAll(".carousel-item img");
        imgs.forEach((img) => {
          // Видаліть слухачів, якщо ви їх додавали
        });
      }
    };
  }, [images.length]); // Залежності ефекту. images.length, якщо масив може змінюватися.

  // ... (JSX render залишається як вище, з [...images, ...images].map) ...

  // --- Кінець useEffect для JS-анімації ---

  return (
    <div className="carousel-wrapper carousel-piercing">
      <FadeInBlurForCarousel>
        <h2>Роботи з пірсингом</h2>
        {/* Елемент доріжки. Призначаємо реф та застосовуємо JS-керований transform */}
        <div
          className="track-piercing"
          ref={trackRef}
          style={{
            transform: `translateX(${translateX}px)`,
            // ВИДАЛІТЬ CSS-властивість animation з вашого CSS для .track-piercing
            // Або додайте animation: 'none'; сюди, щоб перевизначити її з CSS
            animation: "none", // Перевизначаємо CSS-анімацію
          }}
        >
          {/* Рендеримо лише один набір зображень */}
          {images.map((img, index) => (
            <div className="carousel-item" key={index}>
              <img src={img} alt={`Зображення ${index}`} />
            </div>
          ))}
          {/*
             Якщо потрібно, щоб доріжка візуально заповнювала екран з самого початку,
             можливо, доведеться відрендерити більше елементів тут спочатку,
             наприклад, [...images, ...images].map(...), але тоді логіка вимірювання
             та скидання позиції має враховувати це і бути складнішою.
             Простий варіант: рендеримо тільки images.map(...), а анімація почнеться з пустого місця,
             поки перший набір не з'явиться зліва.
             Щоб уникнути цього, можна рендерити images.map(...) і додати
             початковий transform, який ставить останній елемент зліва.
             Або ж, як у вашому початковому коді, рендерити 2 комплекти, але JS-анімація має бути
             налаштована на циклічний рух 0 -> -ШиринаНабору -> скидання -> -ШиринаНабору+Speed -> і т.д.
             Описаний вище JS-код реалізує анімацію 0 -> -ШиринаНабору та скидання.
             Для безшовного вигляду з самого початку, можливо, доведеться спочатку відрендерити 2 комплекти в JSX,
             але JS-логіка скидання має працювати коректно, коли trackRef зміститься на ширину ОДНОГО комплекту.
             Давайте спробуємо рендерити 2 комплекти поки що, і адаптуємо логіку скидання.
           */}
          {[...images, ...images].map(
            (
              img,
              index // Повертаємо подвоєння для початкового вигляду
            ) => (
              <div className="carousel-item" key={index}>
                <img src={img} alt={`Зображення ${index}`} />
              </div>
            )
          )}
        </div>
      </FadeInBlurForCarousel>
    </div>
  );
};

export default CarouselPiercing;
