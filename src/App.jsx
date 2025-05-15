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
import FadeInBlurPrimary from "./components/FadeInBlurPrimary";
import FadeInBlurSecondary from "./components/FadeInBlurSecondary";

const App = () => {
  const [activeTab, setActiveTab] = useState("home");

  const aboutMeRef = useRef(null);
  const gallery_piercingRef = useRef(null);
  const gallery_tattooRef = useRef(null);
  const bookingRef = useRef(null);

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
            <FadeInBlurPrimary>
              <Hero scrollToBooking={scrollToBooking} />
            </FadeInBlurPrimary>
            <section ref={aboutMeRef}>
              <FadeInBlurPrimary delay={0.2}>
                <AboutMe />
              </FadeInBlurPrimary>
            </section>

            <section ref={gallery_piercingRef}>
              <CarouselPiercing />
            </section>
            <section ref={gallery_tattooRef}>
              <CarouselTattoo />
            </section>

            <section className="booking-section" ref={bookingRef}>
              <FadeInBlurPrimary delay={0.1}>
                <Booking />
              </FadeInBlurPrimary>
            </section>
            <Footer />
          </>
        );
      case "studying":
        return (
          <>
            <FadeInBlurSecondary key={activeTab}>
              <Studying />
            </FadeInBlurSecondary>
          </>
        );
      case "pricelist":
        return (
          <>
            <FadeInBlurSecondary key={activeTab}>
              <PriceList />
            </FadeInBlurSecondary>
          </>
        );
      case "care":
        return (
          <>
            <FadeInBlurSecondary key={activeTab}>
              <Care />
            </FadeInBlurSecondary>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <FadeInBlurSecondary>
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
      </FadeInBlurSecondary>
    </>
  );
};

export default App;
