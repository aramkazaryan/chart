import "./styles.css";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataI {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

const data: DataI[] = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

// расчитать зону где z-score >= 1 сверху и снизу в процентах
const calculateRangePercentages = ({
  max,
  min,
  mean,
  standardDeviation,
}: {
  max: number;
  min: number;
  mean: number;
  standardDeviation: number;
}) => {
  const range = max - min;
  return {
    aboveRangeByInPercent: ((max - (mean + standardDeviation)) * 100) / range,
    belowStandartValueInPercent:
      (Math.abs(min - (mean - standardDeviation)) * 100) / range,
  };
};

// среднее значение,стандартное отклонение для UV и PV
const uvMean = data.reduce((acc, { uv }) => (acc += uv), 0) / data.length;
const uvStandardDeviation = Math.sqrt(
  data.reduce((acc, { uv }) => (acc += (uv - uvMean) ** 2), 0) / data.length
);

const pvMean = data.reduce((acc, { pv }) => (acc += pv), 0) / data.length;
const pvStandardDeviation = Math.sqrt(
  data.reduce((acc, { pv }) => (acc += (pv - pvMean) ** 2), 0) / data.length
);

const {
  aboveRangeByInPercent: pvAboveStandartValueInPercent,
  belowStandartValueInPercent: pvBelowStandartValueInPercent,
} = calculateRangePercentages({
  max: Math.max(...data.map((i) => i.pv)),
  min: Math.min(...data.map((i) => i.pv)),
  mean: pvMean,
  standardDeviation: pvStandardDeviation,
});

const {
  aboveRangeByInPercent: uvAboveStandartValueInPercent,
  belowStandartValueInPercent: uvBelowStandartValueInPercent,
} = calculateRangePercentages({
  max: Math.max(...data.map((i) => i.uv)),
  min: Math.min(...data.map((i) => i.uv)),
  mean: uvMean,
  standardDeviation: uvStandardDeviation,
});

export default function App() {
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <LineChart data={data} margin={{ top: 20 }} accessibilityLayer>
        <defs>
          <LinearGradient
            id="pv"
            above={pvAboveStandartValueInPercent}
            below={pvBelowStandartValueInPercent}
          />
          <LinearGradient
            id="uv"
            above={uvAboveStandartValueInPercent}
            below={uvBelowStandartValueInPercent}
          />
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke={"url(#pvSplitColor)"}
          dot={({ cx, cy, value }) => {
            return Dot({
              cx: cx,
              cy: cy,
              value: value,
              mean: pvMean,
              standardDeviation: pvStandardDeviation,
            });
          }}
        ></Line>
        <Line
          type="monotone"
          dataKey="uv"
          stroke={"url(#uvSplitColor)"}
          dot={({ cx, cy, value }) => {
            return Dot({
              cx: cx,
              cy: cy,
              value: value,
              mean: uvMean,
              standardDeviation: uvStandardDeviation,
            });
          }}
        ></Line>
      </LineChart>
    </ResponsiveContainer>
  );
}

const LinearGradient = ({
  id,
  above,
  below,
}: {
  id: string;
  above: number;
  below: number;
}) => {
  return (
    <linearGradient key={id} id={id + "SplitColor"} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="red" />
      <stop offset={above + "%"} stopColor="red" />
      <stop offset={above + "%"} stopColor="green" />
      <stop offset={100 - below + "%"} stopColor="green" />
      <stop offset={100 - below + "%"} stopColor="red" />
      <stop offset={"100%"} stopColor="red" />
    </linearGradient>
  );
};

const Dot = ({
  cx,
  cy,
  value,
  mean,
  standardDeviation,
}: {
  cx: any;
  cy: any;
  value: any;
  mean: number;
  standardDeviation: number;
}) => {
  const color =
    value > mean + standardDeviation || value < mean - standardDeviation
      ? "red"
      : "green";
  return (
    <circle key={cx + cy} cx={cx} cy={cy} r={5} fill={color} stroke={color} />
  );
};
