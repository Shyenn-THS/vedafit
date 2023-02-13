import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  lable: string;
  ci: number;
  ri: number;
};

export default function PieChart(props: Props) {
  const { lable, ci, ri } = props;
  const data = {
    labels: ['Current Intake', 'Required Intake'],
    datasets: [
      {
        label: lable,
        data: [ci, ri],
        backgroundColor: ['#880808', '#22BC22'],
      },
    ],
  };

  return <Pie data={data} width={300} height={300} />;
}
