export default function EntityDetailsCard({ heading = "Details", fields = [] }) {
  return (
    <div className="pl-1">
      <div className="space-y-1">
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
          {heading}
        </div>
        {fields.map(({ label, value }, idx) => (
          <div className="text-sm text-gray-700 mb-1" key={idx}>
            <span className="font-bold text-red-800 mr-2">{label}:</span>
            <span className="font-semibold text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}