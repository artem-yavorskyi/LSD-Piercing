import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import TimeSlotSelector from "./TimeSlotSelector";
import "../styles/components/Calendar.css";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xexpesevtjvmveqouekm.supabase.co"; // Встав свій URL з дашборду Supabase
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleHBlc2V2dGp2bXZlcW91ZWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjk3NzUsImV4cCI6MjA2MTk0NTc3NX0.J7Xl9eJYuO1OnCnj3sH7mDiGx7wOajPMC7oLgqXDoDA"; // Встав свій анонімний ключ з дашборду Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

const Calendar = ({ isModalOpened, onClose, onBookingComplete }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlotSelectorRef = useRef(null);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instagram, setInstagram] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (isModalOpened) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isModalOpened]);

  useEffect(() => {
    if (selectedDate && timeSlotSelectorRef.current) {
      timeSlotSelectorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDate, timeSlotSelectorRef.current]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime && onBookingComplete) {
      onBookingComplete(selectedDate, selectedTime);
    }
    onClose();
  };

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        alert("Бронювання надіслано успішно!");
      })
      .catch((error) => alert("Виникла помилка: " + error));
  }

  return (
    <div className="calendar-container">
      <Modal
        isModalOpened={isModalOpened}
        onClose={onClose}
        title="Запис на сеанс"
      >
        <form
          className="booking-form"
          onSubmit={handleSubmit}
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="contact" />
          <div className="form-field">
            <label htmlFor="name"></label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Ім'я"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="last-name"></label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              value={lastName}
              placeholder="Прізвище"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone-number"></label>
            <input
              type="text"
              id="phone-number"
              name="phone-number"
              value={phoneNumber}
              placeholder="Номер телефону"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="instagram"></label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={instagram}
              placeholder="Інстаграм (необов'язково)"
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="comment"></label>
            <input
              type="text"
              id="comment"
              name="comment"
              value={comment}
              placeholder="Коментар (по бажанню)"
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="calendar-modal-content">
            <DatePicker
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />

            {selectedDate && (
              <div ref={timeSlotSelectorRef}>
                <TimeSlotSelector
                  onTimeSelect={handleTimeSelect}
                  selectedTime={selectedTime}
                />
              </div>
            )}

            <div className="booking-actions">
              <input
                type="hidden"
                name="selectedDate"
                value={selectedDate || ""}
              />
              <input
                type="hidden"
                name="selectedTime"
                value={selectedTime || ""}
              />

              <button
                type="submit"
                className="booking-confirm-button"
                disabled={!selectedDate || !selectedTime}
                // onClick={handleBooking}
              >
                Підтвердити
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const DatePicker = ({ onDateSelect, selectedDate }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [bookedDates, setBookedDates] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchBookedDates(currentYear, currentMonth);
  }, [currentMonth, currentYear]);

  const fetchBookedDates = async (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const { data, error } = await supabase
      .from("piercings")
      .select("selected_date")
      .gte("selected_date", formatDate(startDate))
      .lte("selected_date", formatDate(endDate));

    if (error) {
      console.error("Помилка при завантаженні заброньованих дат");
      return;
    }

    setBookedDates(data.map((item) => item.selected_date));
  };

  // Generate days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Determine day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust for Monday as first day of week
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Check if day is available (only future dates)
  const isDayAvailable = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const formattedDate = formatDate(date);
    return date >= today && !bookedDates.includes(formattedDate);
  };

  const handleDateSelect = (day) => {
    if (isDayAvailable(day)) {
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0",
      )}-${String(day).padStart(2, "0")}`;
      onDateSelect(formattedDate);
    }
  };

  const goToPreviousMonth = () => {
    if (
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ) {
      return; // Cannot go before current month
    }

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get month name in Ukrainian
  const getMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleDateString("uk-UA", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="datepicker">
      <div className="datepicker-header">
        <button
          className="month-nav-button"
          onClick={goToPreviousMonth}
          disabled={
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
          }
        >
          &#8592;
        </button>
        <h3>{getMonthName()}</h3>
        <button className="month-nav-button" onClick={goToNextMonth}>
          &#8594;
        </button>
      </div>

      <div className="calendar-grid">
        {/* Weekday headers - Mon to Sun */}
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the start of month */}
        {Array(startOffset)
          .fill(null)
          .map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}

        {/* Actual days of the month */}
        {daysArray.map((day) => {
          const isAvailable = isDayAvailable(day);
          const formattedDate = `${currentYear}-${String(
            currentMonth + 1,
          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = selectedDate === formattedDate;

          return (
            <div
              key={day}
              className={`calendar-day ${
                isAvailable ? "available" : "unavailable"
              } ${isSelected ? "selected" : ""}`}
              onClick={() => isAvailable && handleDateSelect(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
