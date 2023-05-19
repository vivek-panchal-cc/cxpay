import React, { useState, useRef, useEffect } from "react";
import styles from "./TimePicker.module.scss";
import { IconClock } from "styles/svgs";

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
    "60",
  ],
  quater: ["00", "15", "30", "45"],
};
const PERIOD = ["AM", "PM"];

const TimePicker = ({
  classNameInput = "",
  classNameSelect = "",
  classNameOption = "",
  minutesSelection = "all",
  value,
  onChange,
}) => {
  const toggleRef = useRef(null);
  const [initChange, setInitChange] = useState(false);
  const [togglePicker, setTogglePicker] = useState(false);
  const [timePicked, setTimePicked] = useState({
    hour: "",
    minutes: "",
    period: "",
  });

  const handleTogglePicker = () => {
    setTogglePicker((e) => !e);
  };

  const handleChange = (element, tParameter, value) => {
    if (!element) return;
    element.currentTarget.parentNode.scrollTop =
      element.currentTarget.offsetTop - 10;
    let { hour, minutes, period } = timePicked;
    switch (tParameter) {
      case "hour":
        hour = value;
        break;
      case "minute":
        minutes = value;
        break;
      case "period":
        period = value;
        break;
    }
    const timeStr = `${hour}:${minutes} ${period}`;
    setTimePicked({ hour, minutes, period });
    onChange && onChange(timeStr);
  };

  useEffect(() => {
    const tmSel = value
      ? value
      : new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h12",
        });
    const [hr, min_pr] = tmSel.split(":");
    const [min, pr] = min_pr.split(" ");
    const timeStr = `${hr}:${min} ${pr?.trim()}`;
    setTimePicked({ hour: hr, minutes: min, period: pr?.trim() });
    onChange && onChange(timeStr);
  }, [value]);

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
    <div className={` ${styles.cx_tpicker}`}>
      <div className="position-relative">
        <input
          type="text"
          name=""
          id=""
          value={`${timePicked.hour}:${timePicked.minutes} ${timePicked.period}`}
          className={`${classNameInput}`}
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
        {togglePicker && (
          <div className="cx_time_container" ref={toggleRef}>
            <ul className="cx_time_ul">
              {HOURS.map((item) => (
                <li
                  className={`cx_time_li ${
                    timePicked.hour === item ? "cx_time_li_active" : ""
                  }`}
                  key={item}
                  onClick={(el) => handleChange(el, "hour", item)}
                >
                  {item}
                </li>
              ))}
            </ul>
            <ul className="cx_time_ul">
              {MINUTES[minutesSelection].map((item) => (
                <li
                  className={`cx_time_li ${
                    timePicked.minutes === item ? "cx_time_li_active" : ""
                  }`}
                  key={item}
                  onClick={(el) => handleChange(el, "minute", item)}
                >
                  {item}
                </li>
              ))}
            </ul>
            <ul className="cx_time_ul">
              {PERIOD.map((item) => (
                <li
                  className={`cx_time_li ${
                    timePicked.period === item ? "cx_time_li_active" : ""
                  }`}
                  key={item}
                  onClick={(el) => handleChange(el, "period", item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
