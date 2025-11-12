import { useParams, useNavigate, Route, Routes } from "react-router-dom";
import { TabWrapper, StateHandler, ActionButton } from "../common/index.js";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNotFound from "../feature/DashboardNotFound.jsx";
import AddCaretaker from "./caretaker/AddCaretaker.jsx";
import { FaPlusCircle } from "react-icons/fa";
import { useCaretakersQuery } from "../../utils/queries.js";
import CaretakerCard from "./caretaker/CaretakerCard.jsx";
import DeleteCaretaker from "./caretaker/DeleteCaretaker.jsx";

export default function CaretakerTab() {
  return (
    <Routes>
      <Route index element={<CaretakerListView />} />
      <Route path="add" element={<AddCaretaker />} />
      <Route path="delete/:caretakerId" element={<DeleteCaretaker />} />
      <Route path="*" element={<DashboardNotFound />} />
    </Routes>
  );
}

function CaretakerListView() {
  const navigate = useNavigate();
  const { userId: adminId } = useParams();

  const {
    data: caretakers = [],
    isLoading,
    isError,
  } = useCaretakersQuery(adminId);

  const handleAddCaretaker = () => {
    navigate("add");
  };

  const handleCaretakerAction = (action, caretaker) => {
    switch (action) {
      case "Delete":
        navigate(`delete/${caretaker.caretakerId}`);
        break;
      default:
        break;
    }
  };

  return (
    <TabWrapper decorativeElements="default">
      {/* Add Caretaker Button */}
      <div className="flex justify-start">
        <ActionButton
          onClick={handleAddCaretaker}
          icon={FaPlusCircle}
          disabled={false}
          size="medium"
        >
          Add a Caretaker
        </ActionButton>
      </div>

      <StateHandler
        isLoading={isLoading}
        isError={isError}
        data={caretakers}
        errorMessage="Failed to load caretakers. Please try again."
        emptyMessage="No caretakers found. Please add a caretaker."
        gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        loadingCount={8}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {caretakers.map((caretaker, index) => (
              <motion.div
                key={caretaker.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CaretakerCard
                  caretaker={caretaker}
                  onAction={handleCaretakerAction}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </StateHandler>
    </TabWrapper>
  );
}
