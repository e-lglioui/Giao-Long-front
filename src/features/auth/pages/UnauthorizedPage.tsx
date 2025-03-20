import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <div className="text-7xl mb-6">🚫</div>
        <p className="text-gray-700 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to={from}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 