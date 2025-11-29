import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AshaWorkersPage() {
  const session = await auth();

  // Mock ASHA worker data
  const ashaWorkers = [
    { id: 1, name: "Sunita Kamble", village: "Shirur", phone: "+91 98765 43210", population: 850, households: 180, active: true, performance: 92, pregnantWomen: 5, children: 28, lastActive: "Today" },
    { id: 2, name: "Meena Patil", village: "Nimbut", phone: "+91 98765 43211", population: 720, households: 155, active: true, performance: 88, pregnantWomen: 3, children: 22, lastActive: "Today" },
    { id: 3, name: "Rekha More", village: "Talegaon", phone: "+91 98765 43212", population: 650, households: 140, active: true, performance: 95, pregnantWomen: 4, children: 19, lastActive: "Yesterday" },
    { id: 4, name: "Kavita Jadhav", village: "Uruli", phone: "+91 98765 43213", population: 920, households: 200, active: true, performance: 78, pregnantWomen: 6, children: 32, lastActive: "Today" },
    { id: 5, name: "Anita Pawar", village: "Jejuri", phone: "+91 98765 43214", population: 580, households: 125, active: false, performance: 65, pregnantWomen: 2, children: 15, lastActive: "3 days ago" },
    { id: 6, name: "Priya Gaikwad", village: "Pargaon", phone: "+91 98765 43215", population: 780, households: 168, active: true, performance: 91, pregnantWomen: 4, children: 25, lastActive: "Today" },
  ];

  const performanceStats = {
    totalASHAs: ashaWorkers.length,
    activeASHAs: ashaWorkers.filter(a => a.active).length,
    avgPerformance: Math.round(ashaWorkers.reduce((a, b) => a + b.performance, 0) / ashaWorkers.length),
    totalPopulation: ashaWorkers.reduce((a, b) => a + b.population, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/officer" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>ASHA Workers</span>
          </div>
          <h1 className="text-2xl font-bold">👩‍⚕️ ASHA Worker Management</h1>
          <p className="text-muted-foreground">Monitor and manage ASHA workers in your area</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">📊 Export Report</Button>
          <Button className="bg-green-600 hover:bg-green-700">
            ➕ Add New ASHA
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{performanceStats.totalASHAs}</div>
            <div className="text-sm text-blue-700">Total ASHA Workers</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{performanceStats.activeASHAs}</div>
            <div className="text-sm text-green-700">Active Today</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-950">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{performanceStats.avgPerformance}%</div>
            <div className="text-sm text-purple-700">Avg Performance</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-950">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{performanceStats.totalPopulation.toLocaleString()}</div>
            <div className="text-sm text-orange-700">Population Covered</div>
          </CardContent>
        </Card>
      </div>

      {/* ASHA Workers Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>ASHA Workers List</CardTitle>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search by name or village..." 
              className="px-3 py-1 border rounded-md text-sm"
            />
            <select className="px-3 py-1 border rounded-md text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Village</th>
                  <th className="text-left py-3 px-4">Coverage</th>
                  <th className="text-left py-3 px-4">Beneficiaries</th>
                  <th className="text-left py-3 px-4">Performance</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ashaWorkers.map((asha) => (
                  <tr key={asha.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{asha.name}</p>
                        <p className="text-xs text-muted-foreground">{asha.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{asha.village}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p>{asha.population} population</p>
                        <p className="text-muted-foreground">{asha.households} households</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded mr-1">🤰 {asha.pregnantWomen}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">👶 {asha.children}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              asha.performance >= 90 ? "bg-green-500" :
                              asha.performance >= 75 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${asha.performance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{asha.performance}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        asha.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {asha.active ? "Active" : "Inactive"}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{asha.lastActive}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="ghost" size="sm">📞</Button>
                        <Button variant="ghost" size="sm">✏️</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">🏆 Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ashaWorkers
                .sort((a, b) => b.performance - a.performance)
                .slice(0, 3)
                .map((asha, idx) => (
                  <div key={asha.id} className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-950/30">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                      <div>
                        <p className="font-medium">{asha.name}</p>
                        <p className="text-sm text-muted-foreground">{asha.village}</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-green-600">{asha.performance}%</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">⚠️ Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ashaWorkers
                .filter(a => a.performance < 80 || !a.active)
                .map((asha) => (
                  <div key={asha.id} className="flex items-center justify-between p-3 rounded-lg border bg-red-50 dark:bg-red-950/30">
                    <div>
                      <p className="font-medium">{asha.name}</p>
                      <p className="text-sm text-muted-foreground">{asha.village}</p>
                      <p className="text-xs text-red-600">
                        {!asha.active ? "Inactive for 3+ days" : `Low performance: ${asha.performance}%`}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Contact</Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
