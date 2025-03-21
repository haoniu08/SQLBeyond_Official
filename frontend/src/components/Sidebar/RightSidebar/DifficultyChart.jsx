import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2"; // Use Line chart for smooth lines

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const DifficultyChart = ({ pointsData, idealPoints }) => {
  const difficulties = ["Easy", "Medium", "Hard"]; // Labels for x-axis

  // Function to add jitter to x-values only
  const addJitterToX = (points, jitterAmount = 0.3) => {
    return points.map((point) => ({
      x: point.x + (Math.random() * jitterAmount - jitterAmount / 2), // Add jitter to x only
      y: point.y, // Keep y fixed
    }));
  };

  // Prepare individual points for each difficulty
  const userPoints = [];
  difficulties.forEach((difficulty, index) => {
    const difficultyPoints = pointsData[difficulty.toLowerCase()] || [];
    difficultyPoints.forEach((point) => {
      userPoints.push({ x: index, y: point }); // Map difficulty to an x-index
    });
  });

  const jitteredUserPoints = addJitterToX(userPoints, 0.3); // Apply jitter to x-values only

  // Add boundary points to Ideal Points
  const extendedIdealPoints = [
    { x: -0.5, y: idealPoints[0] }, // Extend to the left
    ...idealPoints.map((point, index) => ({ x: index, y: point })), // Original points
    { x: difficulties.length - 0.5, y: idealPoints[idealPoints.length - 1] }, // Extend to the right
  ];

  const data = {
    labels: difficulties, // x-axis labels
    datasets: [
      {
        label: "Ideal Learning Curve", // Updated label for red line
        data: extendedIdealPoints, // Include extended points for edges
        borderColor: "red",
        borderWidth: 2,
        fill: false,
        pointRadius: 0, // Remove the dots
        tension: 0.2, // Smooth the line
        showLine: true, // Ensure the line is visible
      },
      {
        label: "User Points", // Updated label for blue points
        data: jitteredUserPoints, // Jittered user performance points
        backgroundColor: "blue", // Solid blue points
        borderColor: "blue", // Border matches point color
        borderWidth: 0,
        showLine: false,
        pointStyle: "circle",
        pointRadius: 6, // Slightly larger points
        pointHoverRadius: 8, // Larger points on hover
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true, // Use point style to match the chart
          pointStyle: (ctx) => {
            // Ensure appropriate styles for each dataset in the legend
            const datasetIndex = ctx.datasetIndex;
            return datasetIndex === 0 ? "line" : "circle"; // Red for line, blue for circle
          },
          generateLabels: (chart) => {
            // Custom legend labels for red and blue
            return chart.data.datasets.map((dataset, index) => ({
              text: dataset.label,
              fillStyle:
                index === 0
                  ? "red" // Red for "Ideal Learning Curve"
                  : "blue", // Blue for "User Points"
              hidden: !chart.isDatasetVisible(index),
              lineWidth: index === 0 ? 4 : 0, // Thicker line for the red legend
              strokeStyle: dataset.borderColor,
              pointStyle: index === 0 ? "line" : "circle",
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          title: () => "", // Remove the difficulty label from the tooltip
          label: (tooltipItem) => {
            return `Points: ${tooltipItem.parsed.y.toFixed(2)}`; // Only display the points
          },
        },
      },
    },
    scales: {
      y: {
        min: -10, // Keep space below 0
        max: Math.max(...idealPoints, ...userPoints.map((p) => p.y)) + 10, // Add space above points
        ticks: {
          callback: (value) => (value >= 0 ? value : ""), // Only show labels >= 0
          stepSize: 10, // Show labels at intervals of 10
        },
        grid: {
          drawTicks: false, // Remove tick lines
        },
        title: {
          display: true, // Keep y-label visible
          text: "Points",
        },
      },
      x: {
        type: "linear", // Use linear scale to map x-coordinates
        grid: {
          display: false, // Remove vertical grid lines
        },
        ticks: {
          callback: (value) => difficulties[value] || "", // Show only the difficulty labels
          align: "center", // Ensure labels are centered
          maxRotation: 0, // Prevent rotation
          minRotation: 0, // Prevent rotation
        },
        title: {
          display: false, // Remove x-axis title
        },
        min: -0.5, // Add space on the left of "Easy"
        max: difficulties.length - 0.5, // Add space on the right of "Hard"
      },
    },
  };

  return <Line data={data} options={options} />;
};

DifficultyChart.propTypes = {
  pointsData: PropTypes.shape({
    easy: PropTypes.arrayOf(PropTypes.number),
    medium: PropTypes.arrayOf(PropTypes.number),
    hard: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  idealPoints: PropTypes.arrayOf(PropTypes.number).isRequired, // Validate idealPoints
};

export default DifficultyChart;
