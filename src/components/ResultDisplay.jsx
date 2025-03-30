const ResultDisplay = ({ result }) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">Analysis Result</h3>
      <div className="space-y-2">
        <p className="text-lg">
          <span className="font-medium">Prediction: </span>
          <span className={result.prediction === 1 ? 'text-red-600' : 'text-green-600'}>
            {result.prediction === 1 ? 'Spam' : 'Not Spam'}
          </span>
        </p>
        <p className="text-lg">
          <span className="font-medium">Confidence: </span>
          <span>{(result.probability * 100).toFixed(2)}%</span>
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;