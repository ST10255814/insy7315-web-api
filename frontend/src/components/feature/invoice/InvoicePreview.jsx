import { statusClasses } from "../../../constants/constants.js";

/**
 * Professional Invoice Preview Component
 * Displays a formatted invoice document with tenant, property, and payment details
 * 
 * @param {Object} props
 * @param {Object} props.selectedLease - The selected lease object with tenant and property info
 * @param {Object} props.formData - Form data containing amount and date
 * @param {string} props.formData.amount - Invoice amount
 * @param {string} props.formData.date - Due date
 */
export default function InvoicePreview({ selectedLease, formData }) {
  return (
      <div className="border-2 border-blue-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50/30 to-white">
        {/* Invoice Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-1">INVOICE</h3>
              <p className="text-blue-100 text-sm">RentWise Property Management</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-blue-100 mb-1">Invoice #</p>
                <p className="text-lg font-bold">{formData.invoiceId || `INV-${new Date().getFullYear()}-XXXX`}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6 space-y-6">
          {/* Date Information */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Issue Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Due Date</p>
              <p className={`text-sm font-medium ${formData.date ? 'text-blue-700' : 'text-gray-400'}`}>
                {formData.date
                  ? new Date(formData.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Not specified'}
              </p>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Bill To</p>
              <div className="space-y-1">
                <p className={`font-semibold ${selectedLease ? 'text-gray-900' : 'text-gray-400'}`}>
                  {selectedLease
                    ? `${selectedLease.tenant?.firstName || ''} ${selectedLease.tenant?.surname || ''}`.trim() || 'Tenant Name'
                    : 'Select a lease to view tenant'}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedLease?.tenant?.email || 'tenant@email.com'}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 uppercase font-semibold mb-2">Property Details</p>
              <div className="space-y-1">
                <p className={`font-semibold ${selectedLease ? 'text-gray-900' : 'text-gray-400'}`}>
                  {selectedLease?.listing?.address || 'Property Address'}
                </p>
                <p className="text-sm text-gray-600">
                  Lease ID: {selectedLease?.leaseId || 'N/A'}
                </p>
                <p className={`text-xs font-medium inline-block px-2 py-1 rounded ${statusClasses[selectedLease?.status] || 'bg-gray-100 text-gray-500'}`}>
                  {selectedLease?.status?.toUpperCase() || 'STATUS'}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase">Description</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-700 uppercase">Period</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-700 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">Monthly Rent</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedLease?.listing?.address || 'Property rental fee'}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-gray-600">
                    {formData.date 
                      ? new Date(formData.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : 'Current month'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`font-semibold ${formData.amount ? 'text-gray-900' : 'text-gray-400'}`}>
                      R {formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}
                    </span>
                  </td>
                </tr>
                {/* Additional fees placeholder */}
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-500 italic">Additional fees (if any)</p>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400">-</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400">R 0.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700 font-semibold mb-1">Total Amount Due</p>
                <p className="text-xs text-blue-600">Payment required by due date</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${formData.amount ? 'text-blue-700' : 'text-gray-400'}`}>
                  R {formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Payment Instructions</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Please make payment to the account details provided in your lease agreement. 
              Include your lease ID ({selectedLease?.leaseId || 'XXXXX'}) as payment reference.
            </p>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Thank you for your payment • Questions? Contact your property manager
            </p>
          </div>
        </div>
      </div>
  );
}
