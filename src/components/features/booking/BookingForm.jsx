import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Modal from "../../common/Modal";
import DatePicker from "./DatePicker";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";
import ReactDOM from "react-dom";
import { generateTimeSlots } from "../../../utils/timeSlots";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TELEGRAM_FUNCTION_URL =
  "https://xexpesevtjvmveqouekm.supabase.co/functions/v1/send-telegram-message";

const insertBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .insert([{ ...bookingData }]);

    if (error) {
      console.error("Помилка при додаванні бронювання:", error);
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

const BookingForm = ({ isModalOpened, onClose, onBookingComplete }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedTimeSlots, setBookedTimeSlots] = useState({});
  const [adminBlockedTimeSlots, setAdminBlockedTimeSlots] = useState({});

  const timeSlotSelectorRef = useRef(null);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceType, setServiceType] = useState("piercing");
  const [instagram, setInstagram] = useState("");
  const [comment, setComment] = useState("");

  const [isThankYouOpened, setIsThankYouOpened] = useState(false);

  const memoizedAllTimeSlots = useMemo(() => {
    return generateTimeSlots();
  }, []);

  useEffect(() => {
    if (selectedDate && timeSlotSelectorRef.current) {
      timeSlotSelectorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDate]);

  const handleChooseServiceType = (type) => {
    setServiceType(type);
  };

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

  const formatDateForSupabase = useCallback((dateString) => {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  }, []);

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

      const formattedSelectedDateForSupabase =
        formatDateForSupabase(selectedDate);

      const bookingDetails = {
        selected_date: formattedSelectedDateForSupabase,
        selected_time: selectedTime,
        name: name,
        last_name: lastName,
        phone_number: phoneNumber,
        service_type: serviceType,
        instagram: instagram,
        comment: comment,
        created_at: createAt,
      };

      const isSuccess = await insertBooking(bookingDetails);

      const telegramPayload = {
        selected_date: selectedDate, // Для Telegram залишаємо у форматі DD.MM.YYYY для зручності читання
        selected_time: selectedTime,
        name: name,
        last_name: lastName,
        phone_number: phoneNumber,
        service_type: serviceType,
        instagram: instagram,
        comment: comment,
      };

      const telegramResponse = await fetch(TELEGRAM_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(telegramPayload),
      });

      if (isSuccess) {
        openThankYouModal();
        setName("");
        setLastName("");
        setPhoneNumber("");
        setServiceType("piercing");
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

                <button
                  type="button"
                  className="thank-you-close"
                  onClick={onClose}
                >
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
          <div className="service-type-form">
            <div
              className={`form-field service-type-field ${
                serviceType === "piercing" ? "active" : ""
              }`}
              value={serviceType}
              onClick={() => {
                handleChooseServiceType("piercing");
              }}
            >
              <span className="service-type-btn">Пірсинг</span>
            </div>
            <div
              className={`form-field service-type-field ${
                serviceType === "tattoo" ? "active" : ""
              }`}
              value={serviceType}
              onClick={() => {
                handleChooseServiceType("tattoo");
              }}
            >
              <span className="service-type-btn">Тату</span>
            </div>
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
              onTimeSelect={handleTimeSelect}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              setBookedTimeSlots={setBookedTimeSlots}
              memoizedAllTimeSlots={memoizedAllTimeSlots}
              isAdminMode={false}
              setAdminBlockedTimeSlots={setAdminBlockedTimeSlots}
              selectedTime={selectedTime}
            />
          </div>

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
        </form>
      </Modal>
    </div>,
    document.body
  );
};

export default BookingForm;
