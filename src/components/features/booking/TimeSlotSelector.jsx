import { Clock } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";

const TimeSlotSelector = ({
  onTimeSelect,
  selectedTime,
  selectedDate,
  bookedTimeSlots = [],
  adminBlockedTimeSlots = [],
  memoizedAllTimeSlots,
  isAdminMode,
  toggleBlockedTimeSlot,
}) => {
  const timeSlots = memoizedAllTimeSlots;

  const [isSlotUpdating, setIsSlotUpdating] = useState({});

  const isTimeSlotBooked = useCallback(
    (time) => {
      return bookedTimeSlots.includes(time);
    },
    [bookedTimeSlots],
  );

  const isTimeSlotAdminBlocked = useCallback(
    (time) => {
      return adminBlockedTimeSlots.includes(time);
    },
    [adminBlockedTimeSlots],
  );

  const isTimeSlotAvailable = useCallback(
    (time) => {
      return !isTimeSlotBooked(time) && !isTimeSlotAdminBlocked(time);
    },
    [isTimeSlotBooked, isTimeSlotAdminBlocked],
  );

  const handleTimeSlotClick = useCallback(
    async (time) => {
      if (isSlotUpdating[time]) {
        return;
      }

      if (isAdminMode) {
        if (!isTimeSlotBooked(time)) {
          setIsSlotUpdating((prev) => ({ ...prev, [time]: true }));
          try {
            await toggleBlockedTimeSlot(selectedDate, time);
          } catch (error) {
            console.error("Помилка блокування/розблокування слоту:", error);
          } finally {
            setIsSlotUpdating((prev) => ({ ...prev, [time]: false }));
          }
        } else {
          console.warn(
            `Слот ${time} заброньовано користувачем і не може бути змінений адміном через цю кнопку.`,
          );
        }
      } else {
        if (isTimeSlotAvailable(time)) {
          onTimeSelect(time);
        }
      }
    },
    [
      isAdminMode,
      isSlotUpdating,
      toggleBlockedTimeSlot,
      selectedDate,
      isTimeSlotBooked,
      isTimeSlotAvailable,
      onTimeSelect,
    ],
  );

  const now = useMemo(() => new Date(), []);
  const isToday = useMemo(() => {
    if (!selectedDate) return false;
    const today = new Date();
    const selectedParts = selectedDate.split("-");
    const selected = new Date(
      selectedParts[0],
      selectedParts[1] - 1,
      selectedParts[2],
    );
    return (
      today.getFullYear() === selected.getFullYear() &&
      today.getMonth() === selected.getMonth() &&
      today.getDate() === selected.getDate()
    );
  }, [selectedDate]);

  return (
    <div className="time-slot-selector">
      <div className="time-slot-header">
        <Clock size={16} />
        <h3>Оберіть час</h3>
      </div>
      <div className="time-slots-grid">
        {timeSlots.map((time) => {
          const booked = isTimeSlotBooked(time);
          const adminBlocked = isTimeSlotAdminBlocked(time);
          const available = isTimeSlotAvailable(time);

          let className = "time-slot";

          const [hour, minute] = time.split(":").map(Number);
          const slotDateParts = selectedDate ? selectedDate.split("-") : [];
          const slotDateTime = selectedDate
            ? new Date(slotDateParts[0], slotDateParts[1] - 1, slotDateParts[2])
            : new Date();
          if (selectedDate) {
            slotDateTime.setHours(hour, minute, 0, 0);
          } else {
            slotDateTime.setHours(hour, minute, 0, 0);
          }
          const isPastSlot = isToday && slotDateTime <= now;

          if (isPastSlot && !isAdminMode) {
            className += " unavailable past-time";
          } else if (booked) {
            className += " unavailable booked";
          } else if (adminBlocked) {
            className += " unavailable admin-blocked";
          } else if (selectedTime === time && !isAdminMode) {
            className += " selected";
          } else if (isAdminMode && !isPastSlot) {
            className += " available-admin";
          } else if (isPastSlot && isAdminMode) {
            className += " unavailable past-time-admin";
          }

          if (isSlotUpdating[time]) {
            className += " updating-slot";
          }

          return (
            <button
              key={time}
              className={className}
              onClick={() => handleTimeSlotClick(time)}
              disabled={
                (booked && !isAdminMode) ||
                isSlotUpdating[time] ||
                (isPastSlot && !isAdminMode) ||
                (adminBlocked && !isAdminMode)
              }
              type="button"
            >
              {isSlotUpdating[time] ? (
                <div
                  className="spinner-thin"
                  role="status"
                  aria-label="Завантаження"
                >
                  <span className="sr-only">Завантаження...</span>
                </div>
              ) : (
                <>{time}</>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
