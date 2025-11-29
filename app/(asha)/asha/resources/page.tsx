import { auth } from "@/app/(auth)/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ResourcesPage() {
  const session = await auth();

  // Health education resources
  const educationTopics = [
    { id: 1, title: "Pregnancy Care / गर्भावस्था काळजी", icon: "🤰", topics: 8, lastUpdated: "Nov 2025" },
    { id: 2, title: "Newborn Care / नवजात शिशु काळजी", icon: "👶", topics: 12, lastUpdated: "Nov 2025" },
    { id: 3, title: "Breastfeeding / स्तनपान", icon: "🍼", topics: 6, lastUpdated: "Oct 2025" },
    { id: 4, title: "Nutrition / पोषण", icon: "🥗", topics: 10, lastUpdated: "Nov 2025" },
    { id: 5, title: "Immunization / लसीकरण", icon: "💉", topics: 8, lastUpdated: "Nov 2025" },
    { id: 6, title: "Family Planning / कुटुंब नियोजन", icon: "👨‍👩‍👧", topics: 5, lastUpdated: "Sep 2025" },
  ];

  // Training videos
  const trainingVideos = [
    { id: 1, title: "How to Take Blood Pressure", duration: "5 min", completed: true },
    { id: 2, title: "Identifying High-Risk Pregnancy Signs", duration: "8 min", completed: true },
    { id: 3, title: "Newborn Resuscitation Basics", duration: "12 min", completed: false },
    { id: 4, title: "Growth Monitoring with MUAC", duration: "6 min", completed: false },
    { id: 5, title: "Counseling for Exclusive Breastfeeding", duration: "10 min", completed: true },
  ];

  // Flipchart topics
  const flipcharts = [
    { title: "Danger Signs in Pregnancy", pages: 12, format: "PDF" },
    { title: "Immunization Schedule", pages: 8, format: "PDF" },
    { title: "WASH Practices", pages: 10, format: "PDF" },
    { title: "Nutrition for Under-5", pages: 15, format: "PDF" },
  ];

  // Government schemes
  const schemes = [
    { name: "Janani Suraksha Yojana (JSY)", benefit: "₹1,400 - ₹1,000", eligibility: "Institutional delivery", icon: "🏥" },
    { name: "Pradhan Mantri Matru Vandana Yojana", benefit: "₹5,000", eligibility: "First live birth", icon: "💰" },
    { name: "PMMVY", benefit: "₹11,000", eligibility: "Pregnant & lactating mothers", icon: "🤰" },
    { name: "Bal Swasthya Karyakram", benefit: "Free treatment", eligibility: "Children 0-18 years", icon: "👶" },
  ];

  // Forms and registers
  const forms = [
    { name: "MCH Card", code: "Form-1", usage: "Pregnancy registration" },
    { name: "Eligible Couple Register", code: "Register-1", usage: "Family planning tracking" },
    { name: "Pregnancy Register", code: "Register-2", usage: "ANC tracking" },
    { name: "Delivery Register", code: "Register-3", usage: "Delivery documentation" },
    { name: "Child Immunization Card", code: "Form-2", usage: "Vaccination tracking" },
    { name: "Home Visit Form", code: "Form-3", usage: "Daily visit documentation" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/asha" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Resources</span>
          </div>
          <h1 className="text-2xl font-bold">📚 Resources & Training / संसाधने</h1>
          <p className="text-muted-foreground">Health education materials, training videos, and forms</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          📥 Download All Materials
        </Button>
      </div>

      {/* Training Progress */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Your Training Progress</h3>
              <p className="text-muted-foreground">Complete all modules to earn your certificate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">60%</div>
              <div className="text-sm text-muted-foreground">3 of 5 modules</div>
            </div>
          </div>
          <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-3/5 bg-green-500 rounded-full" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Education Topics */}
        <Card>
          <CardHeader>
            <CardTitle>📖 Health Education Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {educationTopics.map((topic) => (
                <div key={topic.id} className="p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="text-3xl mb-2">{topic.icon}</div>
                  <p className="font-medium text-sm">{topic.title}</p>
                  <p className="text-xs text-muted-foreground">{topic.topics} topics</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Videos */}
        <Card>
          <CardHeader>
            <CardTitle>🎥 Training Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trainingVideos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      video.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                    }`}>
                      {video.completed ? "✓" : "▶️"}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{video.title}</p>
                      <p className="text-xs text-muted-foreground">{video.duration}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {video.completed ? "Rewatch" : "Watch"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Government Schemes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">🏛️ Government Schemes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schemes.map((scheme, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-950/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{scheme.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{scheme.name}</p>
                      <p className="text-sm text-green-600 font-medium">Benefit: {scheme.benefit}</p>
                      <p className="text-xs text-muted-foreground">Eligibility: {scheme.eligibility}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forms and Registers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">📋 Forms & Registers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {forms.map((form, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-mono">
                      {form.code}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{form.name}</p>
                      <p className="text-xs text-muted-foreground">{form.usage}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">📥</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flipcharts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-teal-600">📊 IEC Materials (Flipcharts)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flipcharts.map((chart, idx) => (
              <div key={idx} className="p-4 rounded-lg border bg-teal-50 dark:bg-teal-950/30 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-4xl mb-2">📋</div>
                <p className="font-medium text-sm">{chart.title}</p>
                <p className="text-xs text-muted-foreground">{chart.pages} pages • {chart.format}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <CardHeader>
          <CardTitle>⚡ Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-bold text-red-600 mb-2">🚨 Danger Signs - Pregnancy</h4>
              <ul className="text-sm space-y-1">
                <li>• Severe headache with blurred vision</li>
                <li>• Heavy bleeding</li>
                <li>• High fever</li>
                <li>• Convulsions/Fits</li>
                <li>• Swelling of face/hands</li>
              </ul>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-bold text-blue-600 mb-2">💉 Vaccination Schedule</h4>
              <ul className="text-sm space-y-1">
                <li>• Birth: BCG, OPV-0, Hep-B</li>
                <li>• 6 weeks: OPV-1, Penta-1, Rota-1</li>
                <li>• 10 weeks: OPV-2, Penta-2, Rota-2</li>
                <li>• 14 weeks: OPV-3, Penta-3, Rota-3</li>
                <li>• 9 months: MR-1, JE-1</li>
              </ul>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-bold text-green-600 mb-2">📞 Helpline Numbers</h4>
              <ul className="text-sm space-y-1">
                <li>• ASHA Helpline: 104</li>
                <li>• Ambulance: 108</li>
                <li>• Child Helpline: 1098</li>
                <li>• Women Helpline: 181</li>
                <li>• COVID Helpline: 1075</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
