import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AshaDashboard() {
  const session = await auth();

  // Mock data for ASHA dashboard
  const stats = {
    totalBeneficiaries: 156,
    pregnantWomen: 12,
    newborns: 8,
    childrenUnder5: 45,
    pendingVaccinations: 23,
    homeVisitsThisMonth: 34,
    healthCampsScheduled: 2,
  };

  const upcomingTasks = [
    { id: 1, type: "vaccination", name: "Polio drops - Ramesh (2 months)", date: "Today", urgent: true },
    { id: 2, type: "visit", name: "ANC checkup - Sunita Devi", date: "Today", urgent: true },
    { id: 3, type: "vaccination", name: "BCG - Baby of Kavita", date: "Tomorrow", urgent: false },
    { id: 4, type: "visit", name: "PNC visit - Meena Jadhav", date: "Dec 1", urgent: false },
    { id: 5, type: "camp", name: "Health camp at Gram Panchayat", date: "Dec 3", urgent: false },
  ];

  const recentAlerts = [
    { id: 1, type: "outbreak", message: "Dengue cases reported in nearby village", severity: "high" },
    { id: 2, type: "reminder", message: "Monthly report due in 3 days", severity: "medium" },
    { id: 3, type: "info", message: "New vaccination guidelines available", severity: "low" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            नमस्कार, {session?.user?.name || "ASHA Worker"}! 🙏
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {session?.user?.district || "Your Village"} • {new Date().toLocaleDateString("mr-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            🟢 Active
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{stats.totalBeneficiaries}</div>
            <div className="text-sm opacity-90">Total Beneficiaries</div>
            <div className="text-xs opacity-75">कुल लाभार्थी</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{stats.pregnantWomen}</div>
            <div className="text-sm opacity-90">Pregnant Women</div>
            <div className="text-xs opacity-75">गर्भवती महिलाएं</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{stats.pendingVaccinations}</div>
            <div className="text-sm opacity-90">Pending Vaccinations</div>
            <div className="text-xs opacity-75">लंबित टीकाकरण</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-3xl font-bold">{stats.homeVisitsThisMonth}</div>
            <div className="text-sm opacity-90">Home Visits</div>
            <div className="text-xs opacity-75">घर भेट (इस महीने)</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📋</span> Today's Tasks / आजचे कार्य
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    task.urgent
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {task.type === "vaccination" ? "💉" : task.type === "visit" ? "🏡" : "🏥"}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{task.name}</p>
                      <p className="text-xs text-gray-500">{task.date}</p>
                    </div>
                  </div>
                  {task.urgent && (
                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded">Urgent</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🚨</span> Health Alerts / स्वास्थ्य सूचनाएं
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === "high"
                      ? "border-l-red-500 bg-red-50 dark:bg-red-950"
                      : alert.severity === "medium"
                      ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                      : "border-l-blue-500 bg-blue-50 dark:bg-blue-950"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {alert.type === "outbreak" ? "🦠" : alert.type === "reminder" ? "⏰" : "ℹ️"}
                    </span>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⚡</span> Quick Actions / त्वरित कार्य
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="text-3xl">➕</span>
              <span className="text-sm font-medium">Add Beneficiary</span>
              <span className="text-xs text-gray-500">नया लाभार्थी</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="text-3xl">💉</span>
              <span className="text-sm font-medium">Record Vaccination</span>
              <span className="text-xs text-gray-500">टीकाकरण दर्ज</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="text-3xl">🏡</span>
              <span className="text-sm font-medium">Log Home Visit</span>
              <span className="text-xs text-gray-500">घर भेट नोंद</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="text-3xl">🆘</span>
              <span className="text-sm font-medium">Report Emergency</span>
              <span className="text-xs text-gray-500">आपातकालीन</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Village Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏘️</span> Village Health Summary / गाव स्वास्थ्य सारांश
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="text-2xl font-bold text-blue-600">{stats.newborns}</div>
              <div className="text-xs text-gray-600">Newborns (0-28 days)</div>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
              <div className="text-2xl font-bold text-green-600">{stats.childrenUnder5}</div>
              <div className="text-xs text-gray-600">Children (&lt;5 years)</div>
            </div>
            <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950">
              <div className="text-2xl font-bold text-pink-600">{stats.pregnantWomen}</div>
              <div className="text-xs text-gray-600">Pregnant Women</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-xs text-gray-600">Immunization Rate</div>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
              <div className="text-2xl font-bold text-orange-600">{stats.healthCampsScheduled}</div>
              <div className="text-xs text-gray-600">Upcoming Camps</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
