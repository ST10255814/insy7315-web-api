import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { 
  ModalContainer, 
  ModalHeader, 
  ModalForm, 
  ModalButtons, 
  ModalFormField 
} from "../components/modals/index.js";

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "Expiring Soon": "bg-amber-100 text-amber-800",
  Expired: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

export default function EditLeaseModal({
  show,
  onClose,
  lease,
  onSubmit,
  isPending,
}) {
  const [editData, setEditData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (lease) {
      setEditData({
        tenantName: lease.tenant.firstName + " " + lease.tenant.surname || "",
        rent: lease.bookingDetails.rentAmount || "",
        property: lease.listing.address || "",
        startDate: lease.bookingDetails?.startDate?.slice(0, 10) || "",
        endDate: lease.bookingDetails?.endDate?.slice(0, 10) || "",
        status: lease.status || "",
      });
      setHasChanges(false);
    }
  }, [lease]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...editData, [name]: value };
    setEditData(updatedData);

    const changed =
      JSON.stringify(updatedData) !==
      JSON.stringify({
        tenantName: lease.tenant.fullname || "",
        rent: lease.bookingDetails.rentAmount || "",
        property: lease.listing.address || "",
        startDate: lease.bookingDetails?.startDate?.slice(0, 10) || "",
        endDate: lease.bookingDetails?.endDate?.slice(0, 10) || "",
        status: lease.status || "",
      });
    setHasChanges(changed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const changedFields = {};
    Object.keys(editData).forEach((key) => {
      const oldValue =
        key === "startDate" || key === "endDate"
          ? lease.bookingDetails?.[key]?.slice(0, 10)
          : key === "tenantName"
          ? lease.tenant.fullname
          : key === "property"
          ? lease.listing.address
          : key === "rent"
          ? lease.bookingDetails.rentAmount
          : lease[key];

      if (editData[key] !== oldValue) changedFields[key] = editData[key];
    });

    if (Object.keys(changedFields).length === 0) return;
    onSubmit({ ...changedFields });
  };

  if (!lease) return null;

  // Create status badge component
  const statusBadge = (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        statusColors[lease.status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {lease.status}
    </span>
  );

  return (
    <ModalContainer 
      show={show} 
      onClose={onClose} 
      size="lg" 
      maxHeight="mobile-safe"
    >
      <ModalHeader
        title={`Editing Lease: ${lease.leaseId}`}
        description="Update lease information and settings"
        onClose={onClose}
        icon={FaSave}
        statusBadge={statusBadge}
      />
      
      <ModalForm onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          <ModalFormField
            label="Tenant Name"
            name="tenantName"
            value={editData.tenantName}
            onChange={handleChange}
            disabled={true}
            className="lg:col-span-1"
          />
          
          <ModalFormField
            label="Property"
            name="property"
            value={editData.property}
            onChange={handleChange}
            disabled={true}
            className="lg:col-span-1"
          />
          
          <ModalFormField
            label="Monthly Rent (R)"
            name="rent"
            type="number"
            value={editData.rent}
            onChange={handleChange}
            className="lg:col-span-1"
          />
          
          <ModalFormField
            label="Status"
            name="status"
            type="select"
            value={editData.status}
            onChange={handleChange}
            className="lg:col-span-1"
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </ModalFormField>
          
          <ModalFormField
            label="Start Date"
            name="startDate"
            type="date"
            value={editData.startDate}
            onChange={handleChange}
            className="lg:col-span-1"
          />
          
          <ModalFormField
            label="End Date"
            name="endDate"
            type="date"
            value={editData.endDate}
            onChange={handleChange}
            className="lg:col-span-1"
          />
        </div>
      </ModalForm>
      
      <ModalButtons
        primaryAction={{
          label: "Save Changes",
          icon: FaSave,
          type: "submit"
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: onClose
        }}
        isPending={isPending}
        disabled={!hasChanges}
      />
    </ModalContainer>
  );
}
