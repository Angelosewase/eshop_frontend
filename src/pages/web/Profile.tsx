import React from 'react';
import { useGetCurrentUserQuery } from '../../features/users/userSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/Reduxhooks';
import { logOut } from '../../features/auth/authSlice';

export default function Profile() {
  const { data: userData, error, isLoading } = useGetCurrentUserQuery();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    console.log('Current API Response:', {
      userData,
      dataKeys: userData ? Object.keys(userData) : []
    });
  }, [userData]);

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      navigate('/auth/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">Failed to load profile data.</span>
        </div>
      </div>
    );
  }

  if (!userData || !userData.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">No user data found. Please log in.</span>
          <button
            onClick={() => navigate('/auth/login')}
            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {userData.firstName} {userData.lastName}
                </h1>
                <p className="text-blue-100 mt-1">{userData.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-900">{userData.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="mt-1 text-gray-900">{userData.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Account Details</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account ID</label>
                    <p className="mt-1 text-gray-900">#{userData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account Type</label>
                    <p className="mt-1 text-gray-900">{userData.role === 'ADMIN' ? 'Administrator' : 'Customer'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/orders')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Orders
                </button>
                {userData.role === 'ADMIN' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center justify-center px-4 py-2 border border-blue-500 rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Go to Admin Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 