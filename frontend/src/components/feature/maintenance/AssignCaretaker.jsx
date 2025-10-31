import React, { useState } from "react";
import { TabWrapper } from "../../common";
import { FaHardHat, FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

// Example caretakers list, replace with API data as needed
const caretakers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Alex Johnson" },
];

export default function AssignCaretaker() {
  const [selectedCaretaker, setSelectedCaretaker] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { userId, maintenanceId } = useParams();
  const navigate = useNavigate();

  const handleAssign = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <TabWrapper decorativeElements="default">
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
        onClick={() => navigate(`/dashboard/${userId}/maintenance`)}
      >
        <FaArrowLeft /> Back to requests
      </button>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md w-full bg-white p-5 rounded-2xl shadow-2xl border border-blue-100 relative">
          <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 opacity-70" />
          <div className="flex flex-col items-center mb-3 mt-2">
            <span className="bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 text-blue-700 rounded-full p-3 mb-2 shadow-md border border-blue-200">
              <FaHardHat size={30} />
            </span>
            <h2 className="text-2xl font-bold text-center text-blue-700 tracking-tight drop-shadow-sm">
              Assign Caretaker
            </h2>
            <p className="text-base text-blue-500 text-center mt-1 mb-2 font-medium">
              Select a caretaker to manage request ID: {maintenanceId}
            </p>
          </div>
          <div className="mb-3">
            <hr className="border-blue-100" />
          </div>
          <form onSubmit={handleAssign} className="space-y-3">
            <div>
              <label
                htmlFor="caretaker"
                className="block text-base font-semibold text-blue-700 mb-2"
              >
                Select Caretaker
              </label>
              <div
                className="relative"
                tabIndex={0}
                onBlur={() => setDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="w-full border border-blue-300 rounded-lg py-2 px-3 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 font-medium transition-all duration-200 hover:border-blue-400 hover:shadow-md flex items-center justify-between"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <span>
                    {selectedCaretaker
                      ? caretakers.find((c) => c.id === selectedCaretaker)?.name
                      : "Choose a Caretaker"}
                  </span>
                  <FaChevronDown
                    className={`ml-2 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 right-0 z-20 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-fade-in">
                    {caretakers.map((caretaker) => (
                      <button
                        type="button"
                        key={caretaker.id}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-blue-700 font-medium ${
                          selectedCaretaker === caretaker.id ? "bg-blue-100" : ""
                        }`}
                        onClick={() => {
                          setSelectedCaretaker(caretaker.id);
                          setDropdownOpen(false);
                        }}
                      >
                        {caretaker.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold text-base shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                submitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:brightness-110 hover:shadow-lg"
              }`}
            >
              {submitting ? (
                <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
              ) : null}
              {submitting ? "Assigning..." : "Assign Caretaker"}
            </button>
          </form>
        </div>
      </div>
    </TabWrapper>
  );
}
