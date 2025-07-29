import React, { useState, useEffect, useCallback, useRef } from "react";
import TimeSlotSelector from "./TimeSlotSelector";
import { supabase } from "../../../supabaseClient";

const DatePicker = ({
  onDateSelect,
  selectedDate,
  isAdminMode = false,
  month: controlledMonth,
  year: controlledYear,
  onMonthChange,
  memoizedAllTimeSlots,
  setBookedTimeSlots,
  onTimeSelect,
  selectedTime,
  onTimeSlotBlockChange,
}) => {
  const timeSlotSelectorRef = useRef(null);

  useEffect(() => {
    if (!isAdminMode && selectedDate && timeSlotSelectorRef.current) {
      timeSlotSelectorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDate, isAdminMode]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [blockedDates, setBlockedDates] = useState([]);
  const [bookedDaysInfo, setBookedDaysInfo] = useState({});
  const [userBookedSlotsOnly, setUserBookedSlotsOnly] = useState({});
  const [individualAdminBlockedSlots, setIndividualAdminBlockedSlots] =
    useState({});

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
  }, [controlledMonth, controlledYear, currentMonth, currentYear]);

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchBookingsAndBlockedDates = useCallback(async () => {
    setIsLoading(true);

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const { data: sessionsData, error: sessionsError } = await supabase
      .from("sessions")
      .select("selected_date, selected_time")
      .gte("selected_date", formattedStartDate)
      .lte("selected_date", formattedEndDate);

    if (sessionsError) {
      console.error(
        "DatePicker: Помилка при завантаженні заброньованих часів:",
        sessionsError,
      );
      setIsLoading(false);
      return;
    }

    const tempUserBookingsByDate = {};
    sessionsData.forEach((item) => {
      if (!tempUserBookingsByDate[item.selected_date]) {
        tempUserBookingsByDate[item.selected_date] = [];
      }
      tempUserBookingsByDate[item.selected_date].push(item.selected_time);
    });
    setUserBookedSlotsOnly(tempUserBookingsByDate);

    if (setBookedTimeSlots) {
      setBookedTimeSlots(tempUserBookingsByDate);
    }

    let fetchedBlockedDates = [];
    const { data: blockedData, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("date");

    if (blockedError) {
      console.error(
        "DatePicker: Помилка завантаження заблокованих дат адміном (blocked_dates):",
        blockedError,
      );
      setBlockedDates([]);
    } else {
      fetchedBlockedDates = blockedData.map((item) => item.date);
      setBlockedDates(fetchedBlockedDates);
    }

    let fetchedIndividualAdminBlockedTimeSlots = {};
    const { data: blockedSlotsData, error: blockedSlotsError } = await supabase
      .from("blocked_time_slots")
      .select("date, time")
      .gte("date", formattedStartDate)
      .lte("date", formattedEndDate);

    if (blockedSlotsError) {
      console.error(
        "DatePicker: Помилка завантаження індивідуально заблокованих слотів адміном (blocked_time_slots):",
        blockedSlotsError,
      );
    } else {
      blockedSlotsData.forEach((slot) => {
        if (!fetchedIndividualAdminBlockedTimeSlots[slot.date]) {
          fetchedIndividualAdminBlockedTimeSlots[slot.date] = [];
        }
        fetchedIndividualAdminBlockedTimeSlots[slot.date].push(slot.time);
      });
      setIndividualAdminBlockedSlots(fetchedIndividualAdminBlockedTimeSlots);
    }

    const combinedUnavailableSlotsByDate = {};
    Object.keys(tempUserBookingsByDate).forEach((date) => {
      combinedUnavailableSlotsByDate[date] = [...tempUserBookingsByDate[date]];
    });

    Object.keys(fetchedIndividualAdminBlockedTimeSlots).forEach((date) => {
      if (!combinedUnavailableSlotsByDate[date]) {
        combinedUnavailableSlotsByDate[date] = [];
      }
      fetchedIndividualAdminBlockedTimeSlots[date].forEach((slot) => {
        if (!combinedUnavailableSlotsByDate[date].includes(slot)) {
          combinedUnavailableSlotsByDate[date].push(slot);
        }
      });
    });

    const newBookedDaysInfo = {};
    const allTimeSlots = memoizedAllTimeSlots;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      const formattedDate = formatDate(date);

      const combinedSlotsForDay =
        combinedUnavailableSlotsByDate[formattedDate] || [];
      const isBlockedByFullDate = fetchedBlockedDates.includes(formattedDate);

      newBookedDaysInfo[formattedDate] = {
        totalBooked: combinedSlotsForDay.length,
        isFull:
          isBlockedByFullDate ||
          (allTimeSlots && allTimeSlots.length
            ? combinedSlotsForDay.length >= allTimeSlots.length
            : false),
      };
    }
    setBookedDaysInfo(newBookedDaysInfo);

    setIsLoading(false);
  }, [currentYear, currentMonth, memoizedAllTimeSlots, setBookedTimeSlots]);

  useEffect(() => {
    fetchBookingsAndBlockedDates();
  }, [fetchBookingsAndBlockedDates]);

  const handleToggleBlockedTimeSlot = useCallback(
    async (date, time) => {
      if (onTimeSlotBlockChange) {
        await onTimeSlotBlockChange(date, time);
      }
      await fetchBookingsAndBlockedDates();
    },
    [onTimeSlotBlockChange, fetchBookingsAndBlockedDates],
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const toggleBlockedDate = useCallback(async () => {
    if (!selectedDate) {
      return;
    }

    setIsLoading(true);
    const isCurrentlyBlocked = blockedDates.includes(selectedDate);

    if (isCurrentlyBlocked) {
      const { error: deleteDateError } = await supabase
        .from("blocked_dates")
        .delete()
        .eq("date", selectedDate);

      if (deleteDateError) {
        console.error(
          "DatePicker: Помилка розблокування дати:",
          deleteDateError,
        );
      }

      const { error: deleteSlotsError } = await supabase
        .from("blocked_time_slots")
        .delete()
        .eq("date", selectedDate);

      if (deleteSlotsError) {
        console.error(
          "DatePicker: Помилка розблокування слотів часу:",
          deleteSlotsError,
        );
      }
    } else {
      const { error: insertDateError } = await supabase
        .from("blocked_dates")
        .insert([{ date: selectedDate }]);

      if (insertDateError) {
        console.error("DatePicker: Помилка блокування дати:", insertDateError);
      }

      const allSlotsForSelectedDate = memoizedAllTimeSlots.map((time) => ({
        date: selectedDate,
        time: time,
      }));

      const { error: insertSlotsError } = await supabase
        .from("blocked_time_slots")
        .upsert(allSlotsForSelectedDate, { onConflict: ["date", "time"] });

      if (insertSlotsError) {
        console.error(
          "DatePicker: Помилка блокування всіх слотів часу:",
          insertSlotsError,
        );
      }
    }

    await fetchBookingsAndBlockedDates();
    setIsLoading(false);
  }, [
    blockedDates,
    selectedDate,
    memoizedAllTimeSlots,
    fetchBookingsAndBlockedDates,
  ]);

  const handleDayClick = useCallback(
    (day) => {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      const formattedDate = formatDate(date);

      if (isAdminMode) {
        onDateSelect(formattedDate);
        return;
      }

      const isPast = date <= today;
      const isBlockedByAdmin = blockedDates.includes(formattedDate);
      const dayBookings = bookedDaysInfo[formattedDate];
      const isFullyBooked = dayBookings ? dayBookings.isFull : false;

      const isUserSelectable = !isPast && !isBlockedByAdmin && !isFullyBooked;

      if (isUserSelectable && onDateSelect) {
        onDateSelect(formattedDate);
      }
    },
    [
      isAdminMode,
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
          type="button"
          className="month-nav-button"
          onClick={goToPreviousMonth}
          disabled={
            !isAdminMode &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
          }
        >
          <span> &#8592; </span>
        </button>
        <h3>{getMonthName()}</h3>
        <button
          type="button"
          className="month-nav-button"
          onClick={goToNextMonth}
        >
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
          ))}{" "}
        {daysArray.map((day) => {
          const date = new Date(currentYear, currentMonth, day);
          date.setHours(0, 0, 0, 0);
          const formattedDate = formatDate(date);

          let dayClasses = ["calendar-day"];

          const isPastDay = date <= today;
          const isBlockedByAdmin = blockedDates.includes(formattedDate);
          const dayInfo = bookedDaysInfo[formattedDate];
          const isFullyBooked = dayInfo ? dayInfo.isFull : false;

          if (isAdminMode) {
            const isUnavailable =
              isPastDay || isBlockedByAdmin || isFullyBooked;

            if (isUnavailable) {
              dayClasses.push("unavailable");
              if (isPastDay) dayClasses.push("past-day");
              if (isBlockedByAdmin) dayClasses.push("admin-blocked");
              if (isFullyBooked) dayClasses.push("fully-booked");
            } else {
              dayClasses.push("available");
            }

            dayClasses.push("admin-mode-day");
            if (selectedDate === formattedDate) {
              dayClasses.push("selected-admin");
            }
          } else {
            if (isPastDay || isBlockedByAdmin || isFullyBooked) {
              dayClasses.push("unavailable");
              if (isPastDay) dayClasses.push("past-day");
              if (isBlockedByAdmin) dayClasses.push("admin-blocked");
              if (isFullyBooked) dayClasses.push("fully-booked");
            } else {
              dayClasses.push("available");
            }
            if (selectedDate === formattedDate) {
              dayClasses.push("selected");
            }
          }

          return (
            <div
              key={day}
              className={dayClasses.join(" ")}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <div ref={timeSlotSelectorRef}>
          <TimeSlotSelector
            selectedDate={selectedDate}
            bookedTimeSlots={userBookedSlotsOnly[selectedDate] || []}
            adminBlockedTimeSlots={
              individualAdminBlockedSlots[selectedDate] || []
            }
            memoizedAllTimeSlots={memoizedAllTimeSlots}
            isAdminMode={isAdminMode}
            toggleBlockedTimeSlot={handleToggleBlockedTimeSlot}
            onTimeSelect={isAdminMode ? () => {} : onTimeSelect}
            selectedTime={selectedTime}
          />
        </div>
      )}
      {isAdminMode && selectedDate && (
        <button
          type="button"
          className="activate-deactivate-day-button"
          onClick={toggleBlockedDate}
          disabled={isLoading}
        >
          {blockedDates.includes(selectedDate)
            ? "Активувати день повністю"
            : "Деактивувати день повністю"}
        </button>
      )}
    </div>
  );
};

export default DatePicker;
