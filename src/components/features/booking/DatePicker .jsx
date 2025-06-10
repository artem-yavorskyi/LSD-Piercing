import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DatePicker = ({
  onDateSelect,
  selectedDate,
  isAdminMode = false,
  month: controlledMonth,
  year: controlledYear,
  onMonthChange,
  memoizedAllTimeSlots,
  setBookedTimeSlots,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [blockedDates, setBlockedDates] = useState([]);
  const [bookedDaysInfo, setBookedDaysInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(
    controlledMonth !== undefined ? controlledMonth : today.getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(
    controlledYear !== undefined ? controlledYear : today.getFullYear(),
  );

  useEffect(() => {
    if (controlledMonth !== undefined && controlledMonth !== currentMonth) {
      setCurrentMonth(controlledMonth);
    }
    if (controlledYear !== undefined && controlledYear !== currentYear) {
      setCurrentYear(controlledYear);
    }
  }, [controlledMonth, controlledYear]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchBookingsAndBlockedDates = useCallback(async () => {
    setIsLoading(true);

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    // Fetch sessions
    const { data: sessionsData, error: sessionsError } = await supabase
      .from("sessions")
      .select("selected_date, selected_time")
      .gte("selected_date", formatDate(startDate))
      .lte("selected_date", formatDate(endDate));

    if (sessionsError) {
      console.error(
        "Помилка при завантаженні заброньованих часів:",
        sessionsError,
      );
      setIsLoading(false);
      return;
    }

    const timeSlotsByDate = {};
    const newBookedDaysInfo = {};
    const allTimeSlots = memoizedAllTimeSlots;

    sessionsData.forEach((item) => {
      if (!timeSlotsByDate[item.selected_date]) {
        timeSlotsByDate[item.selected_date] = [];
      }
      timeSlotsByDate[item.selected_date].push(item.selected_time);
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      const formattedDate = formatDate(date);

      const bookedSlots = timeSlotsByDate[formattedDate] || [];

      newBookedDaysInfo[formattedDate] = {
        totalBooked: bookedSlots.length,
        isFull:
          allTimeSlots && allTimeSlots.length
            ? bookedSlots.length >= allTimeSlots.length
            : false,
      };
    }
    setBookedDaysInfo(newBookedDaysInfo);

    if (!isAdminMode && setBookedTimeSlots) {
      setBookedTimeSlots(timeSlotsByDate);
    }

    // Fetch blocked dates
    const { data: blockedData, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("date");

    if (blockedError) {
      console.error(
        "Помилка завантаження заблокованих дат адміном:",
        blockedError,
      );
      setBlockedDates([]);
    } else {
      const fetchedBlockedDates = blockedData.map((item) => item.date);
      setBlockedDates(fetchedBlockedDates);
    }

    setIsLoading(false);
  }, [
    currentYear,
    currentMonth,
    isAdminMode,
    memoizedAllTimeSlots,
    setBookedTimeSlots,
  ]);

  useEffect(() => {
    fetchBookingsAndBlockedDates();
  }, [fetchBookingsAndBlockedDates]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const toggleBlockedDate = useCallback(
    async (dateToToggle) => {
      setIsLoading(true);
      const isCurrentlyBlocked = blockedDates.includes(dateToToggle);

      if (isCurrentlyBlocked) {
        const { error } = await supabase
          .from("blocked_dates")
          .delete()
          .eq("date", dateToToggle);
        if (error) {
          console.error("Помилка розблокування дати:", error);
        } else {
          setBlockedDates((prev) => prev.filter((d) => d !== dateToToggle));
        }
      } else {
        const { error } = await supabase
          .from("blocked_dates")
          .insert([{ date: dateToToggle }]);
        if (error) {
          console.error("Помилка блокування дати:", error);
        } else {
          setBlockedDates((prev) => [...prev, dateToToggle]);
        }
      }
      setIsLoading(false);
    },
    [blockedDates],
  );

  const handleDayClick = useCallback(
    (day) => {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      const formattedDate = formatDate(date);

      if (isAdminMode) {
        toggleBlockedDate(formattedDate);
      } else {
        const isPast = date < today;
        const isBlockedByAdmin = blockedDates.includes(formattedDate);
        const dayBookings = bookedDaysInfo[formattedDate];
        const isFullyBooked = dayBookings ? dayBookings.isFull : false;

        const isUserSelectable = !isPast && !isBlockedByAdmin && !isFullyBooked;

        if (isUserSelectable && onDateSelect) {
          onDateSelect(formattedDate);
        }
      }
    },
    [
      isAdminMode,
      toggleBlockedDate,
      onDateSelect,
      currentYear,
      currentMonth,
      today,
      blockedDates,
      bookedDaysInfo,
    ],
  );

  const goToPreviousMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    if (onMonthChange) {
      onMonthChange(newMonth, newYear);
    } else {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };

  const goToNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    if (onMonthChange) {
      onMonthChange(newMonth, newYear);
    } else {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };

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
            currentYear === today.getFullYear() &&
            !isAdminMode
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
          const date = new Date(currentYear, currentMonth, day);
          date.setHours(0, 0, 0, 0);
          const formattedDate = formatDate(date);

          const isPastDay = date < today;
          const isBlockedByAdmin = blockedDates.includes(formattedDate);
          const dayBookings = bookedDaysInfo[formattedDate];
          const isFullyBooked = dayBookings ? dayBookings.isFull : false;

          const isUnavailable = isPastDay || isBlockedByAdmin || isFullyBooked;

          let dayClasses = ["calendar-day"];

          if (isUnavailable) {
            dayClasses.push("unavailable");
            if (isPastDay) dayClasses.push("past-day");
            if (isBlockedByAdmin) dayClasses.push("admin-blocked");
            if (isFullyBooked) dayClasses.push("fully-booked");
          } else {
            dayClasses.push("available");
          }

          if (isAdminMode) {
            dayClasses.push("admin-mode-day");
          } else {
            if (selectedDate === formattedDate) {
              dayClasses.push("selected");
            }
          }

          return (
            <div
              key={day}
              className={dayClasses.join(" ")}
              onClick={() =>
                (isAdminMode || (!isUnavailable && date >= today)) &&
                handleDayClick(day)
              }
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
