import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    <h1 className="text-4xl font-bold mb-4 text-red-600">Unauthorized</h1>
    <p className="text-lg mb-6">You do not have permission to access this page.</p>
    <div className="space-x-4">
      <Link
        to="/dashboard"
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Go to Dashboard
      </Link>
      <Link
        to="/home"
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
      >
        Go to Home
      </Link>
    </div>
  </div>
);

export default UnauthorizedPage;
