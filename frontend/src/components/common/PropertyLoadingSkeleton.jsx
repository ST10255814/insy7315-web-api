// PropertyLoadingSkeleton.jsx
import React from "react";

/**
 * Loading skeleton for single property edit/view tabs
 */
export default function PropertyLoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative h-10 w-36 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
        </div>
        <div className="flex-1">
          <div className="relative h-8 w-48 bg-white rounded-lg mb-2 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
          </div>
          <div className="relative h-5 w-64 bg-white rounded shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
          </div>
        </div>
        <div className="relative h-10 w-32 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info Skeleton */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-white/20 p-6 space-y-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
            <div className="h-5 w-3/4 rounded-full bg-gray-300 mb-4" />
            <div className="grid grid-cols-2 gap-6">
              <div className="h-12 w-full rounded-full bg-gray-300" />
              <div className="h-12 w-full rounded-full bg-gray-300" />
            </div>
            <div className="h-12 w-full rounded-full bg-gray-300 mt-6" />
            <div className="h-20 w-full rounded-full bg-gray-300 mt-6" />
            <div className="flex items-center gap-2 mt-2">
              <div className="h-4 w-4 rounded-full bg-gray-300" />
              <div className="h-4 w-1/2 rounded-full bg-gray-300" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-4 w-4 rounded-full bg-gray-300" />
              <div className="h-4 w-1/3 rounded-full bg-gray-300" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-4 w-4 rounded-full bg-gray-300" />
              <div className="h-4 w-2/3 rounded-full bg-gray-300" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-5 w-16 rounded-full bg-gray-300" />
            </div>
            <div className="h-4 w-24 rounded-full bg-gray-300 mt-2" />
          </div>
          {/* Amenities Skeleton */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-white/20 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
            <div className="h-5 w-56 rounded-full bg-gray-300 mb-4" />
            <div className="h-10 w-full rounded-full bg-gray-300" />
          </div>
          {/* Images Skeleton */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-white/20 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
            <div className="h-5 w-56 rounded-full bg-gray-300 mb-4" />
            <div className="flex gap-2">
              <div className="h-24 w-24 rounded-full bg-gray-300" />
              <div className="h-24 w-24 rounded-full bg-gray-300" />
              <div className="h-24 w-24 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
        {/* Sidebar - Right Side */}
        <div className="space-y-6 flex flex-col justify-start">
          {/* Status Skeleton */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-white/20 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
            <div className="h-5 w-40 rounded-full bg-gray-300 mb-4" />
            <div className="space-y-2">
              <div className="h-8 w-full rounded-full bg-gray-300" />
              <div className="h-8 w-full rounded-full bg-gray-300" />
            </div>
          </div>
          {/* Actions Skeleton */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-white/20 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
            <div className="h-5 w-40 rounded-full bg-gray-300 mb-4" />
            <div className="space-y-2">
              <div className="h-10 w-full rounded-full bg-gray-300" />
              <div className="h-10 w-full rounded-full bg-gray-300" />
            </div>
          </div>
          {/* Preview Skeleton */}
          <div className="relative bg-gray-50 rounded-2xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
            <div className="h-5 w-40 rounded-full bg-gray-300 mb-4" />
            <div className="space-y-2">
              <div className="h-5 w-32 rounded-full bg-gray-300" />
              <div className="h-5 w-32 rounded-full bg-gray-300" />
              <div className="h-5 w-32 rounded-full bg-gray-300" />
              <div className="h-5 w-32 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
