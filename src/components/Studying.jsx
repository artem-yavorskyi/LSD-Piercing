import React from "react";
import "../styles/styles.css";

export default function Studying() {
  return (
    <div className="studying-wrapper">
      <div className="studying-container">
        <h2>Навчальні курси</h2>
        <div className="courses-columns">
          <div className="course-card course-card-base">
            <div className="course-header">
              <h3>Базовий курс</h3>
              <p className="course-price">
                <strong>
                  Вартість: <span className="price-value">15 000 грн</span>
                </strong>
              </p>
            </div>

            <div className="course-sections">
              <div className="course-section">
                <h4 className="section-title">1. Теорія</h4>
                <ul className="section-list">
                  <li className="list-item">
                    Складові роботи (місце, матеріали)
                  </li>
                  <li className="list-item">Збір місця</li>
                  <li className="list-item">Інструменти (види)</li>
                  <li className="list-item">Прикраси (види)</li>
                  <li className="list-item">Робота з клієнтом</li>
                  <li className="list-item">Обробка інструментів та прикрас</li>
                  <li className="list-item">Догляд за свіжим пірсингом</li>
                </ul>
              </div>

              <div className="course-section">
                <h4 className="section-title">2. Практика</h4>
                <p className="section-description">
                  Перед кожним проколом, міні лекція по конкретному пірсингу
                  (правильна прикраса, розмітка, особливості)
                </p>
                <ul className="section-list">
                  <li className="list-item">Мочка</li>
                  <li className="list-item">Хрящ (хелікс)</li>
                  <li className="list-item">Хрящ (флет)</li>
                  <li className="list-item">Хрящ (конч)</li>
                  <li className="list-item">Крило носа</li>
                  <li className="list-item">Брова</li>
                  <li className="list-item">Смайл</li>
                  <li className="list-item">Пупок</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="course-card course-card-full">
            <div className="course-header">
              <h3>Повний курс</h3>
              <p className="course-price">
                <strong>
                  Вартість: <span className="price-value">25 000 грн</span>
                </strong>
              </p>
            </div>

            <div className="course-sections">
              <div className="course-section">
                <h4 className="section-title">1. Розширена теорія</h4>
                <ul className="section-list">
                  <li className="list-item">Глибоке вивчення анатомії</li>
                  <li className="list-item">Складні випадки та ускладнення</li>
                  <li className="list-item">Робота з проблемними клієнтами</li>
                  <li className="list-item">Санітарні норми та стандарти</li>
                  <li className="list-item">Юридичні аспекти роботи</li>
                </ul>
              </div>

              <div className="course-section">
                <h4 className="section-title">2. Поглиблена практика</h4>
                <p className="section-description">
                  Додаткові види пірсингу та складні техніки
                </p>
                <ul className="section-list">
                  <li className="list-item">Пірсинг язика</li>
                  <li className="list-item">Пірсинг сосків</li>
                  <li className="list-item">Генітальний пірсинг</li>
                  <li className="list-item">Мікродермали</li>
                  <li className="list-item">Складні модифікації</li>
                  <li className="list-item">Робота зі шрамовою тканиною</li>
                </ul>
              </div>

              <div className="course-section">
                <h4 className="section-title">3. Бізнес модуль</h4>
                <ul className="section-list">
                  <li className="list-item">Створення бренду</li>
                  <li className="list-item">Маркетинг для майстрів</li>
                  <li className="list-item">Управління студією</li>
                  <li className="list-item">Робота з соціальними мережами</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
