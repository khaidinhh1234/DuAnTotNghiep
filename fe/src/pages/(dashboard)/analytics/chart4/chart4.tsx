import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

declare global {
  interface Window {
    Apex: any;
  }
}

const Chart4: React.FC = () => {
  useEffect(() => {
    // Thiết lập mặc định cho Apex
    window.Apex = {
      chart: {
        foreColor: "#ccc",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: 3,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        theme: "dark",
      },
      grid: {
        borderColor: "#535A6C",
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
    };

    // Biểu đồ spark1
    const spark1 = {
      chart: {
        id: "spark1",
        group: "sparks",
        type: "line",
        height: 80,
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        },
      },
      series: [
        {
          data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21],
        },
      ],
      stroke: {
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      colors: ["#fff"],
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: () => "",
          },
        },
      },
    };

    // Render các biểu đồ
    new ApexCharts(document.querySelector("#spark1"), spark1).render();

    // Repeat for spark2, spark3, and spark4...
    const spark2 = {
      chart: {
        id: "spark2",
        group: "sparks",
        type: "line",
        height: 80,
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        },
      },
      series: [
        {
          data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69],
        },
      ],
      stroke: {
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      colors: ["#fff"],
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: () => "",
          },
        },
      },
    };

    new ApexCharts(document.querySelector("#spark2"), spark2).render();

    // Add other charts (spark3, spark4, optionsLine, etc.) similarly...

    // Cleanup charts on component unmount
    return () => {
      ApexCharts.exec("spark1", "destroy");
      ApexCharts.exec("spark2", "destroy");
    };
  }, []);

  return (
    <div>
      <div id="spark1"></div>
      <div id="spark2"></div>
      {/* Add divs for other charts as well */}
    </div>
  );
};

export default Chart4;
