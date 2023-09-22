import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import styles from "./TimePicker.module.scss";
import { IconClock } from "styles/svgs";
import useCurrentDate from "hooks/useCurrentDate";

const HOURS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const MINUTES = {
  all: [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
  ],
  quater: ["00", "15", "30", "45"],
};
const PERIOD = ["AM", "PM"];

const TimePicker = ({
  classNameInput = "",
  minutesSelection = "all",
  selecteDate = new Date(),
  selectedTime = "",
  bufferTime = 0,
  onChange,
}) => {
  const toggleRef = useRef(null);
  const hourListRef = useRef(null);
  const minListRef = useRef(null);
  const perListRef = useRef(null);
  const [liveDate, liveTime] = useCurrentDate();
  const [togglePicker, setTogglePicker] = useState(false);
  const [timePicked, setTimePicked] = useState({
    hour: "",
    minutes: "",
    period: "",
  });

  const { selectedDateStr, selectedTMS, currentBuffTMS } = useMemo(() => {
    const selectedDateStr = selecteDate
      ? selecteDate.toLocaleDateString()
      : new Date().toLocaleDateString();
    const selectedTMS = new Date(
      `${selectedDateStr} ${selectedTime}`
    ).getTime();
    const currentBuffTMS =
      new Date(`${liveDate} ${liveTime}`).getTime() + 1000 * 60 * bufferTime;
    return { selectedDateStr, selectedTMS, currentBuffTMS };
  }, [selectedTime, selecteDate, liveDate, liveTime, bufferTime]);

  const handleTogglePicker = () => {
    setTogglePicker((e) => !e);
  };

  const alignTimePickedToTop = useCallback(
    (hr, min, pr, minSelect) => {
      if (!hourListRef.current || !minListRef.current || !perListRef.current)
        return;
      if (!hr || !min || !pr) return;
      const hrIndex = HOURS.indexOf(hr);
      const minIndex = MINUTES[minSelect].indexOf(min);
      const perIndex = PERIOD.indexOf(pr);
      const hrElement = hourListRef.current.children[hrIndex];
      const minElement = minListRef.current.children[minIndex];
      const perElement = perListRef.current.children[perIndex];
      hourListRef.current.scrollTop = hrElement?.offsetTop - 10;
      minListRef.current.scrollTop = minElement?.offsetTop - 10;
      perListRef.current.scrollTop = perElement?.offsetTop - 10;
    },
    [hourListRef, minListRef, perListRef]
  );

  // const handleChange = useCallback(
  //   (date) => {
  //     if (!date) return;
  //     const timeSelect = date?.toLocaleTimeString("en", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       hourCycle: "h12",
  //     });
  //     const [hr, min_pr] = timeSelect?.split(":") || ["", ""];
  //     const [min, pr] = min_pr?.split(" ") || ["", ""];
  //     const timeStr = `${hr}:${min} ${pr?.trim()}`;
  //     setTimePicked({ hour: hr, minutes: min, period: pr?.trim() });
  //     alignTimePickedToTop(hr, min, pr.trim(), minutesSelection);
  //     if (onChange) onChange(timeStr);
  //   },
  //   [alignTimePickedToTop, minutesSelection, onChange]
  // );

  // const handleChange = useCallback(
  //   (hour, minute, period) => {
  //     let newDate = new Date(selecteDate); // start with the selectedDate
  //     newDate.setHours(period === "PM" ? hour + 12 : hour); // adjust for AM/PM
  //     newDate.setMinutes(minute);

  //     const timeStr = newDate.toLocaleTimeString("en", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       hourCycle: "h12",
  //     });

  //     setTimePicked({ hour: hour, minutes: minute, period: period });
  //     if (onChange) onChange(timeStr);
  //   },
  //   [selecteDate, onChange]
  // );

  const handleChange = useCallback(
    (hour, minute, period) => {
      let newDate = new Date(selecteDate); // start with the selectedDate
      newDate.setHours(period === "PM" ? hour + 12 : hour); // adjust for AM/PM
      newDate.setMinutes(minute);

      const timeStr = newDate?.toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h12",
      });

      setTimePicked({ hour: hour, minutes: minute, period: period });
      alignTimePickedToTop(hour, minute, period, minutesSelection);
      if (onChange) onChange(timeStr);
    },
    [selecteDate, alignTimePickedToTop, minutesSelection, onChange]
  );

  useEffect(() => {
    if (!selectedDateStr || !selectedTMS || !currentBuffTMS) return;
    const confirmTMS =
      selectedTMS > currentBuffTMS ? selectedTMS : currentBuffTMS;
    const confirmDT = new Date(confirmTMS);
    if (selectedTMS > currentBuffTMS) {
      if (handleChange) handleChange(confirmDT);
      return;
    }
    const slotDT = confirmDT;
    const slotOffset = minutesSelection === "quater" ? 15 : 1;
    for (const min of MINUTES[minutesSelection]) {
      slotDT.setMinutes(slotOffset + parseInt(min), 0);
      if (slotDT.getTime() > confirmTMS) break;
    }
    if (handleChange) handleChange(slotDT);
  }, [minutesSelection, selectedDateStr, selectedTMS, currentBuffTMS]);

  useEffect(() => {
    if (!togglePicker) return;
    toggleRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    const { hour, minutes, period } = timePicked;
    alignTimePickedToTop(hour, minutes, period, minutesSelection);
  }, [togglePicker, minutesSelection, alignTimePickedToTop]);

  useEffect(() => {
    function handleclickOutside(event) {
      if (!toggleRef.current) return;
      const childDialog = toggleRef.current;
      if (childDialog && !childDialog.contains(event.target))
        setTogglePicker(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [toggleRef]);

  return (
    <div className={`${styles.cx_tpicker}`}>
      <div className="position-relative">
        <input
          type="text"
          name=""
          id=""
          className={`${classNameInput}`}
          value={`${timePicked.hour}:${timePicked.minutes} ${timePicked.period}`}
          onClick={handleTogglePicker}
          readOnly
        />
        <div
          className="position-absolute top-50 cursor-pointer"
          style={{ transform: "translateY(-50%)", right: "15px" }}
          onClick={handleTogglePicker}
        >
          <IconClock style={{ stroke: "var(--blue)" }} />
        </div>
        {/* Time Selection */}
        {togglePicker ? (
          <div className="cx_time_container" ref={toggleRef}>
            <div className="cx_time_lists">
              <ul className="cx_time_ul" ref={hourListRef}>
                {HOURS.map((item) => {
                  const hr = parseInt(item);
                  const min = timePicked.minutes;
                  const per = timePicked.period;
                  const dt = new Date(`${selectedDateStr} ${hr}:${min} ${per}`);
                  const flagDisable = dt.getTime() < currentBuffTMS;
                  const classActive =
                    timePicked.hour === item && !flagDisable
                      ? "cx_time_li_active"
                      : "";
                  const classNonSelectable = flagDisable
                    ? "non_selectable"
                    : "";
                  return (
                    <li
                      className={`cx_time_li ${classActive} ${classNonSelectable}`}
                      key={item}
                      onClick={(el) =>
                        !flagDisable &&
                        handleChange(
                          parseInt(item),
                          parseInt(timePicked.minutes),
                          timePicked.period
                        )
                      }
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
              <ul className="cx_time_ul" ref={minListRef}>
                {MINUTES[minutesSelection].map((item) => {
                  const hr = parseInt(timePicked.hour);
                  const min = parseInt(item);
                  const per = timePicked.period;
                  const dt = new Date(`${selectedDateStr} ${hr}:${min} ${per}`);
                  const flagDisable = dt.getTime() <= currentBuffTMS;
                  const classActive =
                    timePicked.minutes === item && !flagDisable
                      ? "cx_time_li_active"
                      : "";
                  const classNonSelectable = flagDisable
                    ? "non_selectable"
                    : "";
                  return (
                    <li
                      className={`cx_time_li ${classActive} ${classNonSelectable}`}
                      key={item}
                      onClick={(el) =>
                        !flagDisable &&
                        handleChange(
                          parseInt(timePicked.hour),
                          parseInt(item),
                          timePicked.period
                        )
                      }
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
              <ul className="cx_time_ul" ref={perListRef}>
                {PERIOD.map((item) => {
                  const hr = timePicked.hour;
                  const min = timePicked.minutes;
                  const per = item;
                  const dt = new Date(`${selectedDateStr} ${hr}:${min} ${per}`);
                  const classActive =
                    timePicked.period === item ? "cx_time_li_active" : "";
                  return (
                    <li
                      className={`cx_time_li ${classActive}`}
                      key={item}
                      onClick={(el) =>
                        handleChange(
                          parseInt(timePicked.hour),
                          parseInt(timePicked.minutes),
                          item
                        )
                      }
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TimePicker;
