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
  const [igTelegram, setIgTelegram] = useState("");
  const [comment, setComment] = useState("");

  const [isThankYouOpened, setIsThankYouOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Будь ласка, виберіть дату та час.");
      return;
    }

    setIsSubmitting(true);
    try {
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
        service_type: serviceType,
        ig_telegram: igTelegram,
        comment: comment,
        created_at: createAt,
      };

      const isSuccess = await insertBooking(bookingDetails);

      const telegramPayload = {
        selected_date: selectedDate,
        selected_time: selectedTime,
        name: name,
        last_name: lastName,
        phone_number: phoneNumber,
        service_type: serviceType,
        ig_telegram: igTelegram,
        comment: comment,
      };

      await fetch(TELEGRAM_FUNCTION_URL, {
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
        setIgTelegram("");
        setComment("");
        setSelectedDate(null);
        setSelectedTime(null);
      } else {
        alert("Виникла помилка при бронюванні. Спробуйте ще раз.");
      }
    } catch (error) {
      console.error("Помилка під час відправки бронювання:", error);
      alert("Виникла помилка при бронюванні. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (isSubmitting) {
      return;
    }

    handleConfirmBooking();
  };

  return ReactDOM.createPortal(
    <div className="booking-form-container">
      <Modal
        isThankYouOpened={isThankYouOpened}
        isModalOpened={isModalOpened}
        onClose={() => {
          setIsThankYouOpened(false);
          onClose();
        }}
        title="Запис на сеанс"
      >
        {isThankYouOpened && (
          <div className="thank-you-overlay">
            <div className="thank-you-container">
              <div className="thank-you-content">
                <h2>Дякуємо, за довіру🤍</h2>
                <p>
                  Очікуйте на зворотній зворотній звʼязок майстра, для
                  підтвердження запису ✨
                </p>

                <button
                  type="button"
                  className="thank-you-close"
                  onClick={() => {
                    setIsThankYouOpened(false);
                    onClose();
                  }}
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
              onClick={() => {
                handleChooseServiceType("tattoo");
              }}
            >
              <span className="service-type-btn">Тату</span>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="ig_telegram"></label>
            <input
              type="text"
              id="ig-telegram"
              name="ig-telegram"
              value={igTelegram}
              placeholder="Instagram/Telegram (*Обов'язково)"
              onChange={(e) => setIgTelegram(e.target.value)}
              required
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
                !phoneNumber ||
                isSubmitting ||
                !igTelegram
              }
            >
              {isSubmitting ? <div className="spinner"></div> : "Підтвердити"}
            </button>
          </div>
        </form>
      </Modal>
    </div>,
    document.body,
  );
};

export default BookingForm;
