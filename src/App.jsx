import React, { useState, useRef } from "react";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import CarouselPiercing from "./components/CarouselPiercing";
import CarouselTattoo from "./components/CarouselTattoo";
import Booking from "./components/Booking";
import Footer from "./components/Footer";
import Studying from "./components/Studying";
import PriceList from "./components/PriceList";
import Care from "./components/Care";

const App = () => {
  const [activeTab, setActiveTab] = useState("home");

  const aboutMeRef = useRef(null);
  const gallery_piercingRef = useRef(null);
  const gallery_tattooRef = useRef(null);
  const bookingRef = useRef(null);
  const careRef = useRef(null);

  const scrollToBooking = () => {
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <>
            <Hero scrollToBooking={scrollToBooking} />
            <section ref={aboutMeRef}>
              <AboutMe />
            </section>
            <section ref={gallery_piercingRef}>
              <CarouselPiercing />
            </section>
            <section ref={gallery_tattooRef}>
              <CarouselTattoo />
            </section>

            <section className="booking-section" ref={bookingRef}>
              <Booking />
            </section>
            <Footer />
          </>
        );
      case "studying":
        return <Studying />;
      case "pricelist":
        return <PriceList />;
      case "care":
        return <Care />;
      default:
        return null;
    }
  };

  return (
    <div>
      <nav className="tabs">
        <button
          onClick={() => setActiveTab("home")}
          className={activeTab === "home" ? "active" : ""}
        >
          Головна
        </button>
        <button
          onClick={() => setActiveTab("studying")}
          className={activeTab === "studying" ? "active" : ""}
        >
          Навчання
        </button>
        <button
          onClick={() => setActiveTab("pricelist")}
          className={activeTab === "pricelist" ? "active" : ""}
        >
          Прайс-ліст
        </button>
        <button
          onClick={() => setActiveTab("care")}
          className={activeTab === "care" ? "active" : ""}
        >
          Догляд
        </button>
      </nav>
      {renderContent()}
    </div>
  );
};

export default App;
