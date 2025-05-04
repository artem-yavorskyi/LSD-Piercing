import React from "react";

const priceItems = [
  { title: "Мочка (одна / пара)", price: "500 / 650 грн" },
  { title: "Хелікс", price: "550 грн" },
  { title: "Трагус / Конч / Роук / Дейс", price: "600 грн" },
  { title: "Індастріал", price: "750 грн" },
  { title: "Крило носа", price: "550 грн" },
  { title: "Септум", price: "650 грн" },
  { title: "Смайл", price: "550 грн" },
  { title: "Губа", price: "550 грн" },
  { title: "Язик", price: "700 грн" },
  { title: "Соски (один / пара)", price: "900 / 1500 грн" },
  { title: "Пупок", price: "650 грн" },
  { title: "Брова", price: "550 грн" },
  { title: "Брідж", price: "700 грн" },
  { title: "Мікродермал", price: "1500 грн" },
];

const PriceList = () => {
  return (
    <div className="price-wrapper">
      <div className="price-container">
        <h2>Пірсинг та сертифікати</h2>

        {/* Блок з прикрасою */}
        <div className="full-width-item">
          <span className="piercing-name">Титанова прикраса</span>
          <span className="piercing-price">| від 250 грн</span>
        </div>

        <div className="price-grid">
          {priceItems.map((item, index) => (
            <div key={index} className="price-item">
              <span className="piercing-name">{item.title}</span>
              <span className="piercing-price">{item.price}</span>
            </div>
          ))}
        </div>
        <div className="certificates-container">
          {/* <h2 className="section-title">Сертифікати</h2> */}

          <div className="certificates-grid">
            {/* Piercing Certificate */}
            <div className="certificate-card piercing-certificate">
              <div className="certificate-header">
                <h3>Сертифікат на сеанс</h3>
              </div>

              <div className="certificate-details">
                <div className="detail-item">
                  <span className="detail-label">Включено:</span>
                  <span className="detail-value">
                    вартість проколу + прикраса
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Термін дії:</span>
                  <span className="detail-value">3 місяці</span>
                </div>
              </div>
            </div>

            {/* Tattoo Certificate */}
            <div className="certificate-card tattoo-certificate">
              <div className="certificate-header">
                <h3>Сертифікат на тату</h3>
              </div>

              <div className="certificate-details">
                <div className="detail-item">
                  <span className="detail-label">Вартість:</span>
                  <span className="detail-value">
                    від 1 500 грн до 5 500 грн
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Термін дії:</span>
                  <span className="detail-value">3 місяці</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceList;
