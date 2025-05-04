import React from "react";
import "../styles/styles.css";

function Care() {
  return (
    <div className="care-wrapper">
      <div className="care-container">
        <h2>Пам'ятки по догляду за проколами</h2>
        <div className="care-container">
          <div className="cards-container">
            <div className="care-card">
              <h3 className="card-title">
                Проколи шкіряного покриву (вушна раковина, брова, ніс)
              </h3>
              <div className="card-content">
                <p>
                  Протягом 25 днів 3 рази на день промиваємо розчином
                  Мірамістину або «Angel tears» (спрей, який можна придбати на
                  студії) кімнатної температури. Обережно вимиваємо виділення
                  ватним диском або ватною паличкою (НЕ використовувати вату).
                </p>

                <div className="care-note">
                  <div className="note-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="note-content">
                    Ввечері можливий біль і опухлість — це нормальна реакція.
                    Для полегшення можна прийняти знеболювальне.
                  </div>
                </div>

                <div className="recommendation-container">
                  <h4 className="recommendation-title">
                    Рекомендації протягом першого місяця:
                  </h4>
                  <ol className="recommendation-list">
                    <li>
                      Не травмувати прокол (не спати на пірсингу, не зачіплювати
                      одягом).
                    </li>
                    <li>Не рухати прикрасу під час промивань.</li>
                    <li>Не відвідувати лазні, сауни, гарячі душі.</li>
                    <li>Не купатись у басейнах, морях тощо.</li>
                    <li>Не використовувати спиртовмісні засоби.</li>
                    <li>Уникати фізичних навантажень.</li>
                    <li>
                      Обмежити алкоголь, каву, препарати, що розріджують кров.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="care-card">
              <h3 className="card-title">
                Проколи шкіряного покриву (соски, пупок)
              </h3>
              <div className="card-content">
                <p>
                  Протягом 25 днів 3 рази на день промиваємо пірсинг розчином
                  Мірамістину або спреєм кімнатної температури. Виділення
                  обережно вимиваємо ватним диском або паличкою (НЕ
                  використовувати вату).
                </p>
                <p>
                  Перші 7 днів при контакті з одягом формуємо бар'єр із ватних
                  дисків або бафів (НЕ пластир). Вдома краще носити відкритий
                  одяг.
                </p>

                <div className="care-note">
                  <div className="note-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="note-content">
                    Болі й опухлість у вечірній час — нормальна реакція. Можна
                    прийняти знеболювальне.
                  </div>
                </div>

                <div className="recommendation-container">
                  <h4 className="recommendation-title">Рекомендації:</h4>
                  <ol className="recommendation-list">
                    <li>Не травмувати прокол.</li>
                    <li>Не рухати прикрасу під час промивань.</li>
                    <li>Не відвідувати лазні, сауни.</li>
                    <li>Не купатись у басейнах, водоймах.</li>
                    <li>Не використовувати косметику в зоні проколу.</li>
                    <li>Уникати фізичних навантажень.</li>
                    <li>
                      Обмежити алкоголь, каву, препарати, що розріджують кров
                      (перший тиждень).
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="care-card">
              <h3 className="card-title">
                Проколи ротової порожнини (язик, смайл)
              </h3>
              <div className="card-content">
                <p>
                  Протягом 30 днів промивати розчином для ротової порожнини без
                  спирту і смаків. Не травмувати прикрасу, не їсти сильно
                  гарячі/холодні продукти, не вживати алкоголь і каву.
                </p>

                <div className="care-note">
                  <div className="note-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="note-content">
                    Опухлість і біль нормальні. Набряк може триматись 3–14 днів.
                  </div>
                </div>

                <div className="recommendation-container">
                  <h4 className="recommendation-title">Режим догляду:</h4>
                  <ol className="recommendation-list">
                    <li>Перші 3 години: тільки негазована вода.</li>
                    <li>
                      Перший тиждень: уникати гострої, солоної, гарячої їжі;
                      після кожного прийому їжі промивати.
                    </li>
                    <li>
                      7–30 день: повернення до звичайного харчування, промивати
                      3 рази на добу.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="care-card">
              <h3 className="card-title">
                Проколи губ (монро, мадонна, лабрет, медуза)
              </h3>
              <div className="card-content">
                <h4 className="section-subtitle">Зовнішня частина проколу:</h4>
                <p>
                  Промивати 25 днів 3 рази на день розчином Мірамістину або
                  «Angel tears». Виділення очищати ватним диском або паличкою
                  (НЕ вата).
                </p>

                <div className="recommendation-container">
                  <h4 className="recommendation-title">Рекомендації:</h4>
                  <ol className="recommendation-list">
                    <li>Не травмувати прокол.</li>
                    <li>Не рухати прикрасу.</li>
                    <li>Не відвідувати лазні, сауни.</li>
                    <li>Не купатись у басейнах, водоймах.</li>
                    <li>Не використовувати косметику в зоні пірсингу.</li>
                    <li>Уникати фізичних навантажень.</li>
                    <li>
                      Обмежити алкоголь, каву, препарати, що розріджують кров.
                    </li>
                  </ol>
                </div>

                <h4 className="section-subtitle">Внутрішня частина проколу:</h4>
                <p>
                  Промивати 30 днів розчином для ротової порожнини без спирту і
                  смаків. Перших 3 години — тільки негазована вода.
                </p>
                <p>
                  Перший тиждень: уникати гострої, солоної, гарячої їжі; після
                  кожного прийому їжі промивати.
                </p>
                <p>
                  7–30 день: повернення до звичайного харчування, промивати 3
                  рази на добу.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Care;
