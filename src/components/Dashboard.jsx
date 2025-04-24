import { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { predictionService, statsService } from '../services/api';
import { useLocation } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false
    }
  }
};

const Dashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const refreshParam = queryParams.get('refresh');

  // Stats state
  const [stats, setStats] = useState({
    totalChecks: 0,
    spamDetected: 0,
    hamDetected: 0,
    accuracy: 0,
    dailyCounts: []
  });
  
  // History state
  const [history, setHistory] = useState({
    content: [],
    page: 0,
    totalPages: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(refreshParam ? 'history' : 'overview');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  
  // New state for detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // New state for search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'spam', 'ham'

  // Separate fetchHistory function to be called from multiple places
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await predictionService.getHistory(currentPage, pageSize);
      console.log('History data:', data);
      setHistory(data || { content: [], page: 0, totalPages: 0 });
      setLoading(false);
    } catch (err) {
      console.error('History load failed:', err);
      setError('Failed to load prediction history');
      setLoading(false);
    }
  }, [currentPage, pageSize]);
  
  // Separate fetchStats function to be called from multiple places
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await statsService.fetchStats();
      
      setStats({
        totalChecks: response.totalChecks || 0,
        spamDetected: response.spamDetected || 0,
        hamDetected: response.hamDetected || 0,
        accuracy: response.accuracy || 0,
        dailyCounts: response.dailyCounts || []
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, []);

  // Consolidate refresh logic into a single useEffect with URL parameter-based refresh
  useEffect(() => {
    // Always fetch fresh data when the component mounts
    fetchHistory();
    fetchStats();
    
    // Check for URL refresh parameter and set active tab if present
    // This is triggered when navigating from HomePage after analyzing an email
    if (refreshParam) {
      setActiveTab('history');
    }
    
    // Set up a refresh interval for real-time updates
    const refreshInterval = setInterval(() => {
      if (activeTab === 'history') {
        fetchHistory();
      }
      fetchStats();
    }, 5000); // Refresh every 5 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [fetchHistory, fetchStats, activeTab, refreshParam]);

  // Chart data configurations
  const pieData = {
    labels: ['Spam', 'Ham'],
    datasets: [{
      data: [stats.spamDetected, stats.hamDetected],
      backgroundColor: ['#8b5cf6', '#4ade80'],
      borderWidth: 0,
    }],
  };

  const lineData = {
    labels: stats.dailyCounts.map(d => d.date),
    datasets: [{
      label: 'Daily Checks',
      data: stats.dailyCounts.map(d => d.count),
      borderColor: '#8b5cf6',
      tension: 0.4,
    }]
  };

  // Filter history based on search term and filter type
  const filteredHistory = history.content && Array.isArray(history.content) 
    ? history.content.filter(item => {
        // Safely check content snippet
        const content = item.contentSnippet ?? item.content ?? item.data?.contentSnippet ?? item.data?.content ?? item.email ?? '';
        
        const matchesSearch = !searchTerm || 
          content.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Check if the item has high confidence (likely spam)
        const highConfidence = (item.confidence || item.probability || 0) > 0.7;
        
        // Determine if the item is spam based on multiple indicators
        const isSpam = item.spam === true || 
                       (typeof item.spam === 'string' && item.spam.toLowerCase() === 'true') ||
                       item.prediction === 1 ||
                       (highConfidence && content && 
                        (content.toLowerCase().includes('free') || 
                         content.toLowerCase().includes('click') ||
                         content.toLowerCase().includes('money')));
        
        const matchesFilter = 
          filterType === 'all' || 
          (filterType === 'spam' && isSpam) || 
          (filterType === 'ham' && !isSpam);
        
        return matchesSearch && matchesFilter;
      })
    : [];

  // Format date with time - handle different date formats
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date';
    }
  };

  // Open detail modal
  const openDetailModal = (item) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  // Tab navigation
  const renderTabs = () => (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-1 ${activeTab === 'overview' 
            ? 'border-purple-500 text-purple-600 border-b-2' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-4 px-1 ${activeTab === 'history' 
            ? 'border-purple-500 text-purple-600 border-b-2' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          History
        </button>
      </nav>
    </div>
  );

  // Stats overview
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Checks</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalChecks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Spam Detected</h3>
          <p className="text-3xl font-bold mt-2 text-purple-600">{stats.spamDetected}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Spam/Ham Distribution</h3>
          <div className="h-64">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">7-Day Activity</h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );

  // Prediction history
  const renderHistory = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in content..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Predictions</option>
            <option value="spam">Spam Only</option>
            <option value="ham">Ham Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Content Preview</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Result</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Confidence</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  {loading ? 'Loading...' : 'No prediction history found'}
                </td>
              </tr>
            ) : filteredHistory.map((item) => {
              const id = item.id || `item-${Math.random()}`;
              
              // Extract the original email content that was analyzed
              const emailContent = 
                // Try to get content from contentSnippet field (as shown in logs)
                item.contentSnippet ||
                // Try to get content directly from the item
                item.content || 
                // Try to get content from the originalContent field
                item.originalContent ||
                // Try to get content from nested data structure
                (item.data && (item.data.contentSnippet || item.data.content || item.data.originalContent)) ||
                // Try to get from email field
                item.email || 
                // If item itself is a string, use it
                (typeof item === 'string' ? item : '');
              
              // Log item structure to debug
              console.log('History item structure:', item);
              console.log('Spam field value:', item.spam, 'Type:', typeof item.spam);
              console.log('Prediction value:', item.prediction, 'Type:', typeof item.prediction);
              
              // Check if the item has high confidence (likely spam)
              const highConfidence = (item.confidence || item.probability || 0) > 0.7;
              
              // Determine if the item is spam based on multiple indicators
              // 1. Direct spam flag
              // 2. Prediction value of 1 (API response format)
              // 3. High confidence with spam keywords
              const isSpam = item.spam === true || 
                             (typeof item.spam === 'string' && item.spam.toLowerCase() === 'true') ||
                             item.prediction === 1 ||
                             (highConfidence && item.contentSnippet && 
                              (item.contentSnippet.toLowerCase().includes('free') || 
                               item.contentSnippet.toLowerCase().includes('click') ||
                               item.contentSnippet.toLowerCase().includes('money')));
              
              // Get confidence value
              const probability = item.data?.probability ?? item.probability ?? item.confidence ?? item.score ?? 0;
              const confidence = probability * 100;
              
              // Create a snippet from the content
              const snippet = emailContent ? 
                (emailContent.length > 100 ? emailContent.slice(0,100) + '...' : emailContent) : 
                'No content available';
                
              const timestamp = item.timestamp || item.date || item.createdAt || new Date();

              return (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm max-w-[200px] truncate">{snippet}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isSpam ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {isSpam ? 'Spam' : 'Ham'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{confidence.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm">{formatDateTime(timestamp)}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => openDetailModal(item)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredHistory.length > 0 && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {(history.page || currentPage) + 1} of {Math.max(1, history.totalPages || 1)}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min((history.totalPages || 1) - 1, p + 1))}
            disabled={currentPage >= (history.totalPages || 1) - 1}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  // Detail Modal
  const renderDetailModal = () => {
    if (!detailModalOpen || !selectedItem) return null;

    // Log the selected item to debug
    console.log('Detail modal item:', selectedItem);
    console.log('Spam field value in modal:', selectedItem.spam, 'Type:', typeof selectedItem.spam);
    console.log('Prediction value in modal:', selectedItem.prediction, 'Type:', typeof selectedItem.prediction);
    
    // Extract the original email content that was analyzed
    const emailContentFull = 
      // Try to get content from contentSnippet field (as shown in logs)
      selectedItem.contentSnippet ||
      // Try to get content directly from the item
      selectedItem.content || 
      // Try to get content from the originalContent field
      selectedItem.originalContent ||
      // Try to get content from nested data structure
      (selectedItem.data && (selectedItem.data.contentSnippet || selectedItem.data.content || selectedItem.data.originalContent)) ||
      // Try to get from email field
      selectedItem.email || 
      // If item itself is a string, use it
      (typeof selectedItem === 'string' ? selectedItem : '');
      
    // Check if the item has high confidence (likely spam)
    const highConfidenceFull = (selectedItem.confidence || selectedItem.probability || 0) > 0.7;
    
    // Determine if the item is spam based on multiple indicators
    // 1. Direct spam flag
    // 2. Prediction value of 1 (API response format)
    // 3. High confidence with spam keywords
    const isSpamFull = selectedItem.spam === true || 
                       (typeof selectedItem.spam === 'string' && selectedItem.spam.toLowerCase() === 'true') ||
                       selectedItem.prediction === 1 ||
                       (highConfidenceFull && selectedItem.contentSnippet && 
                        (selectedItem.contentSnippet.toLowerCase().includes('free') || 
                         selectedItem.contentSnippet.toLowerCase().includes('click') ||
                         selectedItem.contentSnippet.toLowerCase().includes('money')));
    
    const probabilityFull = selectedItem.data?.probability ?? selectedItem.probability ?? selectedItem.confidence ?? selectedItem.score ?? 0;
    const confidenceFull = probabilityFull * 100;
    const timestamp = selectedItem.timestamp || selectedItem.date || selectedItem.createdAt || new Date();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">Email Details</h3>
              <button 
                onClick={() => setDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Classification:</span>
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${isSpamFull ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                  {isSpamFull ? 'Spam' : 'Ham'}
                </span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Confidence:</span>
                <span className="ml-2">{confidenceFull.toFixed(1)}%</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Date:</span>
                <span className="ml-2">{formatDateTime(timestamp)}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Content:</span>
                <div className="mt-2 p-4 bg-gray-50 whitespace-pre-wrap overflow-auto max-h-[80vh] rounded-lg">
                  {emailContentFull || 'No content available'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
            <button
              onClick={() => setDetailModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Spam Detection Dashboard</h1>
        
        {renderTabs()}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="mt-6">
            {activeTab === 'overview' ? renderOverview() : renderHistory()}
          </div>
        )}
      </div>
      
      {renderDetailModal()}
    </div>
  );
};

export default Dashboard;