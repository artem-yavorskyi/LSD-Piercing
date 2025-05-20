import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { generateTimeSlots } from "../utils/timeSlots";

const TimeSlotSelector = ({
  onTimeSelect,
  selectedTime,
  selectedDate,
  bookedTimeSlots = [],
  memoizedAllTimeSlots,
}) => {
  const timeSlots = memoizedAllTimeSlots;

  const isTimeSlotAvailable = (time) => {
    return !bookedTimeSlots.includes(time);
  };

  return (
    <div className="time-slot-selector">
      <div className="time-slot-header">
        <Clock size={16} />
        <h3>Оберіть час</h3>
      </div>
      <div className="time-slots-grid">
        {timeSlots.map((time) => {
          const isAvailable = isTimeSlotAvailable(time);
          return (
            <div
              key={time}
              className={`time-slot ${!isAvailable ? "unavailable" : ""} ${
                selectedTime === time ? "selected" : ""
              }`}
              onClick={() => isAvailable && onTimeSelect(time)}
            >
              {time}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
