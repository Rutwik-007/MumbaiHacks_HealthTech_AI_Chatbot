'use client';

import { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  AlertTriangle,
  Languages,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  PieChart,
  Target,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHealthPlatform } from '../health-platform-provider';
import type { SupportedLanguage } from '@/lib/health-platform';

// Localized strings
const ANALYTICS_TEXT: Record<SupportedLanguage, {
  title: string;
  overview: string;
  trends: string;
  categories: string;
  languages: string;
  totalChats: string;
  activeUsers: string;
  emergencies: string;
  avgResponse: string;
  thisWeek: string;
  lastWeek: string;
  change: string;
  topCategories: string;
  languageDistribution: string;
  hourlyActivity: string;
  riskLevels: string;
  lowRisk: string;
  mediumRisk: string;
  highRisk: string;
  emergencyRisk: string;
  refresh: string;
  export: string;
  noData: string;
  loading: string;
  dailyChats: string;
  weeklyTrend: string;
  mostActive: string;
  citizens: string;
  ashaWorkers: string;
  officers: string;
  roleDistribution: string;
  emergencyAlerts: string;
  resolvedRate: string;
}> = {
  en: {
    title: 'Health Analytics Dashboard',
    overview: 'Overview',
    trends: 'Trends',
    categories: 'Categories',
    languages: 'Languages',
    totalChats: 'Total Conversations',
    activeUsers: 'Active Users',
    emergencies: 'Emergencies Detected',
    avgResponse: 'Avg Response Time',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    change: 'change',
    topCategories: 'Top Health Categories',
    languageDistribution: 'Language Distribution',
    hourlyActivity: 'Hourly Activity',
    riskLevels: 'Risk Level Distribution',
    lowRisk: 'Low',
    mediumRisk: 'Medium',
    highRisk: 'High',
    emergencyRisk: 'Emergency',
    refresh: 'Refresh',
    export: 'Export',
    noData: 'No data available',
    loading: 'Loading...',
    dailyChats: 'Daily Conversations',
    weeklyTrend: 'Weekly Trend',
    mostActive: 'Most Active Hours',
    citizens: 'Citizens',
    ashaWorkers: 'ASHA Workers',
    officers: 'Health Officers',
    roleDistribution: 'User Role Distribution',
    emergencyAlerts: 'Emergency Alerts',
    resolvedRate: 'Resolution Rate',
  },
  hi: {
    title: 'स्वास्थ्य विश्लेषण डैशबोर्ड',
    overview: 'अवलोकन',
    trends: 'रुझान',
    categories: 'श्रेणियाँ',
    languages: 'भाषाएँ',
    totalChats: 'कुल वार्तालाप',
    activeUsers: 'सक्रिय उपयोगकर्ता',
    emergencies: 'आपातकाल पता चला',
    avgResponse: 'औसत प्रतिक्रिया समय',
    thisWeek: 'इस सप्ताह',
    lastWeek: 'पिछला सप्ताह',
    change: 'बदलाव',
    topCategories: 'शीर्ष स्वास्थ्य श्रेणियाँ',
    languageDistribution: 'भाषा वितरण',
    hourlyActivity: 'प्रति घंटा गतिविधि',
    riskLevels: 'जोखिम स्तर वितरण',
    lowRisk: 'कम',
    mediumRisk: 'मध्यम',
    highRisk: 'उच्च',
    emergencyRisk: 'आपातकाल',
    refresh: 'रिफ्रेश',
    export: 'निर्यात',
    noData: 'कोई डेटा उपलब्ध नहीं',
    loading: 'लोड हो रहा है...',
    dailyChats: 'दैनिक वार्तालाप',
    weeklyTrend: 'साप्ताहिक रुझान',
    mostActive: 'सबसे सक्रिय घंटे',
    citizens: 'नागरिक',
    ashaWorkers: 'आशा कार्यकर्ता',
    officers: 'स्वास्थ्य अधिकारी',
    roleDistribution: 'उपयोगकर्ता भूमिका वितरण',
    emergencyAlerts: 'आपातकालीन अलर्ट',
    resolvedRate: 'समाधान दर',
  },
  mr: {
    title: 'आरोग्य विश्लेषण डॅशबोर्ड',
    overview: 'आढावा',
    trends: 'ट्रेंड',
    categories: 'श्रेणी',
    languages: 'भाषा',
    totalChats: 'एकूण संभाषणे',
    activeUsers: 'सक्रिय वापरकर्ते',
    emergencies: 'आणीबाणी आढळली',
    avgResponse: 'सरासरी प्रतिसाद वेळ',
    thisWeek: 'या आठवड्यात',
    lastWeek: 'मागील आठवडा',
    change: 'बदल',
    topCategories: 'शीर्ष आरोग्य श्रेणी',
    languageDistribution: 'भाषा वितरण',
    hourlyActivity: 'तासाभराची क्रियाकलाप',
    riskLevels: 'जोखीम स्तर वितरण',
    lowRisk: 'कमी',
    mediumRisk: 'मध्यम',
    highRisk: 'उच्च',
    emergencyRisk: 'आणीबाणी',
    refresh: 'रिफ्रेश',
    export: 'निर्यात',
    noData: 'डेटा उपलब्ध नाही',
    loading: 'लोड होत आहे...',
    dailyChats: 'दैनिक संभाषणे',
    weeklyTrend: 'साप्ताहिक ट्रेंड',
    mostActive: 'सर्वाधिक सक्रिय तास',
    citizens: 'नागरिक',
    ashaWorkers: 'आशा कार्यकर्ते',
    officers: 'आरोग्य अधिकारी',
    roleDistribution: 'वापरकर्ता भूमिका वितरण',
    emergencyAlerts: 'आणीबाणी अलर्ट',
    resolvedRate: 'निराकरण दर',
  },
  pa: {
    title: 'ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ ਡੈਸ਼ਬੋਰਡ',
    overview: 'ਸੰਖੇਪ',
    trends: 'ਰੁਝਾਨ',
    categories: 'ਸ਼੍ਰੇਣੀਆਂ',
    languages: 'ਭਾਸ਼ਾਵਾਂ',
    totalChats: 'ਕੁੱਲ ਗੱਲਬਾਤ',
    activeUsers: 'ਸਰਗਰਮ ਉਪਭੋਗਤਾ',
    emergencies: 'ਐਮਰਜੈਂਸੀ ਖੋਜੀ',
    avgResponse: 'ਔਸਤ ਜਵਾਬ ਸਮਾਂ',
    thisWeek: 'ਇਸ ਹਫ਼ਤੇ',
    lastWeek: 'ਪਿਛਲਾ ਹਫ਼ਤਾ',
    change: 'ਬਦਲਾਵ',
    topCategories: 'ਚੋਟੀ ਦੀਆਂ ਸਿਹਤ ਸ਼੍ਰੇਣੀਆਂ',
    languageDistribution: 'ਭਾਸ਼ਾ ਵੰਡ',
    hourlyActivity: 'ਘੰਟਾਵਾਰ ਗਤੀਵਿਧੀ',
    riskLevels: 'ਜੋਖਮ ਪੱਧਰ ਵੰਡ',
    lowRisk: 'ਘੱਟ',
    mediumRisk: 'ਮੱਧਮ',
    highRisk: 'ਉੱਚ',
    emergencyRisk: 'ਐਮਰਜੈਂਸੀ',
    refresh: 'ਰਿਫਰੈਸ਼',
    export: 'ਐਕਸਪੋਰਟ',
    noData: 'ਕੋਈ ਡਾਟਾ ਉਪਲਬਧ ਨਹੀਂ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ...',
    dailyChats: 'ਰੋਜ਼ਾਨਾ ਗੱਲਬਾਤ',
    weeklyTrend: 'ਹਫ਼ਤਾਵਾਰੀ ਰੁਝਾਨ',
    mostActive: 'ਸਭ ਤੋਂ ਸਰਗਰਮ ਘੰਟੇ',
    citizens: 'ਨਾਗਰਿਕ',
    ashaWorkers: 'ਆਸ਼ਾ ਵਰਕਰ',
    officers: 'ਸਿਹਤ ਅਧਿਕਾਰੀ',
    roleDistribution: 'ਉਪਭੋਗਤਾ ਭੂਮਿਕਾ ਵੰਡ',
    emergencyAlerts: 'ਐਮਰਜੈਂਸੀ ਅਲਰਟ',
    resolvedRate: 'ਹੱਲ ਦਰ',
  },
};

// Sample analytics data
const SAMPLE_DATA = {
  overview: {
    totalChats: 1247,
    totalChatsChange: 12.5,
    activeUsers: 342,
    activeUsersChange: 8.3,
    emergencies: 23,
    emergenciesChange: -15.2,
    avgResponseTime: 2.4,
    avgResponseTimeChange: -5.1,
  },
  categoryDistribution: [
    { category: 'pregnancy', count: 312, percentage: 25 },
    { category: 'vaccines', count: 248, percentage: 20 },
    { category: 'dengue', count: 186, percentage: 15 },
    { category: 'malaria', count: 149, percentage: 12 },
    { category: 'nutrition', count: 137, percentage: 11 },
    { category: 'child_health', count: 124, percentage: 10 },
    { category: 'general', count: 91, percentage: 7 },
  ],
  languageDistribution: [
    { language: 'hi', count: 523, percentage: 42 },
    { language: 'en', count: 387, percentage: 31 },
    { language: 'mr', count: 212, percentage: 17 },
    { language: 'pa', count: 125, percentage: 10 },
  ],
  roleDistribution: [
    { role: 'citizen', count: 856, percentage: 69 },
    { role: 'asha', count: 298, percentage: 24 },
    { role: 'officer', count: 93, percentage: 7 },
  ],
  riskDistribution: [
    { level: 'low', count: 823, percentage: 66 },
    { level: 'medium', count: 287, percentage: 23 },
    { level: 'high', count: 114, percentage: 9 },
    { level: 'emergency', count: 23, percentage: 2 },
  ],
  dailyChats: [
    { day: 'Mon', count: 187 },
    { day: 'Tue', count: 203 },
    { day: 'Wed', count: 178 },
    { day: 'Thu', count: 192 },
    { day: 'Fri', count: 165 },
    { day: 'Sat', count: 143 },
    { day: 'Sun', count: 179 },
  ],
  hourlyActivity: [
    { hour: '6AM', count: 12 },
    { hour: '8AM', count: 45 },
    { hour: '10AM', count: 78 },
    { hour: '12PM', count: 56 },
    { hour: '2PM', count: 67 },
    { hour: '4PM', count: 82 },
    { hour: '6PM', count: 94 },
    { hour: '8PM', count: 71 },
    { hour: '10PM', count: 34 },
  ],
  recentEmergencies: [
    { id: 1, type: 'Chest Pain', language: 'hi', time: '2 hours ago', resolved: true },
    { id: 2, type: 'High Fever (Child)', language: 'mr', time: '4 hours ago', resolved: true },
    { id: 3, type: 'Breathing Difficulty', language: 'en', time: '6 hours ago', resolved: false },
    { id: 4, type: 'Pregnancy Emergency', language: 'pa', time: '8 hours ago', resolved: true },
  ],
};

// Category labels
const CATEGORY_LABELS: Record<string, Record<SupportedLanguage, string>> = {
  pregnancy: { en: 'Pregnancy', hi: 'गर्भावस्था', mr: 'गर्भधारणा', pa: 'ਗਰਭ ਅਵਸਥਾ' },
  vaccines: { en: 'Vaccines', hi: 'टीकाकरण', mr: 'लसीकरण', pa: 'ਟੀਕੇ' },
  dengue: { en: 'Dengue', hi: 'डेंगू', mr: 'डेंग्यू', pa: 'ਡੇਂਗੂ' },
  malaria: { en: 'Malaria', hi: 'मलेरिया', mr: 'मलेरिया', pa: 'ਮਲੇਰੀਆ' },
  nutrition: { en: 'Nutrition', hi: 'पोषण', mr: 'पोषण', pa: 'ਪੋਸ਼ਣ' },
  child_health: { en: 'Child Health', hi: 'बाल स्वास्थ्य', mr: 'बाल आरोग्य', pa: 'ਬੱਚਿਆਂ ਦੀ ਸਿਹਤ' },
  general: { en: 'General', hi: 'सामान्य', mr: 'सामान्य', pa: 'ਆਮ' },
};

const LANGUAGE_LABELS: Record<string, Record<SupportedLanguage, string>> = {
  en: { en: 'English', hi: 'अंग्रेज़ी', mr: 'इंग्रजी', pa: 'ਅੰਗਰੇਜ਼ੀ' },
  hi: { en: 'Hindi', hi: 'हिन्दी', mr: 'हिंदी', pa: 'ਹਿੰਦੀ' },
  mr: { en: 'Marathi', hi: 'मराठी', mr: 'मराठी', pa: 'ਮਰਾਠੀ' },
  pa: { en: 'Punjabi', hi: 'पंजाबी', mr: 'पंजाबी', pa: 'ਪੰਜਾਬੀ' },
};

// Stat change indicator
function ChangeIndicator({ value, inverted = false }: { value: number; inverted?: boolean }) {
  const isPositive = inverted ? value < 0 : value > 0;
  const Icon = value > 0 ? TrendingUp : TrendingDown;
  
  return (
    <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      <Icon className="h-3 w-3" />
      <span>{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
}

// Simple bar chart component
function SimpleBarChart({ 
  data, 
  maxHeight = 100,
  barColor = 'bg-primary'
}: { 
  data: { label: string; value: number }[]; 
  maxHeight?: number;
  barColor?: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between gap-1 h-24">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div 
            className={`w-full ${barColor} rounded-t transition-all`}
            style={{ height: `${(item.value / maxValue) * maxHeight}%` }}
          />
          <span className="text-[10px] text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Horizontal progress bar
function HorizontalBar({ 
  label, 
  value, 
  percentage, 
  color 
}: { 
  label: string; 
  value: number; 
  percentage: number; 
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{value} ({percentage}%)</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Risk level colors
const RISK_COLORS: Record<string, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  emergency: 'bg-red-500',
};

export function AnalyticsDashboard() {
  const { language } = useHealthPlatform();
  const text = ANALYTICS_TEXT[language];
  const [isLoading, setIsLoading] = useState(false);

  const data = SAMPLE_DATA;

  // Transform data for charts
  const dailyChartData = useMemo(() => 
    data.dailyChats.map(d => ({ label: d.day, value: d.count })),
    [data.dailyChats]
  );

  const hourlyChartData = useMemo(() => 
    data.hourlyActivity.map(d => ({ label: d.hour, value: d.count })),
    [data.hourlyActivity]
  );

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Generate CSV data
    const csvContent = `Health Analytics Report
Generated: ${new Date().toLocaleString()}

Overview
Total Conversations,${data.overview.totalChats}
Active Users,${data.overview.activeUsers}
Emergencies Detected,${data.overview.emergencies}
Avg Response Time,${data.overview.avgResponseTime}s

Category Distribution
${data.categoryDistribution.map(c => `${c.category},${c.count},${c.percentage}%`).join('\n')}

Language Distribution
${data.languageDistribution.map(l => `${l.language},${l.count},${l.percentage}%`).join('\n')}
`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{text.title}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString(language === 'en' ? 'en-IN' : `${language}-IN`, { 
                weekday: 'long', 
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {text.refresh}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            {text.export}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{text.totalChats}</p>
                <p className="text-2xl font-bold">{data.overview.totalChats.toLocaleString()}</p>
                <ChangeIndicator value={data.overview.totalChatsChange} />
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{text.activeUsers}</p>
                <p className="text-2xl font-bold">{data.overview.activeUsers.toLocaleString()}</p>
                <ChangeIndicator value={data.overview.activeUsersChange} />
              </div>
              <Users className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{text.emergencies}</p>
                <p className="text-2xl font-bold text-red-600">{data.overview.emergencies}</p>
                <ChangeIndicator value={data.overview.emergenciesChange} inverted />
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{text.avgResponse}</p>
                <p className="text-2xl font-bold">{data.overview.avgResponseTime}s</p>
                <ChangeIndicator value={data.overview.avgResponseTimeChange} inverted />
              </div>
              <Clock className="h-8 w-8 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">{text.trends}</TabsTrigger>
          <TabsTrigger value="categories">{text.categories}</TabsTrigger>
          <TabsTrigger value="languages">{text.languages}</TabsTrigger>
          <TabsTrigger value="emergencies">{text.emergencyAlerts}</TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  {text.dailyChats}
                </CardTitle>
                <CardDescription>{text.thisWeek}</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={dailyChartData} barColor="bg-blue-500" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {text.mostActive}
                </CardTitle>
                <CardDescription>{text.hourlyActivity}</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={hourlyChartData} barColor="bg-green-500" />
              </CardContent>
            </Card>
          </div>

          {/* Risk Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                {text.riskLevels}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.riskDistribution.map((item) => (
                <HorizontalBar
                  key={item.level}
                  label={text[`${item.level}Risk` as keyof typeof text] as string}
                  value={item.count}
                  percentage={item.percentage}
                  color={RISK_COLORS[item.level]}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                {text.topCategories}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.categoryDistribution.map((item) => (
                <HorizontalBar
                  key={item.category}
                  label={CATEGORY_LABELS[item.category]?.[language] || item.category}
                  value={item.count}
                  percentage={item.percentage}
                  color="bg-primary"
                />
              ))}
            </CardContent>
          </Card>

          {/* Role Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                {text.roleDistribution}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.roleDistribution.map((item) => {
                const roleLabels: Record<string, string> = {
                  citizen: text.citizens,
                  asha: text.ashaWorkers,
                  officer: text.officers,
                };
                const roleColors: Record<string, string> = {
                  citizen: 'bg-blue-500',
                  asha: 'bg-pink-500',
                  officer: 'bg-purple-500',
                };
                return (
                  <HorizontalBar
                    key={item.role}
                    label={roleLabels[item.role] || item.role}
                    value={item.count}
                    percentage={item.percentage}
                    color={roleColors[item.role]}
                  />
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {text.languageDistribution}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.languageDistribution.map((item) => {
                const langColors: Record<string, string> = {
                  en: 'bg-blue-500',
                  hi: 'bg-orange-500',
                  mr: 'bg-green-500',
                  pa: 'bg-purple-500',
                };
                return (
                  <HorizontalBar
                    key={item.language}
                    label={LANGUAGE_LABELS[item.language]?.[language] || item.language}
                    value={item.count}
                    percentage={item.percentage}
                    color={langColors[item.language]}
                  />
                );
              })}
            </CardContent>
          </Card>

          {/* Language Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.languageDistribution.map((item) => (
              <Card key={item.language}>
                <CardContent className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {LANGUAGE_LABELS[item.language]?.[language]}
                  </p>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <Badge variant="secondary">{item.percentage}%</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Emergencies Tab */}
        <TabsContent value="emergencies" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  {text.emergencyAlerts}
                </CardTitle>
                <CardDescription>Recent emergency detections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.recentEmergencies.map((emergency) => (
                  <div
                    key={emergency.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      emergency.resolved 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' 
                        : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm">{emergency.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {LANGUAGE_LABELS[emergency.language]?.[language]} • {emergency.time}
                      </p>
                    </div>
                    <Badge variant={emergency.resolved ? 'default' : 'destructive'}>
                      {emergency.resolved ? '✓ Resolved' : 'Active'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {text.resolvedRate}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-5xl font-bold text-green-600">87%</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {data.recentEmergencies.filter(e => e.resolved).length} of {data.recentEmergencies.length} resolved
                  </p>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
