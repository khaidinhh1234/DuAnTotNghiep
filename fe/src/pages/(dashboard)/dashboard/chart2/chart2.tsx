import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

const Chart2: React.FC = () => {
  useEffect(() => {
    const options = {
      series: [
        {
          name: "Blog Website",
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
        {
          name: "Mạng Xã Hội",
          type: "line",
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
        },
      ],
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Nguồn Lưu Lượng",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: [
        "01 Thg 1 2001",
        "02 Thg 1 2001",
        "03 Thg 1 2001",
        "04 Thg 1 2001",
        "05 Thg 1 2001",
        "06 Thg 1 2001",
        "07 Thg 1 2001",
        "08 Thg 1 2001",
        "09 Thg 1 2001",
        "10 Thg 1 2001",
        "11 Thg 1 2001",
        "12 Thg 1 2001",
      ],
      yaxis: [
        {
          title: {
            text: "Blog Website",
          },
        },
        {
          opposite: true,
          title: {
            text: "Mạng Xã Hội",
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    // Cleanup to destroy chart on component unmount
    return () => {
      chart.destroy();
    };
  }, []);

  return <div id="chart" />;
};

export default Chart2;
