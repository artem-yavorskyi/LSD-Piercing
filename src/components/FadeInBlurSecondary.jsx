import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FadeInBlurSecondary = ({ children, delay = 0 }) => {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        filter: "blur(3px)",
        y: 0,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.2,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 100%",
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

export default FadeInBlurSecondary;
