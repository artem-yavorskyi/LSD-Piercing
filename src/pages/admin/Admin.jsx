import React, { useState, useEffect, useMemo, useCallback } from "react";
import DatePicker from "../../components/features/booking/DatePicker";
import { generateTimeSlots } from "../../utils/timeSlots";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GET_ALL_BOOKINGS_URL =
  "https://xexpesevtjvmveqouekm.supabase.co/functions/v1/get-all-bookings";

import "../../styles/pages/Admin.css";

const Admin = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedTimeSlots, setBookedTimeSlots] = useState({});
  const [allMonthBookings, setAllMonthBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [blockedTimeSlots, setBlockedTimeSlots] = useState({});

  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 920);

  const memoizedAllTimeSlots = useMemo(() => {
    return generateTimeSlots();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 920);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchAllBookingsForCurrentMonth = useCallback(async (year, month) => {
    setIsLoadingBookings(true);
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const formattedStartDate = `${startDate.getFullYear()}-${String(
      startDate.getMonth() + 1,
    ).padStart(2, "0")}-01`;
    const formattedEndDate = `${endDate.getFullYear()}-${String(
      endDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

    try {
      const response = await fetch(
        `${GET_ALL_BOOKINGS_URL}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`,
        );
      }
      const data = await response.json();
      setAllMonthBookings(data.sessions || []);
      setBlockedDates(data.blockedDates || []);

      const { data: blockedSlotsData, error: blockedSlotsError } =
        await supabase
          .from("blocked_time_slots")
          .select("date, time")
          .gte("date", formattedStartDate)
          .lte("date", formattedEndDate);

      if (blockedSlotsError) {
        console.error(
          "Admin: Помилка при завантаженні заблокованих слотів часу з Supabase:",
          blockedSlotsError,
        );
      } else {
        const blockedSlotsByDate = {};
        blockedSlotsData.forEach((slot) => {
          if (!blockedSlotsByDate[slot.date]) {
            blockedSlotsByDate[slot.date] = [];
          }
          blockedSlotsByDate[slot.date].push(slot.time);
        });
        setBlockedTimeSlots(blockedSlotsByDate);
      }
    } catch (error) {
      console.error(
        "Admin: Помилка при завантаженні бронювань для адмін-панелі:",
        error,
      );
      setAllMonthBookings([]);
      setBlockedDates([]);
      setBlockedTimeSlots({});
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBookingsForCurrentMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth, fetchAllBookingsForCurrentMonth]);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleMonthChange = useCallback((newMonth, newYear) => {
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);
  }, []);

  const handleTimeSlotBlockChange = useCallback(
    async (date, time) => {
      const isCurrentlyBlocked = blockedTimeSlots[date]?.includes(time);

      let error = null;

      if (isCurrentlyBlocked) {
        const { error: deleteError } = await supabase
          .from("blocked_time_slots")
          .delete()
          .match({ date: date, time: time });
        error = deleteError;
      } else {
        const { error: insertError } = await supabase
          .from("blocked_time_slots")
          .insert([{ date, time }]);
        error = insertError;
      }

      if (error) {
        console.error("Admin: Помилка блокування/розблокування часу:", error);
      } else {
        await fetchAllBookingsForCurrentMonth(currentYear, currentMonth);
      }
    },
    [
      blockedTimeSlots,
      fetchAllBookingsForCurrentMonth,
      currentYear,
      currentMonth,
    ],
  );

  const handleDeleteSession = useCallback(
    async (sessionId) => {
      if (window.confirm("Ви впевнені, що хочете видалити це бронювання?")) {
        try {
          const { error } = await supabase
            .from("sessions")
            .delete()
            .eq("id", sessionId);

          if (error) {
            console.error("Помилка при видаленні сесії:", error);
            alert("Не вдалося видалити бронювання. Спробуйте ще раз.");
          } else {
            alert("Бронювання успішно видалено!");
            fetchAllBookingsForCurrentMonth(currentYear, currentMonth);
          }
        } catch (error) {
          console.error("Помилка мережі при видаленні сесії:", error);
          alert("Помилка мережі при видаленні бронювання.");
        }
      }
    },
    [fetchAllBookingsForCurrentMonth, currentYear, currentMonth],
  );

  return (
    <div className="admin-panel">
      <h2>Адмін-панель</h2>

      <DatePicker
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        setBookedTimeSlots={setBookedTimeSlots}
        memoizedAllTimeSlots={memoizedAllTimeSlots}
        isAdminMode={true}
        month={currentMonth}
        year={currentYear}
        onMonthChange={handleMonthChange}
        onTimeSlotBlockChange={handleTimeSlotBlockChange}
      />

      <div className="admin-bookings-list">
        <h3>
          Бронювання за{" "}
          {new Date(currentYear, currentMonth).toLocaleDateString("uk-UA", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        {isLoadingBookings ? (
          <p>Завантаження бронювань...</p>
        ) : allMonthBookings.length > 0 ? (
          <div className="booking-cards-container">
            {allMonthBookings.map((booking) => (
              <div
                key={
                  booking.id ||
                  `${booking.selected_date}-${booking.selected_time}-${booking.name}`
                }
                className="booking-card"
              >
                <div className="booking-item date-item">
                  <span className="booking-label">Дата</span>
                  <span className="booking-value">
                    {new Date(booking.selected_date).toLocaleDateString(
                      "uk-UA",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className="booking-item time-item">
                  <span className="booking-label">Час</span>
                  <span className="booking-value">{booking.selected_time}</span>
                </div>
                <div className="booking-item name-item">
                  <span className="booking-label">Ім'я</span>
                  <span className="booking-value">{booking.name}</span>
                </div>
                <div className="booking-item last-name-item">
                  <span className="booking-label">Прізвище</span>
                  <span className="booking-value">{booking.last_name}</span>
                </div>
                <div className="booking-item phone-item">
                  <span className="booking-label">Телефон</span>
                  <span className="booking-value">{booking.phone_number}</span>
                </div>
                <div className="booking-item service-item">
                  <span className="booking-label">Послуга</span>
                  <span className="booking-value">
                    {booking.service_type === "piercing" ? "Пірсинг" : "Тату"}
                  </span>
                </div>
                <div className="booking-item ig-telegram-item">
                  <span className="booking-label">IG/Telegram</span>
                  <span className="booking-value">
                    {booking.instagram || "—"}
                  </span>
                </div>
                <div className="booking-item comment-item">
                  <span className="booking-label">Коментар</span>
                  <span className="booking-value booking-comment-value">
                    {booking.comment || "—"}
                  </span>
                </div>

                <div className="booking-item action-item">
                  <span className="booking-label"></span>
                  <span className="booking-value booking-button-value">
                    <button
                      className="delete-session-button"
                      onClick={() => handleDeleteSession(booking.id)}
                    >
                      {isMobileView ? "Видалити" : <X size={16} />}
                    </button>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Немає бронювань за цей місяць.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
