import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function VaccinationsPage() {
  const session = await auth();

  // Mock vaccination data
  const pendingVaccinations = [
    { id: 1, child: "Ramesh Kumar", age: "2 months", vaccine: "Polio (OPV)", dueDate: "Today", status: "Due", mother: "Sunita Patil", phone: "+91 98765 43210" },
    { id: 2, child: "Baby of Kavita", age: "6 weeks", vaccine: "DPT-1", dueDate: "Today", status: "Due", mother: "Kavita Jadhav", phone: "+91 98765 43211" },
    { id: 3, child: "Amit", age: "3 months", vaccine: "Hepatitis B-2", dueDate: "Tomorrow", status: "Upcoming", mother: "Meena More", phone: "+91 98765 43212" },
    { id: 4, child: "Priya (infant)", age: "9 months", vaccine: "Measles-1", dueDate: "Dec 2", status: "Upcoming", mother: "Geeta Pawar", phone: "+91 98765 43213" },
    { id: 5, child: "Rohan", age: "16 months", vaccine: "DPT Booster", dueDate: "Dec 5", status: "Upcoming", mother: "Lakshmi Devi", phone: "+91 98765 43214" },
  ];

  const completedVaccinations = [
    { id: 1, child: "Ramesh Kumar", vaccine: "BCG", date: "Nov 15, 2025", administeredBy: "ASHA Sunita" },
    { id: 2, child: "Baby of Kavita", vaccine: "OPV-0", date: "Nov 20, 2025", administeredBy: "PHC Shirur" },
    { id: 3, child: "Amit", vaccine: "Hepatitis B-1", date: "Nov 10, 2025", administeredBy: "ASHA Sunita" },
  ];

  const vaccineSchedule = [
    { age: "At Birth", vaccines: ["BCG", "OPV-0", "Hepatitis B-Birth"] },
    { age: "6 Weeks", vaccines: ["DPT-1", "OPV-1", "Hepatitis B-1", "Hib-1", "Rotavirus-1", "PCV-1"] },
    { age: "10 Weeks", vaccines: ["DPT-2", "OPV-2", "Hib-2", "Rotavirus-2", "PCV-2"] },
    { age: "14 Weeks", vaccines: ["DPT-3", "OPV-3", "Hepatitis B-2", "Hib-3", "Rotavirus-3", "PCV-3"] },
    { age: "9 Months", vaccines: ["Measles-1", "Vitamin A-1"] },
    { age: "16-24 Months", vaccines: ["DPT Booster-1", "Measles-2", "OPV Booster", "Vitamin A-2"] },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/asha" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Vaccinations</span>
          </div>
          <h1 className="text-2xl font-bold">💉 Vaccinations / टीकाकरण</h1>
          <p className="text-muted-foreground">Track and manage immunization schedules</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          ➕ Record Vaccination
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 dark:bg-red-950 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-red-700">Due Today</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-orange-700">This Week</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-sm text-green-700">Completed (Month)</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">89%</div>
            <div className="text-sm text-blue-700">Coverage Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Vaccinations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">🔴 Pending Vaccinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingVaccinations.map((vax) => (
                <div key={vax.id} className={`p-3 rounded-lg border ${
                  vax.status === "Due" ? "bg-red-50 border-red-200 dark:bg-red-950" : "bg-orange-50 border-orange-200 dark:bg-orange-950"
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{vax.child} ({vax.age})</p>
                      <p className="text-sm font-semibold text-blue-600">{vax.vaccine}</p>
                      <p className="text-xs text-muted-foreground">Mother: {vax.mother}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        vax.status === "Due" ? "bg-red-500 text-white" : "bg-orange-500 text-white"
                      }`}>
                        {vax.dueDate}
                      </span>
                      <div className="mt-2">
                        <Button size="sm" variant="outline">📞</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Completed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">✅ Recently Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedVaccinations.map((vax) => (
                <div key={vax.id} className="p-3 rounded-lg border bg-green-50 border-green-200 dark:bg-green-950">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{vax.child}</p>
                      <p className="text-sm text-green-700">{vax.vaccine}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{vax.date}</p>
                      <p className="text-xs text-muted-foreground">{vax.administeredBy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vaccination Schedule Reference */}
      <Card>
        <CardHeader>
          <CardTitle>📋 National Immunization Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vaccineSchedule.map((schedule, idx) => (
              <div key={idx} className="p-3 rounded-lg border bg-muted/30">
                <p className="font-semibold text-sm mb-2">{schedule.age}</p>
                <div className="flex flex-wrap gap-1">
                  {schedule.vaccines.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
