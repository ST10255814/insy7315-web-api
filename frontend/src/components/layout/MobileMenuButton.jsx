import { FaBars } from "react-icons/fa";

export default function MobileMenuButton({ isDesktop, setIsSidebarOpen }) {
  if (isDesktop) return null;
  
  return (
    <button
      onClick={() => setIsSidebarOpen(true)}
      className="fixed top-20 left-4 z-30 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
    >
      <FaBars className="text-gray-600" />
    </button>
  );
}