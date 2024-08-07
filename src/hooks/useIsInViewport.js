import { useEffect, useMemo, useState } from "react";

const useIsInViewport = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      ),
    []
  );

  useEffect(() => {
    if (!observer || !ref.current) return;
    observer?.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, ref?.current, observer]);

  return isIntersecting;
};

export default useIsInViewport;
