import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import TimeSlotSelector from "./TimeSlotSelector";
import "../styles/components/Calendar.css";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";

// ========================================
// ============SUPABASE CONFIG=============
// ========================================
const SUPABASE_URL = "https://xexpesevtjvmveqouekm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleHBlc2V2dGp2bXZlcW91ZWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjk3NzUsImV4cCI6MjA2MTk0NTc3NX0.J7Xl9eJYuO1OnCnj3sH7mDiGx7wOajPMC7oLgqXDoDA";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========================================
// =========SUPABASE INSERT FUNCTION=======
// ========================================
const insertBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .insert([{ ...bookingData }]);

    if (error) {
      console.error("Помилка при додаванні бронювання:", error);
      return false;
    }

    console.log("Бронювання успішно додано:", { ...bookingData });
    return true;
  } catch (error) {
    console.error("Неочікувана помилка при додаванні бронювання:", error);
    return false;
  }
};

// ========================================
// ===========CALENDAR COMPONENT===========
// ========================================
const Calendar = ({ isModalOpened, onClose, onBookingComplete }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedTimeSlots, setBookedTimeSlots] = useState({});

  const timeSlotSelectorRef = useRef(null);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instagram, setInstagram] = useState("");
  const [comment, setComment] = useState("");

  const [isThankYouOpened, setIsThankYouOpened] = useState(false);

  // ========================================
  // ======CALENDAR LIFECYCLE EFFECTS======
  // ========================================
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

  // ========================================
  // =========CALENDAR EVENT HANDLERS========
  // ========================================
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  function openThankYouModal() {
    setIsThankYouOpened(true);
  }

  const handleConfirmBooking = async () => {
    if (selectedDate && selectedTime) {
      const date = new Date();

      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const createAt = date.toLocaleString("uk-UA", options);

      const bookingDetails = {
        selected_date: selectedDate,
        selected_time: selectedTime,
        name: name,
        last_name: lastName,
        phone_number: phoneNumber,
        instagram: instagram,
        comment: comment,
        created_at: createAt,
      };

      const isSuccess = await insertBooking(bookingDetails);

      if (isSuccess) {
        // alert("Бронювання надіслано успішно!");
        openThankYouModal();
        // onClose();
        setName("");
        setLastName("");
        setPhoneNumber("");
        setInstagram("");
        setComment("");
        // setSelectedDate(null);
        // setSelectedTime(null);
      } else {
        alert("Виникла помилка при бронюванні. Спробуйте ще раз.");
      }
    } else {
      alert("Будь ласка, виберіть дату та час.");
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
  }

  // ========================================
  // ===========CALENDAR JSX RENDER==========
  // ========================================
  return (
    <div className="calendar-container">
      <Modal
        isThankYouOpened={isThankYouOpened}
        isModalOpened={isModalOpened}
        onClose={onClose}
        title="Запис на сеанс"
      >
        {isThankYouOpened && (
          <div className="thankYou-overlay">
            <div className="thankYou-container">
              <div className="thankYou-header">
                <h2>Дякую за запис!</h2>
                <p>
                  &nbsp;&nbsp;Чекаю на Вас{" "}
                  {selectedDate.split("-").reverse().join(".")} о {selectedTime}{" "}
                  за адресою Театральна, 4 ✨ +380974511990 (Ліза) теле-
                  фонуйте, якщо потрібна буде допомога.
                </p>
                <p>
                  &nbsp;&nbsp;З собою необхідно мати документи (фізичний паспорт
                  або додаток «Дія»). Перед сеансом пот- рібно обов'язково
                  поїсти (бажано солодкого), виспатись і бути в гарному настрої
                  ✨
                </p>
                <p>
                  &nbsp;&nbsp;Детальне відео як дістатись до нас закріплено в
                  актуальному «студія» 💜
                </p>

                <button className="thankYou-close" onClick={onClose}>
                  <X size={20} />
                </button>
                <img
                  height="300px"
                  src="/assets/images/sticker-thank-you.webp"
                ></img>
              </div>
            </div>
          </div>
        )}

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
              setBookedTimeSlots={setBookedTimeSlots}
            />

            {selectedDate && (
              <div ref={timeSlotSelectorRef}>
                <TimeSlotSelector
                  onTimeSelect={handleTimeSelect}
                  selectedTime={selectedTime}
                  selectedDate={selectedDate}
                  bookedTimeSlots={bookedTimeSlots[selectedDate] || []}
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
                type="button"
                className="booking-confirm-button"
                disabled={
                  !selectedDate ||
                  !selectedTime ||
                  !name ||
                  !lastName ||
                  !phoneNumber
                }
                onClick={handleConfirmBooking}
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

// ========================================
// ==========DATEPICKER COMPONENT==========
// ========================================
const DatePicker = ({ onDateSelect, selectedDate, setBookedTimeSlots }) => {
  // ========================================
  // ========DATEPICKER STATE VARIABLES======
  // ========================================
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [availableDays, setAvailableDays] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ========================================
  // ========DATEPICKER HELPER FUNCTIONS=====
  // ========================================
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ========================================
  // =====DATEPICKER LIFECYCLE EFFECTS=====
  // ========================================
  useEffect(() => {
    fetchBookedTimeSlots(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // ========================================
  // ======DATEPICKER DATA FETCHING========
  // ========================================
  const fetchBookedTimeSlots = async (year, month) => {
    setIsLoading(true);
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const { data, error } = await supabase
      .from("sessions")
      .select("selected_date, selected_time")
      .gte("selected_date", formatDate(startDate))
      .lte("selected_date", formatDate(endDate));

    if (error) {
      console.error("Помилка при завантаженні заброньованих часів:", error);
      setIsLoading(false);
      return;
    }

    // Group booked time slots by date
    const timeSlotsByDate = {};
    const availableDaysMap = {};

    // Get all possible time slots
    const allTimeSlots = generateAllTimeSlots();

    // Process data
    data.forEach((item) => {
      if (!timeSlotsByDate[item.selected_date]) {
        timeSlotsByDate[item.selected_date] = [];
      }
      timeSlotsByDate[item.selected_date].push(item.selected_time);
    });

    // Determine available days (days with at least one available time slot)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const formattedDate = formatDate(date);

      const bookedSlots = timeSlotsByDate[formattedDate] || [];

      // A day is available if not all time slots are booked
      availableDaysMap[formattedDate] =
        bookedSlots.length < allTimeSlots.length;
    }

    setBookedTimeSlots(timeSlotsByDate);
    setAvailableDays(availableDaysMap);
    setIsLoading(false);
  };

  // ========================================
  // ======DATEPICKER TIME SLOT GENERATION===
  // ========================================
  const generateAllTimeSlots = () => {
    const slots = [];
    let startHour = 8;
    let startMinute = 0;

    while (startHour < 18 || (startHour === 17 && startMinute === 0)) {
      const formatTime = (hour, minute) =>
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

      const start = formatTime(startHour, startMinute);
      slots.push(`${start}`);

      if (startMinute === 0) {
        startMinute = 30;
      } else {
        startMinute = 0;
        startHour++;
      }
    }
    return slots;
  };

  // ========================================
  // =========DATEPICKER DATE LOGIC==========
  // ========================================
  // Generate days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Determine day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust for Monday as first day of week
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Check if day is available (only future dates with at least one available time slot)
  const isDayAvailable = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const formattedDate = formatDate(date);
    return date >= today && availableDays[formattedDate];
  };

  // ========================================
  // ========DATEPICKER EVENT HANDLERS=======
  // ========================================
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
      return;
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

  // ========================================
  // =========DATEPICKER UI HELPERS==========
  // ========================================
  // Get month name in Ukrainian
  const getMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleDateString("uk-UA", {
      month: "long",
      year: "numeric",
    });
  };

  // ========================================
  // ==========DATEPICKER JSX RENDER=========
  // ========================================
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
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {Array(startOffset)
          .fill(null)
          .map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}

        {daysArray.map((day) => {
          const formattedDate = `${currentYear}-${String(
            currentMonth + 1,
          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isAvailable = isDayAvailable(day);
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

      {isLoading && <div className="loading-indicator">Завантаження...</div>}
    </div>
  );
};

export default Calendar;
