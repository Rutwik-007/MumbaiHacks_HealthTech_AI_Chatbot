import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BeneficiariesPage() {
  const session = await auth();

  // Mock beneficiary data
  const beneficiaries = [
    { id: 1, name: "Sunita Patil", age: 28, type: "Pregnant", status: "Active", village: "Wadgaon", lastVisit: "2 days ago", phone: "+91 98765 43210" },
    { id: 2, name: "Ramesh Kumar", age: 2, type: "Child (<5)", status: "Active", village: "Wadgaon", lastVisit: "1 week ago", phone: "+91 98765 43211" },
    { id: 3, name: "Baby of Kavita", age: 0, type: "Newborn", status: "Active", village: "Shirur", lastVisit: "Today", phone: "+91 98765 43212" },
    { id: 4, name: "Meena Jadhav", age: 25, type: "Lactating", status: "Active", village: "Wadgaon", lastVisit: "3 days ago", phone: "+91 98765 43213" },
    { id: 5, name: "Priya Sharma", age: 32, type: "Pregnant", status: "High Risk", village: "Khed", lastVisit: "1 day ago", phone: "+91 98765 43214" },
    { id: 6, name: "Amit (3 months)", age: 0, type: "Infant", status: "Active", village: "Shirur", lastVisit: "5 days ago", phone: "+91 98765 43215" },
    { id: 7, name: "Lakshmi Devi", age: 45, type: "Senior", status: "Chronic", village: "Wadgaon", lastVisit: "2 weeks ago", phone: "+91 98765 43216" },
    { id: 8, name: "Geeta Pawar", age: 30, type: "Pregnant", status: "Active", village: "Junnar", lastVisit: "4 days ago", phone: "+91 98765 43217" },
  ];

  const stats = {
    total: beneficiaries.length,
    pregnant: beneficiaries.filter(b => b.type === "Pregnant").length,
    children: beneficiaries.filter(b => ["Child (<5)", "Newborn", "Infant"].includes(b.type)).length,
    highRisk: beneficiaries.filter(b => b.status === "High Risk").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/asha" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Beneficiaries</span>
          </div>
          <h1 className="text-2xl font-bold">👨‍👩‍👧‍👦 Beneficiaries / लाभार्थी</h1>
          <p className="text-muted-foreground">Manage and track all beneficiaries in your village</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          ➕ Add New Beneficiary
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{stats.pregnant}</div>
            <div className="text-sm text-muted-foreground">Pregnant Women</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.children}</div>
            <div className="text-sm text-muted-foreground">Children</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </CardContent>
        </Card>
      </div>

      {/* Beneficiaries List */}
      <Card>
        <CardHeader>
          <CardTitle>All Beneficiaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Village</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Last Visit</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((person) => (
                  <tr key={person.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-xs text-muted-foreground">{person.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        person.type === "Pregnant" ? "bg-pink-100 text-pink-800" :
                        person.type === "Newborn" ? "bg-blue-100 text-blue-800" :
                        person.type === "Child (<5)" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {person.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{person.village}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        person.status === "High Risk" ? "bg-red-100 text-red-800" :
                        person.status === "Active" ? "bg-green-100 text-green-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {person.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{person.lastVisit}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">📞 Call</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
