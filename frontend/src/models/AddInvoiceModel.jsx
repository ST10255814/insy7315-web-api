import { useState, useEffect, useCallback } from "react";
import { FaPlusCircle } from "react-icons/fa";
import Toast from "../lib/toast";
import { 
  ModalContainer, 
  ModalHeader, 
  ModalForm, 
  ModalButtons, 
  ModalFormField 
} from "../components/modals/index.js";

// Initial form state - defined outside component to avoid re-creation
const INITIAL_FORM_STATE = {
  amount: "",
  date: "",
  leaseId: "",
};

export default function AddInvoiceModal({ show, onClose, onSubmit, isPending }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  // Reset form function - memoized to prevent unnecessary re-renders
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  }, []);

  // Reset form when modal is closed
  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show, resetForm]);

  // Handle close action
  const handleClose = () => {
    onClose();
  };
  // Reset form when submission completes
  const [wasPending, setWasPending] = useState(false);
  useEffect(() => {
    if (wasPending && !isPending) {
      // Submission finished, reset form
      resetForm();
    }
    setWasPending(isPending);
  }, [isPending, wasPending, resetForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Amount is required and must be greater than 0";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.leaseId) newErrors.leaseId = "Lease ID is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toast.error("Please fix the errors before submitting!");
      return;
    }

    // Submit the form - reset will be handled automatically when isPending changes
    if (onSubmit) onSubmit(formData);
  };

  return (
    <ModalContainer 
      show={show} 
      onClose={handleClose} 
      size="md" 
      maxHeight="mobile-safe"
    >
      <ModalHeader
        title="Add New Invoice"
        description="Create an invoice for an existing lease"
        onClose={handleClose}
        icon={FaPlusCircle}
      />
      
      <ModalForm onSubmit={handleSubmit}>
        <ModalFormField
          label="Lease ID"
          name="leaseId"
          value={formData.leaseId}
          onChange={handleChange}
          placeholder="Enter Lease ID"
          error={errors.leaseId}
          required
        />
        
        <ModalFormField
          label="Amount (R)"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter Amount"
          error={errors.amount}
          required
        />
        
        <ModalFormField
          label="Due Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />
      </ModalForm>
      
      <ModalButtons
        primaryAction={{
          label: "Add Invoice",
          icon: FaPlusCircle,
          type: "submit",
          onClick: handleSubmit
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: handleClose
        }}
        isPending={isPending}
      />
    </ModalContainer>
  );
}
