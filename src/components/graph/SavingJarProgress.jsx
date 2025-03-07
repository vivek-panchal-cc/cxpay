import ModalReservedAmount from "components/modals/ModalReservedAmount";
import WrapAmount from "components/wrapper/WrapAmount";
import {
  CURRENCY_SYMBOL,
  getInitials,
  getRandomColorClass,
} from "constants/all";
import { LoaderContext } from "context/loaderContext";
import React, { useContext, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  IconBalanceEyeOpen,
  IconBalanceEyeClose,
  IconJarCreate,
} from "styles/svgs";

const chartOption = {
  series: [
    {
      name: "series1",
      data: [],
    },
  ],
  options: {
    chart: {
      height: 200,
      width: 1000,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      borderColor: "#555",
      clipMarkers: false,
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColor: "#00BAEC",
      strokeWidth: 3,
    },
    yaxis: [
      {
        labels: {
          show: false,
        },
      },
    ],
    tooltip: {
      marker: {
        show: true,
      },
      fillSeriesColor: true,
      style: {
        fontSize: "12px",
        color: "#000",
      },
      fixed: {
        enabled: false,
        position: "topRight",
        offsetX: 0,
        offsetY: 0,
      },
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        return `<p class="p-2" style="color:#00BAEC;font-weight:bold">${data}</p>`;
      },
    },
    xaxis: {
      min: 4,
      max: 8,
      axisBorder: {
        show: true,
        color: "#000",
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: "#a2a2a2",
        },
      },
      categories: [],
    },
  },
};

const months = [];

const SavingJarProgress = (props) => {
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const {
    graphBackgroundImage,
    balanceDataArr,
    balance,
    monthDataArr,
    getBalance,
    savingJarDetails,
  } = props;
  console.log("savingJarDetails: ", savingJarDetails);
  const [options, setOptions] = useState({ ...chartOption });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservedDetails, setReservedDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [displayedBalance, setDisplayedBalance] = useState(0);
  const [displayedReservedBalance, setDisplayedReservedBalance] = useState(0);

  const { availableBalance, lockBalance } = useMemo(() => {
    const { available, lock } = balance || {};
    const availableBalance =
      typeof available === "number" ? available.toFixed(2) : "";
    const lockBalance =
      typeof lock === "number" && lock > 0 ? lock.toFixed(2) : "";
    return { availableBalance, lockBalance };
  }, [balance]);

  useEffect(() => {
    const duration = 1000; // Total time for animation (5 seconds)
    const intervalTime = 50; // Update the balance every 10ms
    const steps = duration / intervalTime;
    const increment = availableBalance / steps;

    let currentBalance = 0;
    const interval = setInterval(() => {
      currentBalance += increment;
      if (currentBalance >= availableBalance) {
        currentBalance = availableBalance;
        clearInterval(interval);
      }
      setDisplayedBalance(currentBalance);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [availableBalance]);

  useEffect(() => {
    const duration = 1000; // Total time for animation (5 seconds)
    const intervalTime = 50; // Update the balance every 10ms
    const steps = duration / intervalTime;
    const increment = lockBalance / steps;

    let currentReservedBalance = 0;
    const interval = setInterval(() => {
      currentReservedBalance += increment;
      if (currentReservedBalance >= lockBalance) {
        currentReservedBalance = lockBalance;
        clearInterval(interval);
      }
      setDisplayedReservedBalance(currentReservedBalance);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [lockBalance]);

  useEffect(() => {
    // Process monthDataArr and generate sortedMonthValues
    const formattedMonths = monthDataArr?.map((month) => {
      const [monthValue, year] = month?.split(" "); // Extracting the month and year parts
      const monthIndex = new Date(
        Date.parse(`${monthValue} 1, ${year}`)
      )?.getMonth(); // Get the month index (0-11)
      return { monthValue, year, monthIndex }; // Returning an object with month, year, and monthIndex
    });

    // Sort the months array chronologically by year and month index
    formattedMonths?.sort((a, b) => {
      if (a.year === b.year) {
        return a.monthIndex - b.monthIndex; // If years are the same, compare month indexes
      }
      return a.year - b.year; // Otherwise, sort by year
    });

    // Extract only the month values from the sorted array
    const sortedMonthValues = formattedMonths?.map(
      (month) => `${month.monthValue} ${month.year}`
    );

    // Clear the months array before pushing new values
    months.length = 0;

    // Push sorted month values to the months array
    sortedMonthValues?.forEach((monthValue) => {
      months?.push(monthValue);
    });
    if (monthDataArr?.length === 1) {
      const [monthValue, year] = monthDataArr[0]?.split(" ");
      const date = new Date(Date.parse(`${monthValue} 1, ${year}`));
      const prevDate = new Date(date);
      prevDate?.setMonth(prevDate?.getMonth() - 1);
      const nextDate = new Date(date);
      nextDate?.setMonth(nextDate?.getMonth() + 1);
      const prevMonthName = prevDate?.toLocaleString("default", {
        month: "short",
      });
      const nextMonthName = nextDate?.toLocaleString("default", {
        month: "short",
      });
      months?.unshift(`${prevMonthName} ${year}`);
      months?.push(`${nextMonthName} ${year}`);
    }

    // Now you can use sortedMonthValues wherever you need the months to be in order
  }, [monthDataArr]);
  const toggleSetBalanceShow = () => {
    setShowBalance(!showBalance);
  };

  const handleGetBalance = async () => {
    setIsLoading(true);
    try {
      await getBalance();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="dashboard-graph-wrap rounded-4"
        style={{
          background: `url(${graphBackgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-100">
          <div className="d-flex">
            <div className="jar-card">
              <div className="jar-header">
                <div className="jar-details">
                  {savingJarDetails?.jar_icon ? (
                    <img
                      src={savingJarDetails?.jar_icon}
                      className="jar-icon"
                      alt="Jar Icon"
                    />
                  ) : (
                    <div
                      className={`initials-circle ${getRandomColorClass(
                        savingJarDetails?.jar_name
                      )}`}
                    >
                      {getInitials(savingJarDetails?.jar_name)}
                    </div>
                  )}
                  <div>
                    <h5 className="jar-name">
                      {savingJarDetails?.jar_name || "Vacation Fund"}
                    </h5>
                    <p className="jar-category">
                      {savingJarDetails?.jar_category_name ||
                        "Jar Category written here"}
                    </p>
                  </div>
                </div>
                <IconJarCreate className="jar-settings" />
              </div>

              <div className="jar-balance">
                <h2 className="jar-amount">
                  {savingJarDetails?.deposite_amount || "500"} NAFL
                </h2>
                <span className="jar-target">
                  / {savingJarDetails?.target_amount || "2000"} NAFL
                </span>
              </div>

              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        ((savingJarDetails?.deposite_amount || 500) /
                          (savingJarDetails?.target_amount || 2000)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="status-badge">In Progress</span>
                <span className="jar-date">
                  <IconJarCreate className="calendar-icon" />
                  {savingJarDetails?.target_date || "01/06/2025"}
                </span>
              </div>

              <div className="jar-actions">
                <div className="action-button share-jar">
                  <IconJarCreate />
                  <span>Share Jar</span>
                </div>
                <div className="action-button transfer-wallet">
                  <IconJarCreate />
                  <span>Transfer to Wallet</span>
                </div>
                <div className="action-button fund-transfer">
                  <IconJarCreate />
                  <span>Fund Transfer</span>
                </div>
              </div>
            </div>

            {/* <div className="p-4 pb-0 flex-grow-1 text-end cursor-pointer">
              <IconJarCreate
                className={isLoading ? `refresh-icon-loading` : ""}
                style={{ marginBottom: "4px" }}
                stroke="#0081C5"
                onClick={handleGetBalance}
              />
            </div> */}
          </div>
          <div className="px-2 z-1">
            <div id="chart" className="overflow-hidden">
              {!isLoading && options.series[0].data.length > 0 ? (
                <ReactApexChart
                  options={options.options}
                  series={options.series}
                  type="area"
                  height={150}
                  width={"100%"}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <ModalReservedAmount
        id="user-details-popup"
        className="reserved-amount-modal"
        show={isModalOpen}
        setShow={setIsModalOpen}
        loading={loadingDetails}
        details={reservedDetails}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default SavingJarProgress;
