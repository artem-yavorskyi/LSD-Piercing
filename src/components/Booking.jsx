import React, { useState, forwardRef } from "react";
import BookingForm from "./BookingForm";
import { Calendar as CalendarIcon } from "lucide-react";

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

export default Booking;
