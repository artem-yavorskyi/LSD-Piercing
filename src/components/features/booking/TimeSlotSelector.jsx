import { Clock } from "lucide-react";
import React, { useMemo } from "react";

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

  console.log("TimeSlotSelector received selectedTime:", selectedTime); // Для дебагу

  const isTimeSlotBooked = (time) => {
    return bookedTimeSlots.includes(time);
  };

  const isTimeSlotAdminBlocked = (time) => {
    return adminBlockedTimeSlots.includes(time);
  };

  const handleTimeSlotClick = (time) => {
    if (isAdminMode) {
      if (!isTimeSlotBooked(time)) {
        toggleBlockedTimeSlot(selectedDate, time);
      } else {
        console.log(
          `TimeSlotSelector: Слот ${time} для ${selectedDate} заброньований користувачем, адмін не може його змінити.`,
        );
      }
    } else {
      if (isTimeSlotAvailable(time)) {
        onTimeSelect(time);
        console.log("TimeSlotSelector: calling onTimeSelect with", time); // Для дебагу
      } else {
        console.log(
          `TimeSlotSelector: Слот ${time} для ${selectedDate} недоступний.`,
        );
      }
    }
  };

  const isTimeSlotAvailable = (time) => {
    return !isTimeSlotBooked(time) && !isTimeSlotAdminBlocked(time);
  };

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
          if (booked) {
            className += " unavailable";
          } else if (adminBlocked) {
            className += " admin-blocked";
          } else if (selectedTime === time && !isAdminMode) {
            className += " selected"; // Клас для вибраного користувачем слоту
          } else if (isAdminMode && selectedDate && !booked && !adminBlocked) {
            className += " available-admin";
          }

          return (
            <button
              key={time}
              className={className}
              onClick={() => handleTimeSlotClick(time)}
              disabled={booked && !isAdminMode}
              type="button" // <-- ВИПРАВЛЕНО: Додано type="button"
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
