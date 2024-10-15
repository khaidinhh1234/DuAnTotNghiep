import { Progress } from "antd";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface Series {
  name: string;
  data: number[];
}

interface Options {
  chart: {
    type: string;
    height: number;
    stacked: boolean;
  };
  colors: string[];
  plotOptions: {
    bar: {
      borderRadius: number;
      borderRadiusApplication: string;
      borderRadiusWhenStacked: string;
      horizontal: boolean;
      barHeight: string;
    };
  };
  dataLabels: {
    enabled: boolean;
  };
  stroke: {
    width: number;
    colors: string[];
  };
  grid: {
    xaxis: {
      lines: {
        show: boolean;
      };
    };
  };
  yaxis: {
    stepSize: number;
  };
  tooltip: {
    shared: boolean;
    x: {
      formatter: (val: any) => string;
    };
    y: {
      formatter: (val: number) => string;
    };
  };
  title: {
    text: string;
  };
  xaxis: {
    categories: string[];
    title: {
      text: string;
    };
    labels: {
      formatter: (val: number) => string;
    };
  };
}

interface State {
  series: Series[];
  options: Options;
}

class Chart4 extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [
        {
          name: "Người",
          data: [23, 63, 34, 34, 23, 1],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 340,
          stacked: true,
        },
        colors: ["#008FFB", "#FF4560"],
        plotOptions: {
          bar: {
            borderRadius: 3,
            borderRadiusApplication: "end", // 'around', 'end'
            borderRadiusWhenStacked: "all", // 'all', 'last'
            horizontal: true,
            barHeight: "60%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
        yaxis: {
          stepSize: 1,
        },
        tooltip: {
          shared: false,
          x: {
            formatter: (val) => val,
          },
          y: {
            formatter: (val) => val + " người",
          },
        },

        xaxis: {
          categories: [
            "dưới 18 tuổi",
            "18-24 tuổi",
            "25-34 tuổi",
            "35-44 tuổi",
            "45-54 tuổi",
            "Trên 55 tuổi",
          ],

          labels: {
            formatter: (val) => Math.abs(Math.round(val)).toString(),
          },
          title: {
            text: "",
          },
        },
        title: {
          text: "",
        },
      },
    };
  }

  render() {
    return (
      <>
        <h3 className="mx-5 font-semibold">Độ tuổi</h3>
        <div className="">
          <Progress
            percent={59}
            percentPosition={{ align: "center", type: "inner" }}
            size={[300, 10]}
            strokeColor={["#38ef7d", "#ff4d4f"]}
            showInfo={false}
            className="px-5"
          />
          <div></div>
          <div className="flex items-center gap-3 mx-5">
            <p className="w-3 h-3 bg-[#38ef7d] mt-3 rounded-lg"></p>{" "}
            <span> có ngày sinh</span>{" "}
            <p className="w-3 h-3 bg-[#d9d9d9] mt-3  rounded-lg"></p>{" "}
            <span> không có ngày sinh</span>{" "}
          </div>

          <div id="chart">
            <ReactApexChart
              options={this.state.options as any}
              series={this.state.series}
              type="bar"
              height={280}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Chart4;
