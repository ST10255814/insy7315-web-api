// Activity color mapping based on action types
export const getActivityColor = (action) => {
  const colorMap = {
    // Properties - Orange
    'Create Listing': {
      color: '#F97316', // orange-500
      bgColor: 'rgba(249, 115, 22, 0.1)'
    },
    'Update Listing': {
      color: '#F97316', // orange-500
      bgColor: 'rgba(249, 115, 22, 0.1)'
    },
    'Delete Listing': {
      color: '#F97316', // orange-500
      bgColor: 'rgba(249, 115, 22, 0.1)'
    },
    'Property Added': {
      color: '#F97316', // orange-500
      bgColor: 'rgba(249, 115, 22, 0.1)'
    },
    'Property Updated': {
      color: '#F97316', // orange-500
      bgColor: 'rgba(249, 115, 22, 0.1)'
    },
    
    // Maintenance - Blue
    'Create Maintenance': {
      color: '#3B82F6', // blue-500
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    'Update Maintenance': {
      color: '#3B82F6', // blue-500
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    'Complete Maintenance': {
      color: '#3B82F6', // blue-500
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    'Submit Maintenance Request': {
      color: '#3B82F6', // blue-500
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    
    // Invoices - Green
    'Create Invoice': {
      color: '#22C55E', // green-500
      bgColor: 'rgba(34, 197, 94, 0.1)'
    },
    'Pay Invoice': {
      color: '#22C55E', // green-500
      bgColor: 'rgba(34, 197, 94, 0.1)'
    },
    'Update Invoice': {
      color: '#22C55E', // green-500
      bgColor: 'rgba(34, 197, 94, 0.1)'
    },
    
    // Leases - Purple
    'Create Lease': {
      color: '#A855F7', // purple-500
      bgColor: 'rgba(168, 85, 247, 0.1)'
    },
    'Update Lease': {
      color: '#A855F7', // purple-500
      bgColor: 'rgba(168, 85, 247, 0.1)'
    },
    'Sign Lease': {
      color: '#A855F7', // purple-500
      bgColor: 'rgba(168, 85, 247, 0.1)'
    },
    'Terminate Lease': {
      color: '#A855F7', // purple-500
      bgColor: 'rgba(168, 85, 247, 0.1)'
    },
    
    // Bookings - Cyan
    'Create Booking': {
      color: '#06B6D4', // cyan-500
      bgColor: 'rgba(6, 182, 212, 0.1)'
    },
    'Update Booking': {
      color: '#06B6D4', // cyan-500
      bgColor: 'rgba(6, 182, 212, 0.1)'
    },
    'Cancel Booking': {
      color: '#06B6D4', // cyan-500
      bgColor: 'rgba(6, 182, 212, 0.1)'
    },
    
    // User activities - Gray (default)
    'User Login': {
      color: '#42ebdf',
      bgColor: 'rgba(66, 235, 223, 0.1)'
    },
    'User Logout': {
      color: '#42ebdf',
      bgColor: 'rgba(66, 235, 223, 0.1)'
    }
  };

  // Return specific color if action is found, otherwise return default gray
  return colorMap[action] || {
    color: '#6B7280', // gray-500
    bgColor: 'rgba(107, 114, 128, 0.1)'
  };
};

// Format activity timestamp to relative time
export const formatActivityTime = (timestamp) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMs = now - activityTime;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  } else {
    return activityTime.toLocaleDateString();
  }
};