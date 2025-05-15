import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FadeInBlurForCarousel = ({ children, delay = 0 }) => {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        filter: "blur(10px)",
        y: 50,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1.6,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, [delay]);

  return (
    <div ref={ref} className="fade-in-blur">
      {children}
    </div>
  );
};

export default FadeInBlurForCarousel;
