// Animation layout when loading data
export default function LoadingSkeleton() {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between overflow-hidden z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-2xl"></div>
      <div className="space-y-3 z-10">
        <div className="h-5 w-3/4 rounded-full bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-1/2 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-1/3 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-2/3 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-5 w-16 rounded-full bg-gray-300"></div>
        </div>
        <div className="h-4 w-24 rounded-full bg-gray-300 mt-2"></div>
      </div>
    </div>
  );
}