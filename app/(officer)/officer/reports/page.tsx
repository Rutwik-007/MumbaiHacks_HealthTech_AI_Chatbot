import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ReportsPage() {
  const session = await auth();

  // Available report types
  const reportTypes = [
    { id: 1, name: "Monthly Progress Report", description: "Overall PHC performance metrics", icon: "📊", format: "PDF/Excel", lastGenerated: "Nov 30, 2025" },
    { id: 2, name: "Immunization Coverage Report", description: "Vaccine-wise and village-wise coverage", icon: "💉", format: "PDF/Excel", lastGenerated: "Nov 28, 2025" },
    { id: 3, name: "ASHA Performance Report", description: "Individual ASHA worker performance", icon: "👩‍⚕️", format: "PDF", lastGenerated: "Nov 25, 2025" },
    { id: 4, name: "Maternal Health Report", description: "ANC, deliveries, PNC statistics", icon: "🤰", format: "PDF/Excel", lastGenerated: "Nov 30, 2025" },
    { id: 5, name: "Disease Surveillance Report", description: "Weekly disease trends and outbreaks", icon: "🦠", format: "PDF", lastGenerated: "Nov 29, 2025" },
    { id: 6, name: "Child Health Report", description: "Growth monitoring and nutrition status", icon: "👶", format: "PDF/Excel", lastGenerated: "Nov 28, 2025" },
  ];

  // Recent reports generated
  const recentReports = [
    { name: "November 2025 - Monthly Progress Report", date: "Nov 30, 2025", size: "2.4 MB", status: "Ready" },
    { name: "Week 48 - Disease Surveillance", date: "Nov 29, 2025", size: "856 KB", status: "Ready" },
    { name: "Immunization Coverage Q3 2025", date: "Nov 28, 2025", size: "3.1 MB", status: "Ready" },
    { name: "ASHA Performance - November", date: "Nov 25, 2025", size: "1.8 MB", status: "Ready" },
  ];

  // Key indicators for the month
  const keyIndicators = [
    { indicator: "Institutional Delivery Rate", value: "98%", target: "95%", status: "Above Target" },
    { indicator: "Full Immunization (12-23 months)", value: "86%", target: "90%", status: "Below Target" },
    { indicator: "ANC 4+ Visits", value: "78%", target: "80%", status: "Near Target" },
    { indicator: "Low Birth Weight Rate", value: "8%", target: "<10%", status: "Within Limit" },
    { indicator: "ASHA Home Visits", value: "92%", target: "90%", status: "Above Target" },
    { indicator: "Maternal Deaths", value: "0", target: "0", status: "On Target" },
  ];

  // Scheduled reports
  const scheduledReports = [
    { name: "Weekly Surveillance Report", frequency: "Every Monday", nextDue: "Dec 2, 2025" },
    { name: "Monthly Progress Report", frequency: "1st of every month", nextDue: "Dec 1, 2025" },
    { name: "HMIS Submission", frequency: "5th of every month", nextDue: "Dec 5, 2025" },
    { name: "Quarterly Review Report", frequency: "Quarterly", nextDue: "Jan 1, 2026" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/officer" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Reports</span>
          </div>
          <h1 className="text-2xl font-bold">📋 Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download health program reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">📅 Schedule Report</Button>
          <Button className="bg-green-600 hover:bg-green-700">
            ➕ Generate New Report
          </Button>
        </div>
      </div>

      {/* Key Indicators Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle>📊 November 2025 - Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {keyIndicators.map((kpi, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-gray-900 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">{kpi.indicator}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">Target: {kpi.target}</p>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  kpi.status === "Above Target" ? "bg-green-100 text-green-700" :
                  kpi.status === "On Target" || kpi.status === "Within Limit" ? "bg-green-100 text-green-700" :
                  kpi.status === "Near Target" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {kpi.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Types Grid */}
      <Card>
        <CardHeader>
          <CardTitle>📂 Available Report Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <div key={report.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer hover:bg-muted/50">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{report.icon}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {report.format}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{report.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Last: {report.lastGenerated}</span>
                  <Button size="sm" variant="outline">Generate</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>📥 Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">👁️</Button>
                    <Button variant="outline" size="sm">📥</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">📅 Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledReports.map((report, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-orange-50 dark:bg-orange-950/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.frequency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600">Due: {report.nextDue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Custom Report Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Report Type</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Select report type...</option>
                <option>Immunization</option>
                <option>Maternal Health</option>
                <option>Child Health</option>
                <option>ASHA Performance</option>
                <option>Disease Surveillance</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Village/Area</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>All Villages</option>
                <option>Shirur</option>
                <option>Nimbut</option>
                <option>Talegaon</option>
                <option>Uruli</option>
                <option>Jejuri</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Last Week</option>
                <option>Last Month</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Format</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Preview</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* HMIS Integration */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
        <CardHeader>
          <CardTitle className="text-green-700">🏥 HMIS Portal Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Sync your reports directly with the Health Management Information System
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Last synced: Nov 30, 2025 - 10:30 AM
                </span>
                <span>|</span>
                <span>Next sync due: Dec 5, 2025</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">View Sync History</Button>
              <Button className="bg-green-600 hover:bg-green-700">Sync Now</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
