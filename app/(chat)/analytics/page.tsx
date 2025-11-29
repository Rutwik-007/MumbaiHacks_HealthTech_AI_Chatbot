'use client';

import { HealthPlatformProvider } from '@/components/health';
import { AnalyticsDashboard } from '@/components/health/analytics';
import { ReportGenerator } from '@/components/health/reports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <HealthPlatformProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="reports">
              <ReportGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </HealthPlatformProvider>
  );
}
