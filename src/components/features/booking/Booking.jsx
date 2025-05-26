import { Calendar as CalendarIcon } from "lucide-react";
import React, { useState, useEffect, forwardRef } from "react";

import BookingForm from "./BookingForm";

const Booking = forwardRef((props, ref) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  function openBookingFormModal() {
    setIsModalOpened(true);
  }

  function closeBookingFormModal() {
    setIsModalOpened(false);
  }

  const handleBookingComplete = (date, time) => {
    console.log("Booking complete:", date, time);
    closeBookingFormModal();
  };

  /* ===============================
   handleOffset for Google Chrome 
   ===============================*/
  useEffect(() => {
    const handleOffset = () => {
      if (isModalOpened && window.innerWidth >= 576) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = "15px";
      } else {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    };

    handleOffset();

    window.addEventListener("resize", handleOffset);

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isModalOpened]);

  return (
    <div className="container booking" ref={ref}>
      <h2>Запис на сеанс</h2>
      <button onClick={openBookingFormModal} className="booking-button">
        Записатися <CalendarIcon />
      </button>

      {isModalOpened && (
        <BookingForm
          isModalOpened={isModalOpened}
          onClose={closeBookingFormModal}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
});

Booking.displayName = "Booking";

export default Booking;
