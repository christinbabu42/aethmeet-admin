export default function FraudControl() {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
        <h3 className="text-red-800 font-bold text-lg">🛡️ Anti-Fraud System Active</h3>
        <p className="text-red-600">No critical alerts detected in the last 24 hours.</p>
      </div>
      <div className="bg-white p-6 rounded-xl border">
        <h4 className="font-bold mb-2">Recent Flags:</h4>
        <ul className="list-disc ml-5 text-gray-500 italic">
          <li>IP Mismatch Detection</li>
          <li>Device ID Tracking</li>
          <li>Coin Farming Analysis</li>
        </ul>
      </div>
    </div>
  );
}