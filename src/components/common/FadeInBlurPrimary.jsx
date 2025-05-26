import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const FadeInBlurPrimary = ({ children, delay = 0 }) => {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        filter: "blur(12px)",
        y: 20,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [delay]);

  return (
    <div ref={ref} className="fade-in-blur">
      {children}
    </div>
  );
};

export default FadeInBlurPrimary;
