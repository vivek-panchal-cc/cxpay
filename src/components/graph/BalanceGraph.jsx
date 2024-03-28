import ModalReservedAmount from "components/modals/ModalReservedAmount";
import WrapAmount from "components/wrapper/WrapAmount";
import { CURRENCY_SYMBOL } from "constants/all";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext, useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  IconBalanceEyeOpen,
  IconBalanceEyeClose,
  IconShowReservedAmount,
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
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
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

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BalanceGraph = (props) => {
  const { isLoading } = useContext(LoaderContext);
  const { graphBackgroundImage, balanceDataArr, balance, monthDataArr } = props;
  const [options, setOptions] = useState({ ...chartOption });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservedDetails, setReservedDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showAvailableBalance, setShowAvailableBalance] = useState(false);
  const [showReservedAmount, setShowReservedAmount] = useState(false);

  const { availableBalance, lockBalance } = useMemo(() => {
    const { available, lock } = balance || {};
    const availableBalance =
      typeof available === "number" ? available.toFixed(2) : "";
    const lockBalance =
      typeof lock === "number" && lock > 0 ? lock.toFixed(2) : "";
    return { availableBalance, lockBalance };
  }, [balance]);

  // useEffect(() => {
  //   const chartObj = JSON.parse(JSON.stringify(chartOption));
  //   const tmpObj = { ...chartObj };
  //   const spends = months.map(() => 0);
  //   if (monthDataArr && monthDataArr.length > 0) {
  //     months.map((mon, index) => {
  //       const ind = monthDataArr.indexOf(mon);
  //       if (ind > -1) {
  //         const amount = balanceDataArr[ind];
  //         spends[index] = amount;
  //       }
  //       return mon;
  //     });
  //     const dtnow = new Date();
  //     dtnow.setMonth(dtnow.getMonth() - 2);
  //     const minx = dtnow.getMonth() + 1;
  //     dtnow.setMonth(dtnow.getMonth() + 5);
  //     const maxx = dtnow.getMonth() + 1;
  //     tmpObj.series[0].data = spends;
  //     tmpObj.options.xaxis.categories = months;
  //     tmpObj.options.xaxis.min = minx;
  //     tmpObj.options.xaxis.max = maxx;
  //     tmpObj.options.tooltip.custom = chartOption.options.tooltip.custom;
  //     setOptions({ ...tmpObj });
  //     return;
  //   } else {
  //     setOptions(chartObj);
  //     return;
  //   }
  // }, [balanceDataArr, monthDataArr]);

  useEffect(() => {
    const chartObj = JSON.parse(JSON.stringify(chartOption));
    const tmpObj = { ...chartObj };
    const spends = months.map(() => 0);
    let minIndex = Number.MAX_VALUE;
    let maxIndex = -1;
    if (monthDataArr && monthDataArr.length > 0) {
      months.map((mon, index) => {
        const ind = monthDataArr.indexOf(mon);
        if (ind > -1) {
          if (index < minIndex) minIndex = index;
          if (index > maxIndex) maxIndex = index;
          let amount = balanceDataArr[ind];
          // spends[index] = amount?.toFixed(2);
          if (typeof amount === "string") {
            amount = parseFloat(amount);
          }
          const validAmount =
            typeof amount === "number" ? amount.toFixed(2) : 0;
          spends[index] = validAmount;
        }
        return mon;
      });
      maxIndex++;
      minIndex++;
      let diff = maxIndex - minIndex;
      while (diff <= 3) {
        if (minIndex - 1 >= 1) minIndex--;
        if (maxIndex + 1 <= 12) maxIndex++;
        diff = maxIndex - minIndex;
      }
      tmpObj.series[0].data = spends;
      tmpObj.options.xaxis.categories = months;
      tmpObj.options.xaxis.min = minIndex;
      tmpObj.options.xaxis.max = maxIndex;
      tmpObj.options.tooltip.custom = chartOption.options.tooltip.custom;
      setOptions({ ...tmpObj });
      return;
    } else {
      setOptions(chartObj);
      return;
    }
  }, [balanceDataArr, monthDataArr]);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setLoadingDetails(true);
    try {
      const { data } = await apiRequest.listReservedAmount();
      if (!data.success) throw data.message;
      const details = data.data.transactions;
      if (!details) {
        setIsModalOpen(false);
        return;
      }
      if (Array.isArray(details) && details.length > 0) {
        setReservedDetails(details);
      } else {
        // Handle case where details is not an array or is an empty array.
        setIsModalOpen(false);
        toast.error("No transaction details available.");
      }
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      setIsModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleAvailableBalance = () => {
    setShowAvailableBalance(!showAvailableBalance);
  };

  const toggleReservedAmount = () => {
    setShowReservedAmount(!showReservedAmount);
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
            <div className="p-4">
              <h6 className="h6" style={{ color: "#0081c5" }}>
                Available Balance
              </h6>
              {availableBalance && (
                <h2 className="h3 text-black fw-bolder">
                  {showAvailableBalance ? ( // Check if available balance should be shown
                    <WrapAmount value={availableBalance} />
                  ) : (
                    `${CURRENCY_SYMBOL} ${new Array(
                      (availableBalance + "")?.length
                    )
                      ?.fill("*")
                      ?.join("")}`
                  )}
                  <span>
                    {!showAvailableBalance ? ( // Render eye button only if available balance is hidden
                      <span
                        className="eye-icon ms-2"
                        title="Click to view available balance"
                        onClick={toggleAvailableBalance} // Toggle visibility on click
                      >
                        <IconBalanceEyeOpen className="h3 mb-1 text-black fw-bolder reserved-amount" />
                      </span>
                    ) : (
                      <span
                        className="eye-icon ms-2"
                        title="Click to view available balance"
                        onClick={toggleAvailableBalance} // Toggle visibility on click
                      >
                        <IconBalanceEyeClose className="h3 mb-1 text-black fw-bolder reserved-amount" />
                      </span>
                    )}
                  </span>
                </h2>
              )}
            </div>
            {lockBalance ? (
              <>
                <div className="p-4 pb-0">
                  <h6 className="h6 mb-1" style={{ color: "#0081c5" }}>
                    Reserved Amount&nbsp;
                    <span
                      className="eye-icon ms-2"
                      title="Click to view reserved amount"
                    >
                      <IconShowReservedAmount
                        className="h3 mb-1 text-black fw-bolder reserved-amount"
                        onClick={handleOpenModal}
                      />
                    </span>
                  </h6>
                  {lockBalance && (
                    <h2 className="h3 text-black fw-bolder">
                      {showReservedAmount ? (
                        <WrapAmount value={lockBalance} />
                      ) : (
                        `${CURRENCY_SYMBOL} ${new Array(
                          (lockBalance + "")?.length
                        )
                          ?.fill("*")
                          ?.join("")}`
                      )}
                      <span>
                        {!showReservedAmount ? ( // Render eye button only if available balance is hidden
                          <span
                            className="eye-icon ms-2"
                            title="Click to view available balance"
                            onClick={toggleReservedAmount} // Toggle visibility on click
                          >
                            <IconBalanceEyeOpen className="h3 mb-1 text-black fw-bolder reserved-amount" />
                          </span>
                        ) : (
                          <span
                            className="eye-icon ms-2"
                            title="Click to view available balance"
                            onClick={toggleReservedAmount} // Toggle visibility on click
                          >
                            <IconBalanceEyeClose className="h3 mb-1 text-black fw-bolder reserved-amount" />
                          </span>
                        )}
                      </span>
                    </h2>
                  )}
                </div>
              </>
            ) : null}
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

export default BalanceGraph;
