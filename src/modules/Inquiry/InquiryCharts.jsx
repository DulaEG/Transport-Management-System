import React from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Card, Typography } from "antd";
import { PieChartOutlined, BarChartOutlined } from "@ant-design/icons";

const { Title: AntTitle } = Typography;

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ChartCard = styled(Card)`
  width: 48%;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }

  .ant-card-head-title {
    display: flex;
    align-items: center;
  }

  .chart-icon {
    margin-right: 8px;
  }
`;

const TextSection = styled.div`
  width: 25%;
  margin-left: 16px;

  p {
    margin: 0;
    padding: 4px 0;
  }
`;

const InquiryCharts = ({ inquiries }) => {
  // Process data for Feedback Distribution by Type
  const typeCount = inquiries.reduce((acc, inquiry) => {
    acc[inquiry.type] = (acc[inquiry.type] || 0) + 1;
    return acc;
  }, {});

  const totalTypes = Object.values(typeCount).reduce(
    (sum, value) => sum + value,
    0
  );
  const typePercentages = Object.keys(typeCount).map((type) => ({
    label: type,
    percentage: ((typeCount[type] / totalTypes) * 100).toFixed(2),
  }));

  const typeData = {
    labels: Object.keys(typeCount),
    datasets: [
      {
        data: Object.values(typeCount),
        backgroundColor: ["#FF9999", "#66B2FF", "#FFCC99", "#99FF99"],
      },
    ],
  };

  // Process data for Feedback Distribution by Status
  const statusCount = inquiries.reduce((acc, inquiry) => {
    acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
    return acc;
  }, {});

  const totalStatuses = Object.values(statusCount).reduce(
    (sum, value) => sum + value,
    0
  );
  const statusPercentages = Object.keys(statusCount).map((status) => ({
    label: status,
    percentage: ((statusCount[status] / totalStatuses) * 100).toFixed(2),
  }));

  const statusData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: ["#FF9999", "#66B2FF", "#FFCC99"],
      },
    ],
  };

  return (
    <ChartContainer>
      <AntTitle level={2}>Customer Feedback Report</AntTitle>
      <ChartsWrapper>
        <ChartCard
          title={
            <>
              <PieChartOutlined className="chart-icon" />
              Feedback Distribution by Type
            </>
          }
        >
          <Pie data={typeData} />
          <TextSection>
            {typePercentages.map((item) => (
              <p key={item.label}>
                {item.label}: {item.percentage}%
              </p>
            ))}
          </TextSection>
        </ChartCard>

        <ChartCard
          title={
            <>
              <BarChartOutlined className="chart-icon" />
              Feedback Distribution by Status
            </>
          }
        >
          <Bar
            data={statusData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
          <TextSection>
            {statusPercentages.map((item) => (
              <p key={item.label}>
                {item.label}: {item.percentage}%
              </p>
            ))}
          </TextSection>
        </ChartCard>
      </ChartsWrapper>
    </ChartContainer>
  );
};

export default InquiryCharts;
