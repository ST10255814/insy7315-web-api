import { FaPlusCircle } from "react-icons/fa";
import { 
  ModalContainer, 
  ModalHeader, 
  ModalForm, 
  ModalButtons, 
  ModalFormField 
} from "../components/modals/index.js";

export default function AddLeaseModal({
  show,
  onClose,
  onSubmit,
  isPending,
  formData,
  setFormData,
}) {
  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      errors: { ...formData.errors, [e.target.name]: false },
    });

  return (
    <ModalContainer 
      show={show} 
      onClose={onClose} 
      size="md" 
      maxHeight="mobile-safe"
    >
      <ModalHeader
        title="Add New Lease"
        description="Create a lease from an existing booking"
        onClose={onClose}
        icon={FaPlusCircle}
      />
      
      <ModalForm onSubmit={onSubmit}>
        <ModalFormField
          label="Booking ID"
          name="bookingID"
          value={formData.bookingID}
          onChange={handleChange}
          placeholder="Enter Booking ID"
          error={formData.errors.isBookingId && !formData.bookingID ? "Booking ID is required" : ""}
          required
        />
      </ModalForm>
      
      <ModalButtons
        primaryAction={{
          label: "Add Lease",
          icon: FaPlusCircle,
          type: "submit"
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: onClose
        }}
        isPending={isPending}
      />
    </ModalContainer>
  );
}
