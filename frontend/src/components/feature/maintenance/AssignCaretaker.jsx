import { useState, useEffect, useRef } from "react";
import { TabWrapper } from "../../common";
import { FaHardHat, FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaChevronDown, FaSpinner } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useCaretakersQuery, useAssignCaretakerMutation } from "../../../utils/queries";
import Toast from "../../../lib/toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AssignCaretaker() {
  const [selectedCaretaker, setSelectedCaretaker] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userId, maintenanceId } = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { data: caretakers = [], isLoading, isError } = useCaretakersQuery(userId);
  const assignCaretakerMutation = useAssignCaretakerMutation();

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  const handleAssign = async (e) => {
    e.preventDefault();
    
    if (!selectedCaretaker) {
      Toast.error("Please select a caretaker first");
      return;
    }
    assignCaretakerMutation.mutate(
      { caretakerId: selectedCaretaker, requestId: maintenanceId },
      {
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  };

  const selectedCaretakerData = selectedCaretaker ? caretakers.find(c => c.caretakerId === selectedCaretaker) : null;

  return (
    <TabWrapper decorativeElements="default">
      {/* Back Button */}
      <motion.button
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="w-5 h-5" /> 
        <span>Back to requests</span>
      </motion.button>

      {/* Main Content */}
      <div className="flex min-h-[70vh] items-center justify-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30 relative"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-t-3xl" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8 relative">
            <motion.div
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-4 mb-4 shadow-lg"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaHardHat size={32} />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Assign Caretaker
            </h2>
            <p className="text-gray-600 text-center leading-relaxed">
              Select a qualified caretaker to manage
              <br />
              <span className="font-semibold text-blue-600">Request ID: {maintenanceId}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAssign} className="space-y-6 relative">
            {/* Caretaker Selection */}
            <div className="relative z-50">
              <label className="block text-sm font-semibold text-blue-700 mb-3">
                Select Caretaker
              </label>
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  type="button"
                  className={`w-full border-2 rounded-xl py-4 px-4 bg-white/80 backdrop-blur-sm shadow-md focus:outline-none text-left transition-all duration-300 flex items-center justify-between ${
                    isLoading
                      ? "border-gray-300"
                      : dropdownOpen
                      ? "border-blue-500 ring-4 ring-blue-500/20"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => !isLoading && setDropdownOpen(!dropdownOpen)}
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.01 } : {}}
                  whileTap={!isLoading ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center gap-3">
                    {isLoading ? (
                      <FaSpinner className="animate-spin text-blue-500" />
                    ) : selectedCaretakerData ? (
                      <FaUser className="text-blue-500" />
                    ) : (
                      <FaUser className="text-gray-400" />
                    )}
                    <div>
                      <span className={`font-medium ${selectedCaretakerData ? 'text-gray-800' : 'text-gray-500'}`}>
                        {isLoading
                          ? "Loading caretakers..."
                          : selectedCaretakerData
                          ? `${selectedCaretakerData.firstName} ${selectedCaretakerData.surname}`
                          : "Choose a caretaker"}
                      </span>
                      {selectedCaretakerData && (
                        <p className="text-sm text-gray-500">{selectedCaretakerData.profession}</p>
                      )}
                    </div>
                  </div>
                  {!isLoading && (
                    <FaChevronDown
                      className={`text-gray-400 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </motion.button>

                {/* Dropdown Options */}
                <AnimatePresence>
                  {dropdownOpen && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 z-[9999] mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                      style={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      {isError ? (
                        <div className="px-6 py-8 text-center">
                          <div className="text-red-500 mb-2">⚠️</div>
                          <p className="text-red-600 font-medium">Error loading caretakers</p>
                          <p className="text-gray-500 text-sm mt-1">Please try again</p>
                        </div>
                      ) : caretakers.length === 0 ? (
                        <div className="px-6 py-8 text-center">
                          <div className="text-gray-400 mb-2">👥</div>
                          <p className="text-gray-600 font-medium">No caretakers available</p>
                          <p className="text-gray-500 text-sm mt-1">Contact admin to add caretakers</p>
                        </div>
                      ) : (
                        caretakers.map((caretaker, index) => (
                          <motion.button
                            key={caretaker.caretakerId || `caretaker-${index}`}
                            type="button"
                            className={`w-full text-left px-6 py-4 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${
                              selectedCaretaker === caretaker.caretakerId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                            }`}
                            onClick={() => {
                              setSelectedCaretaker(caretaker.caretakerId);
                              setDropdownOpen(false);
                            }}
                            whileHover={{ x: 4 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-blue-100 rounded-full p-2 mt-1">
                                <FaUser className="text-blue-600 text-sm" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">
                                  {caretaker.firstName} {caretaker.surname}
                                </p>
                                <p className="text-blue-600 text-sm font-medium mb-1">
                                  {caretaker.profession}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <FaPhone />
                                    {caretaker.phoneNumber}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FaEnvelope />
                                    {caretaker.email}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  ID: {caretaker.caretakerId}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
              }`}
              whileHover={
                !isLoading
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !isLoading
                  ? { scale: 0.98 }
                  : {}
              }
            >
              {assignCaretakerMutation.isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Assigning Caretaker...</span>
                </>
              ) : (
                <>
                  <FaHardHat />
                  <span>Assign Caretaker</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </TabWrapper>
  );
}
