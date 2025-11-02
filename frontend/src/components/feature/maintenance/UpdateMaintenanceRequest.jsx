import React, { useState } from "react";
import { TabWrapper, FormField, FormInput } from "../../common";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function UpdateMaintenanceRequest({ onUpdate }) {
  const [followUps, setFollowUps] = useState(0);
  const [caretakerNotes, setCaretakerNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { userId, maintenanceId } = useParams();

  const handleUpdate = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Call parent handler or API
    if (onUpdate) onUpdate({ followUps, caretakerNotes });
    // Simulate API delay
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <TabWrapper decorativeElements="default">
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back to requests
      </button>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-lg w-full bg-white p-5 rounded-2xl shadow-2xl border border-blue-100 relative">
          <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 opacity-70" />
          <div className="flex flex-col items-center mb-3 mt-2">
            <h2 className="text-2xl font-bold text-center text-blue-700 tracking-tight drop-shadow-sm">
              Update Maintenance Request
            </h2>
            <p className="text-base text-blue-500 text-center mt-1 mb-2 font-medium">
              Update details for request ID:{" "}{maintenanceId}
            </p>
          </div>
          <div className="mb-3">
            <hr className="border-blue-100" />
          </div>
          <form onSubmit={handleUpdate} className="space-y-4">
            <FormField label="No of Follow-Ups">
              <FormInput
                type="number"
                name="followUps"
                min={0}
                value={followUps}
                onChange={(e) => setFollowUps(e.target.value)}
                placeholder="Number of follow-ups..."
                hasError={false}
              />
            </FormField>
            <FormField label="Caretaker Notes">
              <FormInput
                type="textarea"
                name="caretakerNotes"
                value={caretakerNotes}
                onChange={(e) => setCaretakerNotes(e.target.value)}
                placeholder="Add any notes from the caretaker..."
                hasError={false}
                rows={4}
                className="resize-none"
              />
            </FormField>
            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-lg text-white font-semibold text-base shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2 ${
                submitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:brightness-110 hover:shadow-lg"
              }`}
              disabled={submitting}
            >
              {submitting ? (
                <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
              ) : null}
              {submitting ? "Updating..." : "Update Request"}
            </button>
          </form>
        </div>
      </div>
    </TabWrapper>
  );
}
