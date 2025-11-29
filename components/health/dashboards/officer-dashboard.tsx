'use client';

import { useState } from 'react';
import { 
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Calendar,
  FileText,
  HeartPulse,
  Map,
  Package,
  TrendingDown,
  TrendingUp,
  Users,
  Syringe,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHealthPlatform } from '../health-platform-provider';
import type { SupportedLanguage } from '@/lib/health-platform';

// Localized strings
const DASHBOARD_TEXT: Record<SupportedLanguage, {
  title: string;
  overview: string;
  surveillance: string;
  programs: string;
  resources: string;
  activeCases: string;
  recovered: string;
  underTreatment: string;
  outbreakAlerts: string;
  immunizationCoverage: string;
  ancCoverage: string;
  institutionalDelivery: string;
  fullImmunization: string;
  healthFacilities: string;
  ashaWorkers: string;
  medicineStock: string;
  lowStock: string;
  recentAlerts: string;
  viewAll: string;
  generateReport: string;
  districtWise: string;
}> = {
  en: {
    title: 'Health Officer Dashboard',
    overview: 'Overview',
    surveillance: 'Disease Surveillance',
    programs: 'Program Monitoring',
    resources: 'Resource Management',
    activeCases: 'Active Cases',
    recovered: 'Recovered',
    underTreatment: 'Under Treatment',
    outbreakAlerts: 'Outbreak Alerts',
    immunizationCoverage: 'Immunization Coverage',
    ancCoverage: 'ANC Coverage',
    institutionalDelivery: 'Institutional Delivery',
    fullImmunization: 'Full Immunization',
    healthFacilities: 'Health Facilities',
    ashaWorkers: 'ASHA Workers',
    medicineStock: 'Medicine Stock',
    lowStock: 'Low Stock Items',
    recentAlerts: 'Recent Alerts',
    viewAll: 'View All',
    generateReport: 'Generate Report',
    districtWise: 'District-wise Data',
  },
  hi: {
    title: 'स्वास्थ्य अधिकारी डैशबोर्ड',
    overview: 'अवलोकन',
    surveillance: 'रोग निगरानी',
    programs: 'कार्यक्रम निगरानी',
    resources: 'संसाधन प्रबंधन',
    activeCases: 'सक्रिय मामले',
    recovered: 'स्वस्थ',
    underTreatment: 'उपचाराधीन',
    outbreakAlerts: 'प्रकोप चेतावनी',
    immunizationCoverage: 'टीकाकरण कवरेज',
    ancCoverage: 'ANC कवरेज',
    institutionalDelivery: 'संस्थागत प्रसव',
    fullImmunization: 'पूर्ण टीकाकरण',
    healthFacilities: 'स्वास्थ्य सुविधाएं',
    ashaWorkers: 'आशा कार्यकर्ता',
    medicineStock: 'दवा स्टॉक',
    lowStock: 'कम स्टॉक',
    recentAlerts: 'हाल की चेतावनियां',
    viewAll: 'सभी देखें',
    generateReport: 'रिपोर्ट बनाएं',
    districtWise: 'जिलेवार डेटा',
  },
  mr: {
    title: 'आरोग्य अधिकारी डॅशबोर्ड',
    overview: 'आढावा',
    surveillance: 'रोग निगराणी',
    programs: 'कार्यक्रम निरीक्षण',
    resources: 'संसाधन व्यवस्थापन',
    activeCases: 'सक्रिय प्रकरणे',
    recovered: 'बरे झाले',
    underTreatment: 'उपचाराधीन',
    outbreakAlerts: 'उद्रेक इशारे',
    immunizationCoverage: 'लसीकरण कव्हरेज',
    ancCoverage: 'ANC कव्हरेज',
    institutionalDelivery: 'संस्थात्मक प्रसूती',
    fullImmunization: 'पूर्ण लसीकरण',
    healthFacilities: 'आरोग्य सुविधा',
    ashaWorkers: 'आशा कार्यकर्त्या',
    medicineStock: 'औषध साठा',
    lowStock: 'कमी साठा',
    recentAlerts: 'अलीकडील इशारे',
    viewAll: 'सर्व पहा',
    generateReport: 'अहवाल तयार करा',
    districtWise: 'जिल्हानिहाय डेटा',
  },
  pa: {
    title: 'ਸਿਹਤ ਅਧਿਕਾਰੀ ਡੈਸ਼ਬੋਰਡ',
    overview: 'ਸੰਖੇਪ ਜਾਣਕਾਰੀ',
    surveillance: 'ਬਿਮਾਰੀ ਨਿਗਰਾਨੀ',
    programs: 'ਪ੍ਰੋਗਰਾਮ ਨਿਗਰਾਨੀ',
    resources: 'ਸਰੋਤ ਪ੍ਰਬੰਧਨ',
    activeCases: 'ਸਰਗਰਮ ਕੇਸ',
    recovered: 'ਠੀਕ ਹੋਏ',
    underTreatment: 'ਇਲਾਜ ਅਧੀਨ',
    outbreakAlerts: 'ਫੈਲਣ ਦੀਆਂ ਚੇਤਾਵਨੀਆਂ',
    immunizationCoverage: 'ਟੀਕਾਕਰਨ ਕਵਰੇਜ',
    ancCoverage: 'ANC ਕਵਰੇਜ',
    institutionalDelivery: 'ਸੰਸਥਾਗਤ ਡਿਲੀਵਰੀ',
    fullImmunization: 'ਪੂਰਾ ਟੀਕਾਕਰਨ',
    healthFacilities: 'ਸਿਹਤ ਸਹੂਲਤਾਂ',
    ashaWorkers: 'ਆਸ਼ਾ ਵਰਕਰ',
    medicineStock: 'ਦਵਾਈ ਸਟਾਕ',
    lowStock: 'ਘੱਟ ਸਟਾਕ',
    recentAlerts: 'ਤਾਜ਼ਾ ਚੇਤਾਵਨੀਆਂ',
    viewAll: 'ਸਭ ਵੇਖੋ',
    generateReport: 'ਰਿਪੋਰਟ ਬਣਾਓ',
    districtWise: 'ਜ਼ਿਲ੍ਹਾ-ਵਾਰ ਡਾਟਾ',
  },
};

// Sample data
const DISEASE_DATA = [
  { name: 'Dengue', active: 45, recovered: 120, trend: 'up', alert: true },
  { name: 'Malaria', active: 23, recovered: 89, trend: 'down', alert: false },
  { name: 'TB', active: 156, recovered: 234, trend: 'stable', alert: false },
  { name: 'COVID-19', active: 12, recovered: 1250, trend: 'down', alert: false },
];

const ALERTS = [
  { id: 1, type: 'outbreak', message: 'Dengue cases rising in Block A', severity: 'high', time: '2 hours ago' },
  { id: 2, type: 'stock', message: 'ORS packets low in PHC Rampur', severity: 'medium', time: '5 hours ago' },
  { id: 3, type: 'coverage', message: 'Immunization below target in Village X', severity: 'low', time: '1 day ago' },
];

// Progress bar component
function ProgressBar({ value, label, target }: { value: number; label: string; target: string }) {
  const percentage = Math.round(value);
  const isGood = percentage >= 80;
  const isMedium = percentage >= 60 && percentage < 80;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className={`font-medium ${isGood ? 'text-green-600' : isMedium ? 'text-orange-600' : 'text-red-600'}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${
            isGood ? 'bg-green-500' : isMedium ? 'bg-orange-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">Target: {target}</p>
    </div>
  );
}

// Stat card component
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  trend, 
  color = 'blue' 
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}) {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
  };

  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Icon className={`h-6 w-6 ${colorClasses[color]}`} />
            {trend && (
              <div className={`flex items-center text-xs ${
                trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-muted-foreground'
              }`}>
                {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                {trend === 'stable' && <Activity className="h-3 w-3 mr-1" />}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfficerDashboard() {
  const { language } = useHealthPlatform();
  const text = DASHBOARD_TEXT[language];
  const [activeSection, setActiveSection] = useState<'surveillance' | 'programs' | 'resources'>('surveillance');

  const stats = {
    totalActiveCases: 236,
    recovered: 1693,
    underTreatment: 236,
    facilities: 48,
    ashaWorkers: 125,
    lowStockItems: 8,
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{text.title}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString(language === 'en' ? 'en-IN' : `${language}-IN`, { 
                weekday: 'long', 
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          {text.generateReport}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard 
          icon={Activity} 
          label={text.activeCases} 
          value={stats.totalActiveCases}
          trend="up"
          color="red"
        />
        <StatCard 
          icon={HeartPulse} 
          label={text.recovered} 
          value={stats.recovered}
          trend="stable"
          color="green"
        />
        <StatCard 
          icon={Building2} 
          label={text.healthFacilities} 
          value={stats.facilities}
          subValue="PHC: 12, CHC: 4, SC: 32"
          color="blue"
        />
        <StatCard 
          icon={Users} 
          label={text.ashaWorkers} 
          value={stats.ashaWorkers}
          subValue="Active: 118"
          color="purple"
        />
      </div>

      {/* Section Toggle */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={activeSection === 'surveillance' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveSection('surveillance')}
        >
          <Activity className="h-4 w-4 mr-1" />
          {text.surveillance}
        </Button>
        <Button 
          variant={activeSection === 'programs' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveSection('programs')}
        >
          <BarChart3 className="h-4 w-4 mr-1" />
          {text.programs}
        </Button>
        <Button 
          variant={activeSection === 'resources' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveSection('resources')}
        >
          <Package className="h-4 w-4 mr-1" />
          {text.resources}
        </Button>
      </div>

      {/* Disease Surveillance Section */}
      {activeSection === 'surveillance' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {text.surveillance}
              </CardTitle>
              <CardDescription>Active disease cases in the district</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DISEASE_DATA.map((disease) => (
                <div
                  key={disease.name}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    disease.alert ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {disease.alert && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    <div>
                      <p className="font-medium text-sm">{disease.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Active: {disease.active} | Recovered: {disease.recovered}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {disease.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                    {disease.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                    {disease.trend === 'stable' && <Activity className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {text.recentAlerts}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'high' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' :
                    alert.severity === 'medium' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900' :
                    'bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                    <Badge 
                      variant={
                        alert.severity === 'high' ? 'destructive' :
                        alert.severity === 'medium' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                {text.viewAll}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Program Monitoring Section */}
      {activeSection === 'programs' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Syringe className="h-4 w-4" />
                {text.immunizationCoverage}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar value={85} label="BCG" target="95%" />
              <ProgressBar value={78} label="OPV-3" target="90%" />
              <ProgressBar value={72} label="Pentavalent-3" target="90%" />
              <ProgressBar value={68} label="Measles-1" target="95%" />
              <ProgressBar value={45} label="Measles-2" target="85%" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HeartPulse className="h-4 w-4" />
                Maternal Health Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar value={82} label={text.ancCoverage} target="100%" />
              <ProgressBar value={78} label="4+ ANC Visits" target="80%" />
              <ProgressBar value={88} label={text.institutionalDelivery} target="95%" />
              <ProgressBar value={65} label="PNC within 48 hours" target="90%" />
              <ProgressBar value={92} label="JSY Beneficiaries" target="100%" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resource Management Section */}
      {activeSection === 'resources' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                {text.medicineStock}
              </CardTitle>
              <CardDescription>{text.lowStock}: {stats.lowStockItems} items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'ORS Packets', stock: 120, min: 500, status: 'critical' },
                { name: 'Paracetamol', stock: 2500, min: 1000, status: 'good' },
                { name: 'Iron Tablets', stock: 800, min: 2000, status: 'low' },
                { name: 'Vaccines (Cold Chain)', stock: 450, min: 300, status: 'good' },
                { name: 'Cotrimoxazole', stock: 180, min: 500, status: 'critical' },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.status === 'critical' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' :
                    item.status === 'low' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900' :
                    ''
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {item.stock} | Min: {item.min}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      item.status === 'critical' ? 'destructive' :
                      item.status === 'low' ? 'default' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {text.healthFacilities}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: 'District Hospital', count: 1, status: 'Functional' },
                { type: 'CHC', count: 4, status: 'All Functional' },
                { type: 'PHC', count: 12, status: '11 Functional' },
                { type: 'Sub-Center', count: 32, status: '30 Functional' },
                { type: 'Ayushman Bharat HWC', count: 28, status: 'Operational' },
              ].map((facility) => (
                <div
                  key={facility.type}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="text-sm font-medium">{facility.type}</p>
                    <p className="text-xs text-muted-foreground">{facility.status}</p>
                  </div>
                  <span className="text-lg font-bold">{facility.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
              <Map className="h-5 w-5" />
              <span className="text-xs">{text.districtWise}</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
              <FileText className="h-5 w-5" />
              <span className="text-xs">{text.generateReport}</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
              <Calendar className="h-5 w-5" />
              <span className="text-xs">IDSP Report</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
