import { useEffect, useState } from "react";

const useCurrentDate = () => {
  const locale = "en";
  // Save the current date to be able to trigger an update
  const [today, setDate] = useState(new Date());

  useEffect(() => {
    // Interval which update the current data every minute
    const timer = setInterval(() => {
      // This will trigger a rerender every component that uses the useCurrentDate hook.
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const date = today.toLocaleDateString(locale);
  const time = today.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return [date, time];
};

export default useCurrentDate;
