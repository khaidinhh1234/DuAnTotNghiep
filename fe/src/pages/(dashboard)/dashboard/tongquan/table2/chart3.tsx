import React from "react";
import ReactApexChart from "react-apexcharts";

interface SeriesData {
  name: string;
  data: number[];
}

interface ChartOptions {
  chart: {
    type: string;
    height: number;
  };
  plotOptions: {
    bar: {
      horizontal: boolean;
      columnWidth: string;
      endingShape: string;
    };
  };
  dataLabels: {
    enabled: boolean;
  };
  stroke: {
    show: boolean;
    width: number;
    colors: string[];
  };
  xaxis: {
    categories: string[];
  };
  yaxis: {
    title: {
      text: string;
    };
  };
  fill: {
    opacity: number;
  };
  tooltip: {
    y: {
      formatter: (val: number) => string;
    };
  };
}

interface ApexChartState {
  series: SeriesData[];
  options: ChartOptions;
}

class Chart3 extends React.Component<{}, ApexChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [
        {
          name: "Lợi nhuận ròng",
          data: [44, 55, 57, 56, 61, 8, 63, 60, 66, 87, 105, 91],
        },
        {
          name: "Doanh thu",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 92, 52, 53, 41],
        },
        // {
        //   name: "Dòng tiền tự do",
        //   data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
        // },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [
            "0h",

            "2h",

            "4h",

            "6h",

            "8h",

            "10h",

            "12h",

            "14h",

            "16h",

            "18h",

            "20h",

            "22h",
          ],
        },
        yaxis: {
          title: {
            text: "",
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val: number) => {
              return `${val.toLocaleString("vi-VN")} đ`;
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options as any}
            series={this.state.series}
            type="bar"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default Chart3;
