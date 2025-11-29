import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OfficerDashboard() {
  const session = await auth();

  // Mock data for Officer dashboard
  const districtStats = {
    totalPopulation: 245000,
    totalASHAs: 156,
    activeASHAs: 148,
    totalPHCs: 12,
    totalSubCenters: 45,
    vaccinationCoverage: 87,
    maternalMortalityRate: 0.8,
    infantMortalityRate: 12,
  };

  const ashaPerformance = [
    { name: "Sunita Devi", village: "Wadgaon", visits: 45, vaccinations: 23, rating: 4.8 },
    { name: "Rekha Jadhav", village: "Shirur", visits: 42, vaccinations: 21, rating: 4.7 },
    { name: "Mangal Patil", village: "Khed", visits: 38, vaccinations: 19, rating: 4.5 },
    { name: "Anita More", village: "Junnar", visits: 35, vaccinations: 18, rating: 4.4 },
    { name: "Suman Gaikwad", village: "Ambegaon", visits: 33, vaccinations: 16, rating: 4.3 },
  ];

  const diseaseAlerts = [
    { disease: "Dengue", cases: 23, trend: "up", severity: "high" },
    { disease: "Malaria", cases: 8, trend: "down", severity: "medium" },
    { disease: "Typhoid", cases: 5, trend: "stable", severity: "low" },
    { disease: "Diarrhea", cases: 12, trend: "up", severity: "medium" },
  ];

  const pendingApprovals = [
    { type: "Medicine Request", from: "PHC Shirur", date: "Today", priority: "high" },
    { type: "Ambulance Allocation", from: "Wadgaon", date: "Today", priority: "high" },
    { type: "Camp Request", from: "ASHA Sunita", date: "Yesterday", priority: "medium" },
    { type: "Equipment Repair", from: "Sub-center Khed", date: "2 days ago", priority: "low" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            District Health Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {session?.user?.district || "Pune"} District • {session?.user?.name || "Health Officer"}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            🟢 All Systems Operational
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
            ⚠️ 2 Alerts
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{districtStats.totalASHAs}</div>
            <div className="text-sm opacity-90">Total ASHA Workers</div>
            <div className="text-xs opacity-75 mt-1">
              {districtStats.activeASHAs} Active ({Math.round(districtStats.activeASHAs / districtStats.totalASHAs * 100)}%)
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{districtStats.vaccinationCoverage}%</div>
            <div className="text-sm opacity-90">Vaccination Coverage</div>
            <div className="text-xs opacity-75 mt-1">Target: 95%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{districtStats.totalPHCs}</div>
            <div className="text-sm opacity-90">Health Facilities</div>
            <div className="text-xs opacity-75 mt-1">{districtStats.totalSubCenters} Sub-centers</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{(districtStats.totalPopulation / 1000).toFixed(0)}K</div>
            <div className="text-sm opacity-90">Population Covered</div>
            <div className="text-xs opacity-75 mt-1">{districtStats.totalPopulation.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Disease Surveillance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🦠</span> Disease Surveillance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {diseaseAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    alert.severity === "high"
                      ? "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                      : alert.severity === "medium"
                      ? "bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800"
                      : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div>
                    <p className="font-medium">{alert.disease}</p>
                    <p className="text-sm text-gray-500">{alert.cases} cases this week</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg ${
                      alert.trend === "up" ? "text-red-500" : alert.trend === "down" ? "text-green-500" : "text-gray-500"
                    }`}>
                      {alert.trend === "up" ? "📈" : alert.trend === "down" ? "📉" : "➡️"}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      alert.severity === "high"
                        ? "bg-red-500 text-white"
                        : alert.severity === "medium"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📋</span> Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-gray-800"
                >
                  <div>
                    <p className="font-medium text-sm">{item.type}</p>
                    <p className="text-xs text-gray-500">From: {item.from} • {item.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">
                      Approve
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ASHA Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>👩‍⚕️</span> Top Performing ASHA Workers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Village</th>
                  <th className="text-center py-3 px-4">Home Visits</th>
                  <th className="text-center py-3 px-4">Vaccinations</th>
                  <th className="text-center py-3 px-4">Rating</th>
                </tr>
              </thead>
              <tbody>
                {ashaPerformance.map((asha, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
                        idx === 0 ? "bg-yellow-400 text-yellow-900" :
                        idx === 1 ? "bg-gray-300 text-gray-700" :
                        idx === 2 ? "bg-orange-400 text-orange-900" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{asha.name}</td>
                    <td className="py-3 px-4 text-gray-600">{asha.village}</td>
                    <td className="py-3 px-4 text-center">{asha.visits}</td>
                    <td className="py-3 px-4 text-center">{asha.vaccinations}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1">
                        ⭐ {asha.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span> Key Health Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <div className="text-2xl font-bold text-green-600">{districtStats.infantMortalityRate}</div>
              <div className="text-sm text-gray-600">Infant Mortality Rate</div>
              <div className="text-xs text-green-600">per 1000 live births</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-pink-50 dark:bg-pink-950">
              <div className="text-2xl font-bold text-pink-600">{districtStats.maternalMortalityRate}</div>
              <div className="text-sm text-gray-600">Maternal Mortality Rate</div>
              <div className="text-xs text-pink-600">per 1000 deliveries</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <div className="text-sm text-gray-600">Institutional Deliveries</div>
              <div className="text-xs text-blue-600">This quarter</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
              <div className="text-2xl font-bold text-purple-600">78%</div>
              <div className="text-sm text-gray-600">ANC Registration</div>
              <div className="text-xs text-purple-600">First trimester</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
