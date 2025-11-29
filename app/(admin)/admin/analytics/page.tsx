"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockAnalytics = {
  overview: {
    totalInteractions: 15420,
    uniqueUsers: 3240,
    avgSessionDuration: "4m 32s",
    conversionRate: 68,
  },
  topQueries: [
    { query: "Nearest PHC location", count: 1240, category: "Facilities" },
    { query: "Ayushman Bharat eligibility", count: 980, category: "Schemes" },
    { query: "Vaccination schedule for baby", count: 856, category: "Immunization" },
    { query: "Pregnancy care tips", count: 723, category: "Maternal Health" },
    { query: "Monsoon disease prevention", count: 645, category: "Seasonal" },
  ],
  userActivity: [
    { date: "Jan", citizens: 420, asha: 85, officers: 12 },
    { date: "Feb", citizens: 580, asha: 92, officers: 15 },
    { date: "Mar", citizens: 720, asha: 110, officers: 18 },
    { date: "Apr", citizens: 890, asha: 125, officers: 22 },
    { date: "May", citizens: 1050, asha: 140, officers: 28 },
    { date: "Jun", citizens: 1200, asha: 155, officers: 32 },
  ],
  districtBreakdown: [
    { district: "Pune", users: 450, appointments: 89, schemes: 120 },
    { district: "Mumbai", users: 680, appointments: 156, schemes: 210 },
    { district: "Nagpur", users: 320, appointments: 64, schemes: 85 },
    { district: "Nashik", users: 280, appointments: 52, schemes: 68 },
    { district: "Thane", users: 390, appointments: 78, schemes: 95 },
  ],
  toolUsage: [
    { tool: "Find Health Facility", usage: 3420, success: 95 },
    { tool: "Book Appointment", usage: 1890, success: 88 },
    { tool: "Check Scheme Eligibility", usage: 2340, success: 92 },
    { tool: "Get Vaccination Schedule", usage: 1560, success: 98 },
    { tool: "Weather Health Alerts", usage: 980, success: 100 },
  ],
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Platform usage metrics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Tabs value={timeRange} onValueChange={setTimeRange}>
        <TabsList>
          <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
          <TabsTrigger value="90d">Last 90 Days</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Interactions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalytics.overview.totalInteractions.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalytics.overview.uniqueUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.3% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Session Duration
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalytics.overview.avgSessionDuration}
            </div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15s from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Task Completion Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalytics.overview.conversionRate}%
            </div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top User Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.topQueries.map((query, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{query.query}</span>
                    <span className="text-muted-foreground">{query.count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(query.count / mockAnalytics.topQueries[0].count) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground min-w-[80px]">
                      {query.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tool Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Tool Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.toolUsage.map((tool, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{tool.tool}</span>
                    <div className="flex gap-4">
                      <span className="text-muted-foreground">
                        {tool.usage} uses
                      </span>
                      <span className="text-green-600">{tool.success}% success</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${(tool.usage / mockAnalytics.toolUsage[0].usage) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">District-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    District
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Active Users
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Appointments
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Scheme Applications
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Engagement Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockAnalytics.districtBreakdown.map((district, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-3 px-4 font-medium">{district.district}</td>
                    <td className="py-3 px-4 text-right">{district.users}</td>
                    <td className="py-3 px-4 text-right">
                      {district.appointments}
                    </td>
                    <td className="py-3 px-4 text-right">{district.schemes}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-600">
                        {Math.round(
                          ((district.appointments + district.schemes) /
                            district.users) *
                            100
                        )}
                        %
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Activity Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Activity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span>Citizens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>ASHA Workers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                <span>Officers</span>
              </div>
            </div>
            <div className="h-64 flex items-end gap-4">
              {mockAnalytics.userActivity.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-1" style={{ height: "200px" }}>
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{
                        height: `${(month.citizens / 1200) * 100}%`,
                      }}
                    />
                    <div
                      className="w-full bg-green-500"
                      style={{
                        height: `${(month.asha / 155) * 20}%`,
                      }}
                    />
                    <div
                      className="w-full bg-purple-500 rounded-b"
                      style={{
                        height: `${(month.officers / 32) * 10}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {month.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
