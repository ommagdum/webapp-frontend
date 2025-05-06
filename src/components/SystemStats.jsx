import React, { useState, useEffect } from 'react';
import {adminService} from '../services/adminService';

const SystemStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getSystemStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Loading stats...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">System Statistics</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow p-4">
          <h2 className="font-medium">Total Users</h2>
          <p className="text-xl mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white shadow p-4">
          <h2 className="font-medium">Total Predictions</h2>
          <p className="text-xl mt-2">{stats.totalPredictions}</p>
        </div>
        <div className="bg-white shadow p-4">
          <h2 className="font-medium">Total Feedback</h2>
          <p className="text-xl mt-2">{stats.totalFeedback}</p>
        </div>
      </div>
      {/* TODO: Add charts for trends */}
    </div>
  );
};

export default SystemStats;
