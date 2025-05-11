import React from "react";
import { Clock } from "lucide-react";

const TimeSlotSelector = ({
  onTimeSelect,
  selectedTime,
  selectedDate,
  bookedTimeSlots = [],
}) => {
  // Generate time slots from 8:00 to 18:00 with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    let startHour = 8;
    let startMinute = 0;

    while (startHour < 18 || (startHour === 17 && startMinute === 0)) {
      const endHour = startMinute === 0 ? startHour : startHour + 1;

      const formatTime = (h, m) =>
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      const start = formatTime(startHour, startMinute);
      slots.push(`${start}`);

      if (startMinute === 0) {
        startMinute = 30;
      } else {
        startMinute = 0;
        startHour++;
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check if a time slot is available (not booked)
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
