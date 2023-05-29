import { CURRENCY_SYMBOL } from "constants/all";
import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

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
        var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        return (
          '<p class="p-2" style="color:#00BAEC;font-weight:bold">' +
          data +
          "</p>"
        );
      },
    },
    xaxis: {
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

const spendings = Array.from({ length: 12 }, () => 0);

const BalanceGraph = (props) => {
  const { graphBackgroundImage, balanceDataArr, balance, monthDataArr } = props;
  const [options, setOptions] = useState({ ...chartOption });

  const { availableBalance, lockBalance } = useMemo(() => {
    const { available, lock } = balance || {};
    const availableBalance = available
      ? parseFloat(available.replace(/,/g, ""))
      : "";
    const lockBalance = lock ? parseFloat(lock) : "";
    return { availableBalance, lockBalance };
  }, [balance]);

  useEffect(() => {
    if (!balanceDataArr && !monthDataArr) return;
    const tmpObj = { ...chartOption };
    // const spends = [...spendings];
    // if (monthDataArr[0]) {
    //   const index = months.indexOf(monthDataArr?.[0]);
    //   spends[index] = balanceDataArr[0];
    //   tmpObj.series[0].data = spends;
    // }
    tmpObj.series[0].data = balanceDataArr;
    tmpObj.options.xaxis.categories = monthDataArr;
    setOptions(tmpObj);
  }, [balanceDataArr, monthDataArr]);

  return (
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
            <h2 className="h3 text-black fw-bolder">
              {availableBalance !== ""
                ? `${CURRENCY_SYMBOL} ${availableBalance.toFixed(2)}`
                : ""}
            </h2>
          </div>
          {lockBalance !== "" && lockBalance > 0 && (
            <div className="p-4 pb-0">
              <h6 className="h6" style={{ color: "#0081c5" }}>
                Block Amount
              </h6>
              <h2 className="h3 text-black fw-bolder">
                {CURRENCY_SYMBOL} {lockBalance.toFixed(2)}
              </h2>
            </div>
          )}
        </div>
        <div className="px-2 z-1">
          <div id="chart">
            {options.series[0].data.length > 0 && (
              <ReactApexChart
                options={options.options}
                series={options.series}
                type="area"
                height={150}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceGraph;
