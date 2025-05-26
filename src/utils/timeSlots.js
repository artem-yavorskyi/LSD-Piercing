export const generateTimeSlots = () => {
  const slots = [];
  let startHour = 8;
  let startMinute = 0;

  while (startHour < 18 || (startHour === 17 && startMinute === 0)) {
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
