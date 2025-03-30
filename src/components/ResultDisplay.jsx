import React from 'react';

function ResultDisplay({ result }) {
  if (!result) return null;

  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">Analysis Result</h3>
      <div className="mt-2">
        <p>Prediction: {result.prediction === 1 ? 'Spam' : 'Not Spam'}</p>
        <p>Probability: {(result.probability * 100).toFixed(2)}%</p>
      </div>
    </div>
  );
}

export default ResultDisplay;