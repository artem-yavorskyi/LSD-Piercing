import React, { useState, forwardRef } from "react";
import Calendar from "./Calendar";
import { Calendar as CalendarIcon } from "lucide-react";

const Booking = forwardRef((props, ref) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  function openCalendarModal() {
    setIsModalOpened(true);
  }

  function closeCalendarModal() {
    setIsModalOpened(false);
  }

  const handleBookingComplete = (date, time) => {
    console.log("Booking complete:", date, time);
    closeCalendarModal();
  };

  return (
    <div className="container booking" ref={ref}>
      <h2>Запис на сеанс</h2>
      <button onClick={openCalendarModal} className="booking-button">
        Записатися <CalendarIcon />
      </button>

      {isModalOpened && (
        <Calendar
          isModalOpened={isModalOpened}
          onClose={closeCalendarModal}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
});

export default Booking;
