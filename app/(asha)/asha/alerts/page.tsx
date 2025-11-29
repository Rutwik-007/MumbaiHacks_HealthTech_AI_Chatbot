import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AlertsPage() {
  const session = await auth();

  // Mock health alerts data
  const urgentAlerts = [
    { id: 1, type: "High Risk Pregnancy", name: "Priya Sharma", details: "Blood pressure elevated - 150/95 mmHg", time: "2 hours ago", priority: "Critical", action: "Immediate referral needed" },
    { id: 2, type: "Missed Vaccination", name: "Baby of Kavita Jadhav", details: "OPV-2 overdue by 10 days", time: "Today", priority: "High", action: "Schedule home visit" },
    { id: 3, type: "Low Birth Weight", name: "Baby of Suman Patil", details: "Weight: 2.1 kg - needs monitoring", time: "Yesterday", priority: "High", action: "Weekly weight check" },
  ];

  const generalAlerts = [
    { id: 4, type: "ANC Due", name: "Rekha More", details: "ANC-3 visit due in 2 days", time: "Upcoming", priority: "Medium" },
    { id: 5, type: "PNC Follow-up", name: "Kavita Jadhav", details: "Day 7 PNC visit scheduled", time: "Tomorrow", priority: "Medium" },
    { id: 6, type: "IFA Stock Low", name: "Medicine Supply", details: "Only 15 tablets remaining", time: "Today", priority: "Medium" },
    { id: 7, type: "Child Underweight", name: "Ravi Kumar (2y)", details: "Weight below 3rd percentile for 2 months", time: "3 days ago", priority: "Medium" },
    { id: 8, type: "Immunization Camp", name: "PHC Shirur", details: "Special polio drive on Dec 15", time: "Reminder", priority: "Low" },
  ];

  const diseaseOutbreaks = [
    { disease: "Dengue", cases: 3, area: "Ward 5", status: "Active", lastReported: "Nov 28" },
    { disease: "Diarrhea", cases: 5, area: "Ward 3", status: "Monitoring", lastReported: "Nov 25" },
  ];

  const monthlyStats = {
    totalAlerts: 45,
    resolved: 38,
    pending: 7,
    avgResponseTime: "4 hours"
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/asha" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Health Alerts</span>
          </div>
          <h1 className="text-2xl font-bold">🚨 Health Alerts / आरोग्य सूचना</h1>
          <p className="text-muted-foreground">Monitor and respond to health alerts in your area</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          🔔 Report New Alert
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 dark:bg-red-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{urgentAlerts.length}</div>
            <div className="text-sm text-red-700">Urgent Alerts</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{monthlyStats.pending}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{monthlyStats.resolved}</div>
            <div className="text-sm text-green-700">Resolved (Month)</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{monthlyStats.avgResponseTime}</div>
            <div className="text-sm text-blue-700">Avg Response</div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Alerts */}
      <Card className="border-red-500 border-2">
        <CardHeader className="bg-red-50 dark:bg-red-950">
          <CardTitle className="text-red-600 flex items-center gap-2">
            <span className="animate-pulse">🚨</span> Urgent Alerts - Immediate Action Required
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {urgentAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-red-50/50 dark:hover:bg-red-950/50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        alert.priority === "Critical" ? "bg-red-600 text-white" : "bg-orange-500 text-white"
                      }`}>
                        {alert.priority}
                      </span>
                      <span className="font-semibold">{alert.type}</span>
                    </div>
                    <p className="font-medium text-lg">{alert.name}</p>
                    <p className="text-muted-foreground">{alert.details}</p>
                    <p className="text-sm text-blue-600 mt-1">📋 Action: {alert.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">Resolve</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* General Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">⚠️ General Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generalAlerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg border hover:bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          alert.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {alert.type}
                        </span>
                      </div>
                      <p className="font-medium">{alert.name}</p>
                      <p className="text-sm text-muted-foreground">{alert.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disease Surveillance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">🦠 Disease Surveillance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diseaseOutbreaks.map((outbreak, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">{outbreak.disease}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      outbreak.status === "Active" ? "bg-red-500 text-white" : "bg-yellow-500 text-white"
                    }`}>
                      {outbreak.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cases</p>
                      <p className="font-semibold">{outbreak.cases}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Area</p>
                      <p className="font-semibold">{outbreak.area}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Reported</p>
                      <p className="font-semibold">{outbreak.lastReported}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <h4 className="font-semibold text-blue-700 mb-2">📢 Preventive Measures</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Ensure clean drinking water sources</li>
                  <li>• Promote hand washing awareness</li>
                  <li>• Check for stagnant water (mosquito breeding)</li>
                  <li>• Report any fever clusters immediately</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle>📞 Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white dark:bg-gray-900 rounded-lg text-center">
              <p className="font-bold text-red-600">🚑 Ambulance</p>
              <p className="text-xl font-bold">108</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-900 rounded-lg text-center">
              <p className="font-bold text-blue-600">🏥 PHC Shirur</p>
              <p className="text-xl font-bold">02137-222333</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-900 rounded-lg text-center">
              <p className="font-bold text-green-600">👨‍⚕️ Medical Officer</p>
              <p className="text-xl font-bold">+91 98765 00001</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-900 rounded-lg text-center">
              <p className="font-bold text-purple-600">📋 Health Officer</p>
              <p className="text-xl font-bold">+91 98765 00002</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
