import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
  minutesSelection = "all",
  fromDate,
  selecteDate,
  value,
  onChange,
}) => {
  const toggleRef = useRef(null);
  const hourListRef = useRef(null);
  const minListRef = useRef(null);
  const perListRef = useRef(null);
  const [togglePicker, setTogglePicker] = useState(false);
  const [timePicked, setTimePicked] = useState({
    hour: "",
    minutes: "",
    period: "",
  });

  const { fromDtm, selDt } = useMemo(() => {
    if (!fromDate || !selecteDate)
      return {
        fromDtm: new Date().getTime(),
        selDt: new Date(),
      };
    const fromDtm = fromDate?.getTime();
    const selDt = selecteDate;
    return { fromDtm, selDt };
  }, [fromDate, selecteDate]);

  const handleTogglePicker = () => {
    setTogglePicker((e) => !e);
  };

  const handleChange = useCallback(
    (date) => {
      if (!date) return;
      const timeSelect = date?.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h12",
      });
      const [hr, min_pr] = timeSelect.split(":");
      const [min, pr] = min_pr.split(" ");
      if (hourListRef.current && minListRef.current && perListRef.current) {
        const hrIndex = HOURS.indexOf(hr);
        const minIndex = MINUTES[minutesSelection].indexOf(min);
        const perIndex = PERIOD.indexOf(pr?.trim());
        const hrElement = hourListRef.current.children[hrIndex];
        const minElement = minListRef.current.children[minIndex];
        const perElement = perListRef.current.children[perIndex];
        hourListRef.current.scrollTop = hrElement?.offsetTop - 10;
        minListRef.current.scrollTop = minElement?.offsetTop - 10;
        perListRef.current.scrollTop = perElement?.offsetTop - 10;
      }
      const timeStr = `${hr}:${min} ${pr?.trim()}`;
      setTimePicked({ hour: hr, minutes: min, period: pr?.trim() });
      onChange && onChange(timeStr);
    },
    [hourListRef, minListRef, perListRef, minutesSelection, onChange]
  );

  useEffect(() => {
    if (value && typeof value === "string" && !value.includes("Invalid Date")) {
      const valDate = new Date(`${selDt.toDateString()} ${value}`);
      if (valDate.getTime() > fromDtm) {
        handleChange(valDate);
        return;
      }
    }
    let slotDate;
    const currTm = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h12",
    });
    const selDate = new Date(`${selDt.toDateString()} ${currTm}`);
    const modMins =
      minutesSelection === "quater"
        ? selDate.getMinutes() % 15
        : selDate.getMinutes() % 1;
    selDate.setMinutes(selDate.getMinutes() - modMins);
    for (const min of MINUTES[minutesSelection]) {
      const appMin =
        minutesSelection === "quater" ? parseInt(min) + 15 : parseInt(min) + 1;
      const appTime = selDate.getTime() + 1000 * 60 * appMin;
      console.log(selDate, new Date(appTime));
      if (appTime > fromDtm) {
        slotDate = new Date(appTime);
        break;
      }
    }
    handleChange(slotDate);
  }, [value, selDt, fromDtm, minutesSelection]);

  useEffect(() => {
    if (!togglePicker) return;
    toggleRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    const dts = new Date(selDt);
    const tstr = `${timePicked.hour}:${timePicked.minutes} ${timePicked.period}`;
    const dt = new Date(`${dts.toDateString()} ${tstr}`);
    handleChange(dt);
  }, [togglePicker]);

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
            <div className="cx_time_lists">
              <ul className="cx_time_ul" ref={hourListRef}>
                {HOURS.map((item) => {
                  const lhr = parseInt(item);
                  const lmin = timePicked.minutes;
                  const lper = timePicked.period;
                  const dt = new Date(
                    `${selDt.toDateString()} ${lhr}:${lmin} ${lper}`
                  );
                  const flagDisable = dt.getTime() < fromDtm;
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
                      onClick={(el) => !flagDisable && handleChange(dt)}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
              <ul className="cx_time_ul" ref={minListRef}>
                {MINUTES[minutesSelection].map((item) => {
                  const lhr = parseInt(timePicked.hour);
                  const lmin = parseInt(item);
                  const lper = timePicked.period;
                  const dt = new Date(
                    `${selDt.toDateString()} ${lhr}:${lmin} ${lper}`
                  );
                  const flagDisable = dt.getTime() < fromDtm;
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
                      onClick={(el) => !flagDisable && handleChange(dt)}
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
                  const dt = new Date(
                    `${selDt.toDateString()} ${hr}:${min} ${per}`
                  );
                  const classActive =
                    timePicked.period === item ? "cx_time_li_active" : "";
                  return (
                    <li
                      className={`cx_time_li ${classActive}`}
                      key={item}
                      onClick={(el) => handleChange(dt)}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* <div className="cx_time_confirm">
              <button onClick={handleTogglePicker}> Ok </button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
