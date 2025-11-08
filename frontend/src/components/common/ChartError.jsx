export default function ChartError({ message }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-red-500 text-lg mb-2">⚠️</div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
