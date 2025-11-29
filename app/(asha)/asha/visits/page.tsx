import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomeVisitsPage() {
  const session = await auth();

  // Mock home visit data
  const todaysVisits = [
    { id: 1, beneficiary: "Sunita Patil", type: "ANC Checkup", time: "10:00 AM", status: "Completed", notes: "BP normal, weight gain on track" },
    { id: 2, beneficiary: "Meena Jadhav", type: "PNC Visit", time: "11:30 AM", status: "Completed", notes: "Mother and baby doing well" },
    { id: 3, beneficiary: "Priya Sharma", type: "High Risk ANC", time: "2:00 PM", status: "Pending", notes: "Check BP and swelling" },
    { id: 4, beneficiary: "Kavita Jadhav", type: "Newborn Care", time: "3:30 PM", status: "Pending", notes: "Breastfeeding counseling" },
  ];

  const scheduledVisits = [
    { id: 1, beneficiary: "Geeta Pawar", type: "ANC-3", date: "Dec 1", village: "Junnar" },
    { id: 2, beneficiary: "Lakshmi Devi", type: "NCD Followup", date: "Dec 2", village: "Wadgaon" },
    { id: 3, beneficiary: "Rekha More", type: "ANC-2", date: "Dec 3", village: "Shirur" },
    { id: 4, beneficiary: "Anita Patil", type: "PNC-2", date: "Dec 4", village: "Wadgaon" },
  ];

  const visitHistory = [
    { id: 1, date: "Nov 28", beneficiary: "Sunita Patil", type: "ANC", outcome: "Normal" },
    { id: 2, date: "Nov 27", beneficiary: "Ramesh Kumar", type: "Growth Monitoring", outcome: "Weight OK" },
    { id: 3, date: "Nov 26", beneficiary: "Baby of Kavita", type: "Newborn Visit", outcome: "Healthy" },
    { id: 4, date: "Nov 25", beneficiary: "Meena Jadhav", type: "PNC", outcome: "Normal" },
    { id: 5, date: "Nov 24", beneficiary: "Priya Sharma", type: "High Risk ANC", outcome: "Referred" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/asha" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Home Visits</span>
          </div>
          <h1 className="text-2xl font-bold">🏡 Home Visits / घर भेट</h1>
          <p className="text-muted-foreground">Schedule and track home visits</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          ➕ Schedule Visit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-blue-700">Today's Visits</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-green-700">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-orange-700">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">34</div>
            <div className="text-sm text-purple-700">This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Today's Schedule - {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaysVisits.map((visit) => (
              <div key={visit.id} className={`p-4 rounded-lg border ${
                visit.status === "Completed" 
                  ? "bg-green-50 border-green-200 dark:bg-green-950" 
                  : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950"
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="font-bold text-lg">{visit.time}</p>
                    </div>
                    <div>
                      <p className="font-medium">{visit.beneficiary}</p>
                      <p className="text-sm text-muted-foreground">{visit.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">📝 {visit.notes}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      visit.status === "Completed" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                    }`}>
                      {visit.status}
                    </span>
                    {visit.status === "Pending" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Start Visit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Scheduled */}
        <Card>
          <CardHeader>
            <CardTitle>📆 Upcoming Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledVisits.map((visit) => (
                <div key={visit.id} className="p-3 rounded-lg border bg-muted/30 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{visit.beneficiary}</p>
                    <p className="text-sm text-muted-foreground">{visit.type} • {visit.village}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{visit.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visit History */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Recent Visit History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visitHistory.map((visit) => (
                <div key={visit.id} className="p-3 rounded-lg border bg-muted/30 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{visit.beneficiary}</p>
                    <p className="text-sm text-muted-foreground">{visit.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{visit.date}</p>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      visit.outcome === "Referred" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                    }`}>
                      {visit.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
