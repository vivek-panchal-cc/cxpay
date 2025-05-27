import { useEffect, useState, useRef } from "react";

const useCountUp = (targetValue, duration = 1000) => {
  const [currentValue, setCurrentValue] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    let start = null;
    const end = parseFloat(targetValue) || 0;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      setCurrentValue(Number((end * percent).toFixed(2)));

      if (percent < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [targetValue, duration]);

  return currentValue;
};

export default useCountUp;
