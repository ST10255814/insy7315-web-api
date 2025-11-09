import { statusClasses } from "../../../constants/constants.js";
import { formatDateUS } from "../../../utils/formatters.js";
import { FaFileContract, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaDollarSign, FaClock } from "react-icons/fa";

export default function LeaseDocument({ lease }) {
  const calculateLeaseDuration = () => {
    if (!lease?.bookingDetails?.startDate || !lease?.bookingDetails?.endDate) {
      return 'Not specified';
    }
    
    try {
      // Parse DD-MM-YYYY format correctly
      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('-');
        // Create date with month-1 since months are 0-indexed in JavaScript
        return new Date(year, month - 1, day);
      };
      
      const start = parseDate(lease.bookingDetails.startDate);
      const end = parseDate(lease.bookingDetails.endDate);
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid dates:', { 
          startDate: lease.bookingDetails.startDate, 
          endDate: lease.bookingDetails.endDate 
        });
        return 'Invalid dates';
      }
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Handle edge case where dates are the same
      if (diffDays === 0) {
        return '1 day';
      }
      
      if (diffDays < 30) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
      } else if (diffDays < 365) {
        const months = Math.round(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''}`;
      } else {
        const years = Math.round(diffDays / 365);
        return `${years} year${years > 1 ? 's' : ''}`;
      }
    } catch (error) {
      console.error('Error calculating lease duration:', error);
      return 'Error calculating duration';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
      {/* Professional Lease Document Layout */}
      <div className="border-2 border-blue-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50/30 to-white">
        {/* Lease Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-3">
                <FaFileContract className="w-6 h-6" />
                LEASE AGREEMENT
              </h3>
              <p className="text-blue-100 text-sm">RentWise Property Management</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-blue-100 mb-1">Lease ID</p>
                <p className="text-lg font-bold">{lease.leaseId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lease Body */}
        <div className="p-6 space-y-6">
          {/* Status and Dates Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2 flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                Status
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusClasses[lease?.status] || 'bg-gray-100 text-gray-500'}`}>
                {lease?.status?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Created Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateUS(lease.leaseCreatedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateUS(lease.lastStatusUpdate)}
              </p>
            </div>
          </div>

          {/* Tenant and Property Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 uppercase font-semibold mb-3 flex items-center gap-1">
                <FaUser className="w-3 h-3" />
                Tenant Information
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">
                  {lease.tenant?.firstName} {lease.tenant?.surname}
                </p>
                <p className="text-sm text-gray-600">
                  {lease.tenant?.email}
                </p>
                <p className="text-xs text-gray-500">
                  Tenant ID: {lease.tenant?.userId}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-700 uppercase font-semibold mb-3 flex items-center gap-1">
                <FaMapMarkerAlt className="w-3 h-3" />
                Property Details
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">
                  {lease.listing?.address}
                </p>
                <p className="text-sm text-gray-600">
                  Listing ID: {lease.listing?.listingId}
                </p>
              </div>
            </div>
          </div>

          {/* Lease Terms Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                <FaCalendarAlt className="w-4 h-4" />
                Lease Terms & Conditions
              </h3>
            </div>
            <div className="bg-white p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Booking Reference</p>
                  <p className="font-medium text-gray-900">{lease.bookingDetails?.bookingId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Lease Duration</p>
                  <p className="font-medium text-gray-900">{calculateLeaseDuration()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Start Date</p>
                  <p className="font-medium text-gray-900">{formatDateUS(lease.bookingDetails?.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">End Date</p>
                  <p className="font-medium text-gray-900">{formatDateUS(lease.bookingDetails?.endDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Amount Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700 font-semibold mb-1 flex items-center gap-2">
                  <FaDollarSign className="w-4 h-4" />
                  Monthly Rental Amount
                </p>
                <p className="text-xs text-blue-600">As per lease agreement</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-700">
                  R {lease.bookingDetails?.rentAmount?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-blue-600">per month</p>
              </div>
            </div>
          </div>

          {/* Administrative Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Administrative Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Admin ID:</span> {lease.adminId}
              </div>
              <div>
                <span className="font-medium">Document ID:</span> {lease._id}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              This document contains confidential lease information • For questions contact property management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
