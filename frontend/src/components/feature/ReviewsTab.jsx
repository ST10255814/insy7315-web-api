import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";
import { TabWrapper, SectionHeading, StateHandler, DataLoading} from "../common/index.js";
import { useAdminPropertiesReviewsQuery } from "../../utils/queries.js";
import { useParams } from "react-router-dom";

function Stars({ value = 0 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= value ? (
        <FaStar key={i} className="text-yellow-400 w-4 h-4 inline-block mr-0.5" />
      ) : (
        <FaRegStar key={i} className="text-yellow-300 w-4 h-4 inline-block mr-0.5" />
      )
    );
  }
  return <span className="inline-flex">{stars}</span>;
}

export default function ReviewsTab() {
  // Simulate loading/error states - replace with actual API hook
  const { userId } = useParams();
  const { data: reviews = [], isLoading, isError } = useAdminPropertiesReviewsQuery(userId);

  const total = reviews.length;
  const avg = total > 0 ? (
    reviews.reduce((s, r) => s + (r.rating || 0), 0) / total
  ).toFixed(1) : 0;

  return (
    <TabWrapper decorativeElements="blue-purple">
      <SectionHeading title="Tenant Reviews" />

      <StateHandler
        isLoading={isLoading}
        isError={isError}
        data={reviews}
        errorMessage="Failed to load reviews. Please try again."
        emptyMessage="No reviews yet. Reviews from tenants will appear here."
        gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        loadingComponent={DataLoading}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Average Rating Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 -z-10"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl -z-10"></div>
              
              <div className="text-6xl font-bold text-blue-700 mb-3">{avg}</div>
              <Stars value={Math.round(parseFloat(avg))} />
              <div className="text-sm text-gray-600 mt-2 font-medium">Average Rating Across All Properties</div>
              <div className="text-xs text-gray-500 mt-1">Based on {total} reviews</div>
            </div>

            {/* Rating Distribution Card */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-white rounded-full blur-3xl -z-10"></div>
              
              <h3 className="text-lg font-bold text-blue-800 mb-6">Rating Distribution</h3>
              
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-semibold text-gray-700">{star}</span>
                        <FaStar className="text-yellow-400 w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: star * 0.1 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
                        />
                      </div>
                      
                      <div className="w-16 text-right">
                        <span className="text-sm font-semibold text-gray-700">{count}</span>
                        <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatePresence>
            {reviews.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative quote icon */}
                <FaQuoteLeft className="absolute top-4 right-4 text-blue-700 text-3xl opacity-50" />
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      {r.fullname.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-3">
                      <div className="text-base font-bold text-blue-800">{r.fullname}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        <span className="text-xs font-bold">Property:</span> {r.property}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <Stars value={r.rating} />
                      <div className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">{r.comment}</p>
                  </div>
                </div>

                {/* Bottom gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </StateHandler>
    </TabWrapper>
  );
}