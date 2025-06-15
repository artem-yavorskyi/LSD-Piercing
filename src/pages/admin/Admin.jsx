// Admin.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import DatePicker from "../../components/features/booking/DatePicker";
import { generateTimeSlots } from "../../utils/timeSlots";
// import { createClient } from "@supabase/supabase-js"; // НЕ ПОТРІБНО для запитів до функцій

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL; // НЕ ПОТРІБНО
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; // НЕ ПОТРІБНО
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); // НЕ ПОТРІБНО

const GET_ALL_BOOKINGS_PROXY_PATH = "/supabase/functions/get-all-bookings"; // Змінено на правильний шлях

import "../../styles/admin/admin.css";

const Admin = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [allMonthBookings, setAllMonthBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [blockedTimeSlots, setBlockedTimeSlots] = useState({});

  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const memoizedAllTimeSlots = useMemo(() => {
    return generateTimeSlots();
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
        `${GET_ALL_BOOKINGS_PROXY_PATH}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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
      // Отримуємо заблоковані слоти часу з функції, а не напряму з Supabase
      setBlockedTimeSlots(data.blockedTimeSlots || {});
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
    setSelectedDate(null); // Скидаємо вибрану дату при зміні місяця
  }, []);

  const handleTimeSlotBlockChange = useCallback(
    async (date, time) => {
      console.log(
        `Admin: [handleTimeSlotBlockChange] Отримано запит на зміну статусу слоту: Дата: ${date}, Час: ${time}`,
      );
      const isCurrentlyBlocked = blockedTimeSlots[date]?.includes(time);

      let error = null;

      // Замість прямого запису в Supabase, ви маєте зробити окрему Serverless Function
      // для блокування/розблокування слотів.
      // ПРИКЛАД:
      // const BLOCK_TIME_SLOT_PROXY_PATH = "/supabase/functions/block-time-slot";
      // try {
      //   const response = await fetch(BLOCK_TIME_SLOT_PROXY_PATH, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ date, time, action: isCurrentlyBlocked ? 'unblock' : 'block' })
      //   });
      //   if (!response.ok) {
      //     const errorText = await response.text();
      //     throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      //   }
      //   const data = await response.json();
      //   if (data.error) throw new Error(data.error);
      // } catch (e) {
      //   error = e;
      // }

      // Якщо ви поки не хочете робити окрему функцію,
      // тоді цей код буде працювати, але з потенційними проблемами RLS,
      // якщо Supabase_Anon_Key не має дозволів на запис.
      // ЦЕЙ КОД ВИКОНУЄТЬСЯ В БРАУЗЕРІ З SUPABASE_ANON_KEY
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
        console.log(
          "Admin: Успішно оновлено Supabase, викликаємо fetchAllBookingsForCurrentMonth...",
        );
        // Оновлюємо дані після зміни
        await fetchAllBookingsForCurrentMonth(currentYear, currentMonth);
      }
    },
    [
      blockedTimeSlots,
      fetchAllBookingsForCurrentMonth,
      currentYear,
      currentMonth,
      // supabase, // Додайте supabase до залежностей, якщо ви його використовуєте тут
    ],
  );

  return (
    <div className="admin-panel">
      <h2>Адмін-панель</h2>

      <DatePicker
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        setBookedTimeSlots={setBookedTimeSlots} // Це пропс, який DatePicker використовує для internal state
        memoizedAllTimeSlots={memoizedAllTimeSlots}
        isAdminMode={true}
        month={currentMonth}
        year={currentYear}
        onMonthChange={handleMonthChange}
        // Передаємо функцію з Admin, яка буде оновлювати стан і запускати перезавантаження даних в Admin
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
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Час</th>
                <th>Ім'я</th>
                <th>Прізвище</th>
                <th>Телефон</th>
                <th>Послуга</th>
                <th>Instagram</th>
                <th>Коментар</th>
              </tr>
            </thead>
            <tbody>
              {allMonthBookings.map((booking) => (
                <tr
                  key={
                    booking.id ||
                    `${booking.selected_date}-${booking.selected_time}-${booking.name}`
                  }
                >
                  <td>{booking.selected_date}</td>
                  <td>{booking.selected_time}</td>
                  <td>{booking.selected_time}</td> {/* Виправлено */}
                  <td>{booking.name}</td>
                  <td>{booking.last_name}</td>
                  <td>{booking.phone_number}</td>
                  <td>
                    {booking.service_type === "piercing" ? "Пірсинг" : "Тату"}
                  </td>
                  <td>{booking.instagram || "—"}</td>
                  <td>{booking.comment || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Немає бронювань за цей місяць.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
