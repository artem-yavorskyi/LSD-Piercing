// import { Clock } from "lucide-react";
// import React, { useMemo } from "react";

// const TimeSlotSelector = ({
//   onTimeSelect,
//   selectedTime,
//   selectedDate,
//   bookedTimeSlots = [],
//   adminBlockedTimeSlots = [],
//   memoizedAllTimeSlots,
//   isAdminMode,
//   toggleBlockedTimeSlot,
// }) => {
//   const timeSlots = memoizedAllTimeSlots;

//   const isTimeSlotBooked = (time) => {
//     return bookedTimeSlots.includes(time);
//   };

//   const isTimeSlotAdminBlocked = (time) => {
//     return adminBlockedTimeSlots.includes(time);
//   };

//   const handleTimeSlotClick = (time) => {
//     if (isAdminMode) {
//       if (!isTimeSlotBooked(time)) {
//         toggleBlockedTimeSlot(selectedDate, time);
//       }
//     } else {
//       if (isTimeSlotAvailable(time)) {
//         onTimeSelect(time);
//       }
//     }
//   };

//   const isTimeSlotAvailable = (time) => {
//     return !isTimeSlotBooked(time) && !isTimeSlotAdminBlocked(time);
//   };

//   return (
//     <div className="time-slot-selector">
//       <div className="time-slot-header">
//         <Clock size={16} />
//         <h3>Оберіть час</h3>
//       </div>
//       <div className="time-slots-grid">
//         {timeSlots.map((time) => {
//           const booked = isTimeSlotBooked(time);
//           const adminBlocked = isTimeSlotAdminBlocked(time);
//           const available = isTimeSlotAvailable(time);

//           let className = "time-slot";
//           if (booked) {
//             className += " unavailable";
//           } else if (adminBlocked) {
//             className += " admin-blocked";
//           } else if (selectedTime === time && !isAdminMode) {
//             className += " selected"; // Клас для вибраного користувачем слоту
//           } else if (isAdminMode && selectedDate && !booked && !adminBlocked) {
//             className += " available-admin";
//           }

//           return (
//             <button
//               key={time}
//               className={className}
//               onClick={() => handleTimeSlotClick(time)}
//               disabled={booked && !isAdminMode}
//               type="button" // <-- ВИПРАВЛЕНО: Додано type="button"
//             >
//               {time}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default TimeSlotSelector;

// TimeSlotSelector.jsx
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

  // Стан для відстеження завантаження окремих слотів
  const [isSlotUpdating, setIsSlotUpdating] = useState({});

  const isTimeSlotBooked = useCallback(
    (time) => {
      return bookedTimeSlots.includes(time);
    },
    [bookedTimeSlots]
  );

  const isTimeSlotAdminBlocked = useCallback(
    (time) => {
      return adminBlockedTimeSlots.includes(time);
    },
    [adminBlockedTimeSlots]
  );

  const isTimeSlotAvailable = useCallback(
    (time) => {
      return !isTimeSlotBooked(time) && !isTimeSlotAdminBlocked(time);
    },
    [isTimeSlotBooked, isTimeSlotAdminBlocked]
  );

  // Оновлена функція handleTimeSlotClick
  const handleTimeSlotClick = useCallback(
    async (time) => {
      // Якщо слот вже оновлюється, ігноруємо клік
      if (isSlotUpdating[time]) {
        return;
      }

      if (isAdminMode) {
        // В адмін-режимі дозволяємо блокувати/розблоковувати,
        // якщо слот НЕ ЗАБРОНЬОВАНО користувачем.
        // Якщо потрібно дозволити блокувати навіть заброньовані,
        // приберіть цю перевірку `!isTimeSlotBooked(time)`.
        if (!isTimeSlotBooked(time)) {
          setIsSlotUpdating((prev) => ({ ...prev, [time]: true })); // Встановлюємо "завантаження"
          try {
            await toggleBlockedTimeSlot(selectedDate, time);
          } catch (error) {
            console.error("Помилка блокування/розблокування слоту:", error);
          } finally {
            setIsSlotUpdating((prev) => ({ ...prev, [time]: false })); // Знімаємо "завантаження"
          }
        } else {
          // Якщо слот заброньований, адмін не може його розблокувати через цей інтерфейс.
          // Можливо, тут можна додати якийсь візуальний фідбек або логування.
          console.warn(
            `Слот ${time} заброньовано користувачем і не може бути змінений адміном через цю кнопку.`
          );
        }
      } else {
        // Користувацький режим: вибираємо слот, якщо він доступний
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
      isTimeSlotBooked, // Додано до залежностей
      isTimeSlotAvailable, // Додано до залежностей
      onTimeSelect, // Додано до залежностей
    ]
  );

  const now = useMemo(() => new Date(), []); // Отримуємо поточний час один раз або оновлюємо рідше
  const isToday = useMemo(() => {
    if (!selectedDate) return false;
    const today = new Date();
    const selected = new Date(selectedDate);
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

          // Перевірка на минулий час, актуально для адмін-режиму також
          const [hour, minute] = time.split(":").map(Number);
          const slotDateTime = new Date(selectedDate);
          slotDateTime.setHours(hour, minute, 0, 0);
          const isPastSlot = isToday && slotDateTime <= now;

          if (isPastSlot && !isAdminMode) {
            className += " unavailable past-time"; // Користувач не бачить минулі слоти
          } else if (booked) {
            className += " unavailable booked"; // Заброньовані слоти
          } else if (adminBlocked) {
            className += " unavailable admin-blocked"; // Адмін-заблоковані слоти
          } else if (selectedTime === time && !isAdminMode) {
            className += " selected"; // Вибраний користувачем слот
          } else if (isAdminMode && !isPastSlot) {
            // Для адміна: якщо не минулий і не заблокований/заброньований, то доступний для блокування
            className += " available-admin";
          } else if (isPastSlot && isAdminMode) {
            className += " unavailable past-time-admin"; // Адмін може бачити минулі, але вони недоступні для зміни
          }

          // Додаємо клас для стану завантаження
          if (isSlotUpdating[time]) {
            className += " updating-slot";
          }

          return (
            <button
              key={time}
              className={className}
              onClick={() => handleTimeSlotClick(time)}
              // Деактивуємо кнопку під час завантаження або якщо вона недоступна для кліку (для користувача)
              disabled={
                (booked && !isAdminMode) ||
                isSlotUpdating[time] ||
                (isPastSlot && !isAdminMode) ||
                (adminBlocked && !isAdminMode)
              }
              type="button"
            >
              {isSlotUpdating[time] ? (
                // Відображаємо спіннер під час завантаження
                <div
                  className="spinner-thin"
                  role="status"
                  aria-label="Завантаження"
                >
                  <span className="sr-only">Завантаження...</span>
                </div>
              ) : (
                // Відображаємо час або відповідний значок
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
