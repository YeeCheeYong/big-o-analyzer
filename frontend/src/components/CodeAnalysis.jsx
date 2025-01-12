import React, { useState } from 'react';
import api from "../api.js";
import AnalyzeCodeForm from './AnalyzeCodeForm';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CodeAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [bigOData, setBigOData] = useState({ labels: [], data: [] }); // Graph data

  const analyzeCode = async (codeSnippet) => {
    try {
      const response = await api.post('/analyze', { snippet: codeSnippet });
      const result = response.data;
      setAnalysisResult(result);

      // Generate graph data based on Big-O complexity
      const nValues = Array.from({ length: 10 }, (_, i) => i + 1); // Input sizes (n = 1 to 10)
      let yValues = [];

      switch (result.big_o) {
        case 'O(1)':
          yValues = nValues.map(() => 1); // Constant time
          break;
        case 'O(log n)':
          yValues = nValues.map((n) => Math.log(n)); // Logarithmic time
          break;
        case 'O(n)':
          yValues = nValues; // Linear time
          break;
        case 'O(n log n)':
          yValues = nValues.map((n) => n * Math.log(n)); // Log-linear time
          break;
        case 'O(n^2)':
          yValues = nValues.map((n) => n ** 2); // Quadratic time
          break;
        default:
          yValues = []; // Unknown complexity
      }

      setBigOData({
        labels: nValues.map((n) => `n=${n}`),
        data: yValues,
      });
    } catch (error) {
      console.error("Error analyzing code", error);
    }
  };

  // Prepare data for the Line chart
  const chartData = {
    labels: bigOData.labels,
    datasets: [
      {
        label: 'Big-O Growth',
        data: bigOData.data,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h2>Code Analysis</h2>
      <AnalyzeCodeForm analyzeCode={analyzeCode} />

      {analysisResult && (
        <div>
          <h3>Analysis Result</h3>
          <p><strong>Big-O:</strong> {analysisResult.big_o}</p>
          <p><strong>Explanation:</strong> {analysisResult.explanation}</p>
        </div>
      )}

      {bigOData.data.length > 0 && (
        <div>
          <h3>Big-O Complexity Graph</h3>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default CodeAnalysis;
