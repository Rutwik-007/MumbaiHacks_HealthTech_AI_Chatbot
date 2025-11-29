import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SurveillancePage() {
  const session = await auth();

  // Mock disease surveillance data
  const activeOutbreaks = [
    { id: 1, disease: "Dengue", cases: 12, deaths: 0, villages: ["Uruli", "Shirur"], status: "Active", startDate: "Nov 15", trend: "Increasing" },
    { id: 2, disease: "Acute Diarrhea", cases: 23, deaths: 0, villages: ["Nimbut", "Pargaon"], status: "Contained", startDate: "Nov 20", trend: "Decreasing" },
  ];

  const weeklyReports = [
    { disease: "Fever (Undiagnosed)", week1: 45, week2: 52, week3: 48, week4: 41 },
    { disease: "ARI (Acute Respiratory)", week1: 32, week2: 28, week3: 35, week4: 30 },
    { disease: "Diarrhea", week1: 18, week2: 25, week3: 23, week4: 15 },
    { disease: "Malaria (Suspected)", week1: 5, week2: 3, week3: 4, week4: 2 },
    { disease: "Dengue (Suspected)", week1: 8, week2: 12, week3: 15, week4: 12 },
  ];

  const vectorSurveillance = [
    { village: "Shirur", housesChecked: 180, positive: 12, index: 6.7, status: "High Risk" },
    { village: "Uruli", housesChecked: 200, positive: 18, index: 9.0, status: "Critical" },
    { village: "Nimbut", housesChecked: 155, positive: 5, index: 3.2, status: "Low Risk" },
    { village: "Talegaon", housesChecked: 140, positive: 4, index: 2.9, status: "Low Risk" },
    { village: "Jejuri", housesChecked: 125, positive: 8, index: 6.4, status: "Medium Risk" },
  ];

  const alertsThisWeek = [
    { type: "Cluster Alert", message: "3+ fever cases in Ward 5, Shirur", time: "2 hours ago", severity: "High" },
    { type: "Lab Result", message: "2 Dengue NS1 positive from Uruli", time: "Today", severity: "High" },
    { type: "Stock Alert", message: "ORS packets low at Nimbut Sub-center", time: "Yesterday", severity: "Medium" },
    { type: "Mortality Alert", message: "Child death reported - investigation needed", time: "Today", severity: "Critical" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/officer" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Disease Surveillance</span>
          </div>
          <h1 className="text-2xl font-bold">🦠 Disease Surveillance</h1>
          <p className="text-muted-foreground">Monitor disease outbreaks and public health threats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-600 border-red-600">
            🚨 Report Outbreak
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            📊 Weekly Report
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertsThisWeek.filter(a => a.severity === "Critical").length > 0 && (
        <Card className="bg-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-pulse">🚨</span>
                <div>
                  <p className="font-bold">Critical Alert</p>
                  <p>{alertsThisWeek.find(a => a.severity === "Critical")?.message}</p>
                </div>
              </div>
              <Button variant="secondary">Investigate</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Outbreaks */}
      <Card className="border-red-500 border-2">
        <CardHeader className="bg-red-50 dark:bg-red-950">
          <CardTitle className="text-red-600">🔴 Active Outbreaks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {activeOutbreaks.map((outbreak) => (
              <div key={outbreak.id} className="p-4 hover:bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold">{outbreak.disease}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        outbreak.status === "Active" ? "bg-red-500 text-white" : "bg-yellow-500 text-white"
                      }`}>
                        {outbreak.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        outbreak.trend === "Increasing" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}>
                        {outbreak.trend} ↗
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Cases</p>
                        <p className="font-bold text-lg">{outbreak.cases}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deaths</p>
                        <p className="font-bold text-lg">{outbreak.deaths}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Started</p>
                        <p className="font-bold">{outbreak.startDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Affected Villages</p>
                        <p className="font-medium">{outbreak.villages.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm" className="bg-blue-600">Manage</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Disease Reports */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Weekly Disease Trend (Last 4 Weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Disease</th>
                    <th className="text-center py-2">W1</th>
                    <th className="text-center py-2">W2</th>
                    <th className="text-center py-2">W3</th>
                    <th className="text-center py-2">W4</th>
                    <th className="text-center py-2">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyReports.map((report, idx) => {
                    const trend = report.week4 > report.week1 ? "up" : report.week4 < report.week1 ? "down" : "stable";
                    return (
                      <tr key={idx} className="border-b">
                        <td className="py-2 font-medium">{report.disease}</td>
                        <td className="text-center py-2">{report.week1}</td>
                        <td className="text-center py-2">{report.week2}</td>
                        <td className="text-center py-2">{report.week3}</td>
                        <td className="text-center py-2 font-bold">{report.week4}</td>
                        <td className="text-center py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            trend === "up" ? "bg-red-100 text-red-700" :
                            trend === "down" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Vector Surveillance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">🦟 Vector Surveillance (Mosquito Index)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vectorSurveillance.map((village, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{village.village}</p>
                    <p className="text-xs text-muted-foreground">
                      {village.housesChecked} houses checked, {village.positive} positive
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{village.index}%</p>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      village.status === "Critical" ? "bg-red-500 text-white" :
                      village.status === "High Risk" ? "bg-orange-500 text-white" :
                      village.status === "Medium Risk" ? "bg-yellow-500 text-white" :
                      "bg-green-500 text-white"
                    }`}>
                      {village.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * House Index &gt;5% indicates high risk for dengue/malaria transmission
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>🔔 Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertsThisWeek.map((alert, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${
                alert.severity === "Critical" ? "bg-red-50 dark:bg-red-950 border-red-500" :
                alert.severity === "High" ? "bg-orange-50 dark:bg-orange-950 border-orange-500" :
                "bg-yellow-50 dark:bg-yellow-950"
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    alert.severity === "Critical" ? "bg-red-600 text-white" :
                    alert.severity === "High" ? "bg-orange-500 text-white" :
                    "bg-yellow-500 text-white"
                  }`}>
                    {alert.severity}
                  </span>
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                  <Button variant="outline" size="sm" className="mt-1">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
