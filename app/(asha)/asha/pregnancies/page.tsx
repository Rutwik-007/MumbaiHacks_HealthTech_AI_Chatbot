import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PregnanciesPage() {
  const session = await auth();

  // Mock pregnancy tracking data
  const pregnantWomen = [
    { id: 1, name: "Sunita Patil", age: 28, weeks: 32, edd: "Jan 15, 2026", ancVisits: 4, risk: "Low", lastVisit: "Nov 25", nextVisit: "Dec 5", phone: "+91 98765 43210" },
    { id: 2, name: "Priya Sharma", age: 32, weeks: 28, edd: "Feb 10, 2026", ancVisits: 3, risk: "High", lastVisit: "Nov 27", nextVisit: "Dec 1", phone: "+91 98765 43211" },
    { id: 3, name: "Geeta Pawar", age: 25, weeks: 20, edd: "Mar 25, 2026", ancVisits: 2, risk: "Low", lastVisit: "Nov 20", nextVisit: "Dec 10", phone: "+91 98765 43212" },
    { id: 4, name: "Rekha More", age: 30, weeks: 16, edd: "Apr 15, 2026", ancVisits: 2, risk: "Medium", lastVisit: "Nov 22", nextVisit: "Dec 8", phone: "+91 98765 43213" },
    { id: 5, name: "Anita Jadhav", age: 22, weeks: 12, edd: "May 20, 2026", ancVisits: 1, risk: "Low", lastVisit: "Nov 18", nextVisit: "Dec 15", phone: "+91 98765 43214" },
  ];

  const recentDeliveries = [
    { id: 1, name: "Kavita Jadhav", deliveryDate: "Nov 20, 2025", type: "Normal", place: "PHC Shirur", babyWeight: "3.2 kg", babyGender: "Girl" },
    { id: 2, name: "Meena More", deliveryDate: "Nov 15, 2025", type: "Normal", place: "District Hospital", babyWeight: "2.9 kg", babyGender: "Boy" },
    { id: 3, name: "Suman Patil", deliveryDate: "Nov 10, 2025", type: "C-Section", place: "District Hospital", babyWeight: "3.5 kg", babyGender: "Girl" },
  ];

  const ancChecklist = [
    { visit: "ANC-1", timing: "Before 12 weeks", tests: ["Registration", "Blood Group", "Hemoglobin", "Urine Test", "HIV/VDRL"] },
    { visit: "ANC-2", timing: "14-26 weeks", tests: ["Weight", "BP", "Fetal Heart", "TT-1"] },
    { visit: "ANC-3", timing: "26-30 weeks", tests: ["Weight", "BP", "Fetal Heart", "TT-2", "Hemoglobin"] },
    { visit: "ANC-4", timing: "30+ weeks", tests: ["Weight", "BP", "Fetal Position", "Birth Plan"] },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/asha" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Pregnancy Tracking</span>
          </div>
          <h1 className="text-2xl font-bold">🤰 Pregnancy Tracking / गर्भधारणा</h1>
          <p className="text-muted-foreground">Monitor pregnant women and ensure safe deliveries</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          ➕ Register New Pregnancy
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-pink-50 dark:bg-pink-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{pregnantWomen.length}</div>
            <div className="text-sm text-pink-700">Total Pregnant</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{pregnantWomen.filter(p => p.risk === "High").length}</div>
            <div className="text-sm text-red-700">High Risk</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pregnantWomen.filter(p => p.weeks >= 28).length}</div>
            <div className="text-sm text-orange-700">Third Trimester</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{recentDeliveries.length}</div>
            <div className="text-sm text-green-700">Deliveries (Month)</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-blue-700">Institutional</div>
          </CardContent>
        </Card>
      </div>

      {/* Pregnant Women List */}
      <Card>
        <CardHeader>
          <CardTitle>🤰 Currently Pregnant Women</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Weeks</th>
                  <th className="text-left py-3 px-4">EDD</th>
                  <th className="text-left py-3 px-4">ANC Visits</th>
                  <th className="text-left py-3 px-4">Risk</th>
                  <th className="text-left py-3 px-4">Next Visit</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pregnantWomen.map((woman) => (
                  <tr key={woman.id} className={`border-b hover:bg-muted/50 ${woman.risk === "High" ? "bg-red-50 dark:bg-red-950/30" : ""}`}>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{woman.name}</p>
                        <p className="text-xs text-muted-foreground">Age: {woman.age} • {woman.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{woman.weeks}</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-pink-500 rounded-full" 
                            style={{ width: `${(woman.weeks / 40) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{woman.edd}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {woman.ancVisits}/4
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        woman.risk === "High" ? "bg-red-500 text-white" :
                        woman.risk === "Medium" ? "bg-yellow-500 text-white" :
                        "bg-green-500 text-white"
                      }`}>
                        {woman.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{woman.nextVisit}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">📞</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">👶 Recent Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="p-3 rounded-lg border bg-green-50 dark:bg-green-950">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{delivery.name}</p>
                      <p className="text-sm text-muted-foreground">{delivery.deliveryDate} • {delivery.place}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{delivery.babyGender} 👶</p>
                      <p className="text-sm text-muted-foreground">{delivery.babyWeight} • {delivery.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ANC Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>📋 ANC Visit Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ancChecklist.map((anc, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-600">{anc.visit}</span>
                    <span className="text-sm text-muted-foreground">{anc.timing}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {anc.tests.map((test, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        {test}
                      </span>
                    ))}
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
