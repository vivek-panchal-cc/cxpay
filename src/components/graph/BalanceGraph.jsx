import { CURRENCY_SYMBOL } from "constants/all";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const chartOption = {
  series: [
    {
      name: "series1",
    },
  ],
  options: {
    chart: {
      height: 200,
      width: 500,
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
    dataLabels: {
      enabled: false,
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

const BalanceGraph = (props) => {
  const { graphBackgroundImage, balanceDataArr, balance, monthDataArr } = props;
  const [options, setOptions] = useState(chartOption);

  useEffect(() => {
    if (!balanceDataArr && !monthDataArr) return;
    const tmpObj = { ...options };
    tmpObj.series[0].data = balanceDataArr;
    tmpObj.options.xaxis.categories = monthDataArr;
    setOptions(tmpObj);
  }, [JSON.stringify(balanceDataArr), JSON.stringify(monthDataArr)]);

  // chartOption.series[0].data = balanceDataArr; //.map((val) => val);
  // chartOption.options.xaxis.categories = props.monthDataArr; //.map((val) => val.volume);

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
          {balance && balance.available && (
            <div className="p-4">
              <h6 className="h6" style={{ color: "#0081c5" }}>
                Available Balance
              </h6>
              <h2 className="h3 text-black fw-bolder">
                {CURRENCY_SYMBOL} {balance.available}
              </h2>
            </div>
          )}
          {balance && balance.lock && (
            <div className="p-4 pb-0">
              <h6 className="h6" style={{ color: "#0081c5" }}>
                Block Amount
              </h6>
              <h2 className="h3 text-black fw-bolder">
                {CURRENCY_SYMBOL} {balance.lock}
              </h2>
            </div>
          )}
        </div>
        <div className="px-2 z-1">
          <div id="chart">
            {balanceDataArr &&
              monthDataArr &&
              balanceDataArr.length > 0 &&
              monthDataArr.length > 0 && (
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
