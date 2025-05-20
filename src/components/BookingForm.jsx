import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Modal from "./Modal";
import TimeSlotSelector from "./TimeSlotSelector";
import "../styles/components/BookingForm.css";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";
import ReactDOM from "react-dom";
import { generateTimeSlots } from "../utils/timeSlots";

// ========================================
// ============SUPABASE CONFIG=============
// ========================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
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
// ===========BookingForm COMPONENT===========
// ========================================
const BookingForm = ({ isModalOpened, onClose, onBookingComplete }) => {
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

  const memoizedAllTimeSlots = useMemo(() => {
    return generateTimeSlots();
  }, []);

  // ========================================
  // ======BookingForm LIFECYCLE EFFECTS======
  // ========================================

  useEffect(() => {
    if (selectedDate && timeSlotSelectorRef.current) {
      timeSlotSelectorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDate, timeSlotSelectorRef.current]);

  // ========================================
  // =========BookingForm EVENT HANDLERS========
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
        openThankYouModal();
        setName("");
        setLastName("");
        setPhoneNumber("");
        setInstagram("");
        setComment("");
      } else {
        alert("Виникла помилка при бронюванні. Спробуйте ще раз.");
      }
    } else {
      alert("Будь ласка, виберіть дату та час.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    handleConfirmBooking();
  };

  // ========================================
  // ===========BookingForm JSX RENDER==========
  // ========================================
  return ReactDOM.createPortal(
    <div className="booking-form-container">
      <Modal
        isThankYouOpened={isThankYouOpened}
        isModalOpened={isModalOpened}
        onClose={onClose}
        title="Запис на сеанс"
      >
        {isThankYouOpened && (
          <div className="thank-you-overlay">
            <div className="thank-you-container">
              <div className="thank-you-content">
                <h2>Дякую за запис!</h2>
                <p>
                  &nbsp;&nbsp;&nbsp;Чекаю на Вас{" "}
                  {selectedDate.split("-").reverse().join(".")} о {selectedTime}{" "}
                  за адресою м. Вінниця, вул. Театральна, 4 ✨ +380974511990
                  (Ліза) телефонуйте, якщо потрібна буде допомога.
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;З собою необхідно мати документи (фізичний
                  паспорт або додаток «Дія»). Перед сеансом потрібно обов'язково
                  поїсти (бажано солодкого), виспатись і бути в гарному настрої
                  ✨
                </p>
                <p className="video-link-text">
                  Відео як дістатись до нас&nbsp;
                  <a
                    href="https://www.instagram.com/stories/highlights/18113082277287997/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    тут💜
                  </a>
                </p>

                <button className="thank-you-close" onClick={onClose}>
                  <X size={20} />
                </button>
                <img
                  className="thank-you-sticker"
                  height="300px"
                  src="/assets/images/sticker-thank-you.webp"
                ></img>
              </div>
            </div>
          </div>
        )}

        <form className="booking-form" onSubmit={handleSubmit} noValidate>
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
              minLength={2}
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
              minLength={2}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone-number"></label>
            <input
              type="tel"
              id="phone-number"
              name="phone-number"
              value={phoneNumber}
              placeholder="Номер телефону"
              onChange={(e) => setPhoneNumber(e.target.value)}
              pattern="^(\+?38)?(0\d{9})$"
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

          <div className="booking-form-modal-content">
            <DatePicker
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              setBookedTimeSlots={setBookedTimeSlots}
              memoizedAllTimeSlots={memoizedAllTimeSlots}
            />

            {selectedDate && (
              <div ref={timeSlotSelectorRef}>
                <TimeSlotSelector
                  onTimeSelect={handleTimeSelect}
                  selectedTime={selectedTime}
                  selectedDate={selectedDate}
                  bookedTimeSlots={bookedTimeSlots[selectedDate] || []}
                  memoizedAllTimeSlots={memoizedAllTimeSlots}
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
                disabled={
                  !selectedDate ||
                  !selectedTime ||
                  !name ||
                  !lastName ||
                  !phoneNumber
                }
              >
                Підтвердити
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>,
    document.body
  );
};

// ========================================
// ==========DATEPICKER COMPONENT==========
// ========================================
const DatePicker = ({
  onDateSelect,
  selectedDate,
  setBookedTimeSlots,
  memoizedAllTimeSlots,
}) => {
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

  // ========================================
  // ======DATEPICKER DATA FETCHING========
  // ========================================
  const fetchBookedTimeSlots = useCallback(
    async (year, month) => {
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

      const timeSlotsByDate = {};
      const availableDaysMap = {};

      const allTimeSlots = memoizedAllTimeSlots;

      data.forEach((item) => {
        if (!timeSlotsByDate[item.selected_date]) {
          timeSlotsByDate[item.selected_date] = [];
        }
        timeSlotsByDate[item.selected_date].push(item.selected_time);
      });

      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const formattedDate = formatDate(date);

        const bookedSlots = timeSlotsByDate[formattedDate] || [];

        availableDaysMap[formattedDate] =
          bookedSlots.length < allTimeSlots.length;
      }

      setBookedTimeSlots(timeSlotsByDate);
      setAvailableDays(availableDaysMap);
      setIsLoading(false);
    },
    [
      memoizedAllTimeSlots,
      setBookedTimeSlots,
      setAvailableDays,
      setIsLoading,
      formatDate,
    ]
  );

  useEffect(() => {
    fetchBookedTimeSlots(currentYear, currentMonth);
  }, [currentYear, currentMonth, fetchBookedTimeSlots]);
  // ========================================
  // =========DATEPICKER DATE LOGIC==========
  // ========================================
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

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
        "0"
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
          <span> &#8592; </span>
        </button>
        <h3>{getMonthName()}</h3>
        <button className="month-nav-button" onClick={goToNextMonth}>
          <span> &#8594; </span>
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
            currentMonth + 1
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

      {/* {isLoading && <div className="loading-indicator">Завантаження...</div>} */}
    </div>
  );
};

export default BookingForm;
