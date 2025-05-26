import React, { useRef } from "react";

import Hero from "../components/features/hero/Hero";
import AboutMe from "../components/features/aboutMe/AboutMe";
import CarouselPiercing from "../components/features/gallery/CarouselPiercing";
import CarouselTattoo from "../components/features/gallery/CarouselTattoo";
import Booking from "../components/features/booking/Booking";
import FadeInBlurPrimary from "../components/common/FadeInBlurPrimary";

const Home = () => {
  const aboutMeRef = useRef(null);
  const gallery_piercingRef = useRef(null);
  const gallery_tattooRef = useRef(null);
  const bookingRef = useRef(null);

  const scrollToBooking = () => {
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    </>
  );
};

export default Home;
