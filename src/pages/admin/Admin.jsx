// src/components/admin/AdminPanel.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import DatePicker from "../../components/features/booking/DatePicker ";
import { generateTimeSlots } from "../../utils/timeSlots";

const GET_ALL_BOOKINGS_PROXY_PATH = "/api/get-all-bookings";

import "../../styles/admin/admin.css";

const Admin = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedTimeSlots, setBookedTimeSlots] = useState({});
  const [allMonthBookings, setAllMonthBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);

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
    } catch (error) {
      console.error(
        "Помилка при завантаженні бронювань для адмін-панелі:",
        error,
      );
      setAllMonthBookings([]);
      setBlockedDates([]);
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
        blockedDates={blockedDates}
      />

      <div className="admin-bookings-list">
        <h3>
          Бронювання за{" "}
          {new Date(currentYear, currentMonth).toLocaleDateString("uk-UA", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        {allMonthBookings.length > 0 ? (
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
