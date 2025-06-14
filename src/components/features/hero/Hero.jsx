import React from "react";

import logo from "/assets/images/lsd-logo.png";

const Hero = ({ scrollToBooking }) => {
  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-logo">
          <img src={logo} loading="eager" alt="LSD logo" />
        </div>
        <h1>СТУДІЯ ПІРСИНГУ І ТАТУ</h1>
        <button className="hero-button" onClick={scrollToBooking}>
          Записатися на сеанс
        </button>
        <svg
          className="arrow-icon"
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          width="512.000000pt"
          height="512.000000pt"
          viewBox="0 0 512.000000 512.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="#ffffff"
            stroke="none"
          >
            <path d="M895 4146 c-67 -29 -105 -105 -90 -183 6 -34 100 -131 843 -875 744 -743 841 -837 875 -843 94 -18 39 -66 949 843 909 909 861 855 843 949 -9 49 -69 109 -118 118 -94 18 -46 59 -875 -768 l-762 -762 -758 757 c-424 424 -769 762 -785 768 -38 14 -85 12 -122 -4z" />
            <path d="M895 2866 c-67 -29 -105 -105 -90 -183 6 -34 100 -131 843 -875 744 -743 841 -837 875 -843 94 -18 39 -66 949 843 909 909 861 855 843 949 -9 49 -69 109 -118 118 -94 18 -46 59 -875 -768 l-762 -762 -758 757 c-424 424 -769 762 -785 768 -38 14 -85 12 -122 -4z" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
