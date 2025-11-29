'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Baby, 
  Syringe, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Phone,
  FileText,
  TrendingUp,
  Heart,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHealthPlatform } from '../health-platform-provider';
import type { SupportedLanguage } from '@/lib/health-platform';

// Localized strings
const DASHBOARD_TEXT: Record<SupportedLanguage, {
  title: string;
  todayVisits: string;
  pendingVisits: string;
  completed: string;
  highRisk: string;
  pregnantWomen: string;
  children: string;
  immunization: string;
  pendingVaccines: string;
  dueToday: string;
  overdue: string;
  quickActions: string;
  addVisit: string;
  viewSchedule: string;
  reportIssue: string;
  callSupervisor: string;
  targets: string;
}> = {
  en: {
    title: 'ASHA Worker Dashboard',
    todayVisits: "Today's Visits",
    pendingVisits: 'Pending',
    completed: 'Done',
    highRisk: 'High Risk Cases',
    pregnantWomen: 'Pregnant Women',
    children: 'Children (0-5 yrs)',
    immunization: 'Immunization',
    pendingVaccines: 'Pending Vaccines',
    dueToday: 'Due Today',
    overdue: 'Overdue',
    quickActions: 'Quick Actions',
    addVisit: 'Add Visit',
    viewSchedule: 'View Schedule',
    reportIssue: 'Report Issue',
    callSupervisor: 'Call Supervisor',
    targets: 'Monthly Targets',
  },
  hi: {
    title: 'आशा कार्यकर्ता डैशबोर्ड',
    todayVisits: 'आज की विज़िट',
    pendingVisits: 'बाकी',
    completed: 'पूर्ण',
    highRisk: 'उच्च जोखिम',
    pregnantWomen: 'गर्भवती महिलाएं',
    children: 'बच्चे (0-5 वर्ष)',
    immunization: 'टीकाकरण',
    pendingVaccines: 'लंबित टीके',
    dueToday: 'आज देय',
    overdue: 'अतिदेय',
    quickActions: 'त्वरित कार्य',
    addVisit: 'विज़िट जोड़ें',
    viewSchedule: 'शेड्यूल देखें',
    reportIssue: 'समस्या रिपोर्ट',
    callSupervisor: 'सुपरवाइज़र को कॉल',
    targets: 'मासिक लक्ष्य',
  },
  mr: {
    title: 'आशा कार्यकर्ता डॅशबोर्ड',
    todayVisits: 'आजच्या भेटी',
    pendingVisits: 'प्रलंबित',
    completed: 'पूर्ण',
    highRisk: 'उच्च जोखीम',
    pregnantWomen: 'गर्भवती महिला',
    children: 'मुले (0-5 वर्षे)',
    immunization: 'लसीकरण',
    pendingVaccines: 'प्रलंबित लसी',
    dueToday: 'आज देय',
    overdue: 'थकीत',
    quickActions: 'जलद कृती',
    addVisit: 'भेट जोडा',
    viewSchedule: 'वेळापत्रक पहा',
    reportIssue: 'समस्या नोंदवा',
    callSupervisor: 'पर्यवेक्षकाला कॉल',
    targets: 'मासिक लक्ष्य',
  },
  pa: {
    title: 'ਆਸ਼ਾ ਵਰਕਰ ਡੈਸ਼ਬੋਰਡ',
    todayVisits: 'ਅੱਜ ਦੀਆਂ ਮੁਲਾਕਾਤਾਂ',
    pendingVisits: 'ਬਕਾਇਆ',
    completed: 'ਪੂਰਾ',
    highRisk: 'ਉੱਚ ਜੋਖਮ',
    pregnantWomen: 'ਗਰਭਵਤੀ ਔਰਤਾਂ',
    children: 'ਬੱਚੇ (0-5 ਸਾਲ)',
    immunization: 'ਟੀਕਾਕਰਨ',
    pendingVaccines: 'ਬਕਾਇਆ ਟੀਕੇ',
    dueToday: 'ਅੱਜ ਬਕਾਇਆ',
    overdue: 'ਮਿਆਦ ਪੁੱਗੀ',
    quickActions: 'ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ',
    addVisit: 'ਮੁਲਾਕਾਤ ਸ਼ਾਮਲ',
    viewSchedule: 'ਸਮਾਂ-ਸਾਰਣੀ ਵੇਖੋ',
    reportIssue: 'ਸਮੱਸਿਆ ਰਿਪੋਰਟ',
    callSupervisor: 'ਸੁਪਰਵਾਈਜ਼ਰ ਕਾਲ',
    targets: 'ਮਹੀਨਾਵਾਰ ਟੀਚੇ',
  },
};

// Sample data
const SAMPLE_VISITS = [
  { id: 1, name: 'Sunita Devi', type: 'ANC', time: '9:00 AM', status: 'pending', priority: 'high' },
  { id: 2, name: 'Ramu Kumar', type: 'Immunization', time: '10:30 AM', status: 'completed', priority: 'normal' },
  { id: 3, name: 'Geeta Bai', type: 'PNC', time: '11:00 AM', status: 'pending', priority: 'normal' },
  { id: 4, name: 'Lakshmi Devi', type: 'High Risk', time: '2:00 PM', status: 'pending', priority: 'high' },
];

const SAMPLE_VACCINES = [
  { id: 1, childName: 'Baby of Sunita', vaccine: 'OPV-1', dueDate: 'Today', status: 'due' },
  { id: 2, childName: 'Baby of Meera', vaccine: 'Pentavalent-2', dueDate: 'Yesterday', status: 'overdue' },
  { id: 3, childName: 'Baby of Kamla', vaccine: 'Measles', dueDate: 'Tomorrow', status: 'upcoming' },
];

// Progress bar component
function ProgressBar({ value, label, count }: { value: number; label: string; count: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{count}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all" 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function AshaDashboard() {
  const { language } = useHealthPlatform();
  const text = DASHBOARD_TEXT[language];
  const [activeSection, setActiveSection] = useState<'visits' | 'vaccines' | 'targets'>('visits');

  const stats = {
    todayVisits: 8,
    completed: 3,
    pending: 5,
    highRisk: 2,
    pregnantWomen: 12,
    children: 28,
    pendingVaccines: 15,
    dueToday: 4,
    overdue: 3,
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
          <Heart className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{text.title}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(language === 'en' ? 'en-IN' : `${language}-IN`, { 
              weekday: 'long', 
              day: 'numeric',
              month: 'short'
            })}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSection('visits')}>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{text.todayVisits}</p>
                <p className="text-2xl font-bold">{stats.todayVisits}</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">{stats.completed} ✓</Badge>
                  <Badge variant="outline" className="text-xs">{stats.pending} ⏳</Badge>
                </div>
              </div>
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSection('vaccines')}>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{text.immunization}</p>
                <p className="text-2xl font-bold">{stats.pendingVaccines}</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="default" className="text-xs">{stats.dueToday} today</Badge>
                  <Badge variant="destructive" className="text-xs">{stats.overdue} late</Badge>
                </div>
              </div>
              <Syringe className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{text.pregnantWomen}</p>
                <p className="text-2xl font-bold">{stats.pregnantWomen}</p>
              </div>
              <Users className="h-6 w-6 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{text.highRisk}</p>
                <p className="text-2xl font-bold text-red-500">{stats.highRisk}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Toggle */}
      <div className="flex gap-2">
        <Button 
          variant={activeSection === 'visits' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveSection('visits')}
        >
          {text.todayVisits}
        </Button>
        <Button 
          variant={activeSection === 'vaccines' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveSection('vaccines')}
        >
          {text.immunization}
        </Button>
        <Button 
          variant={activeSection === 'targets' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveSection('targets')}
        >
          {text.targets}
        </Button>
      </div>

      {/* Visits Section */}
      {activeSection === 'visits' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {text.todayVisits}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {SAMPLE_VISITS.map((visit) => (
              <div
                key={visit.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  visit.status === 'completed' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' : 
                  visit.priority === 'high' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {visit.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{visit.name}</p>
                    <p className="text-xs text-muted-foreground">{visit.type} • {visit.time}</p>
                  </div>
                </div>
                {visit.priority === 'high' && (
                  <Badge variant="destructive" className="text-xs">⚠️</Badge>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Vaccines Section */}
      {activeSection === 'vaccines' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Syringe className="h-4 w-4" />
              {text.pendingVaccines}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {SAMPLE_VACCINES.map((vaccine) => (
              <div
                key={vaccine.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  vaccine.status === 'overdue' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' :
                  vaccine.status === 'due' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900' : ''
                }`}
              >
                <div>
                  <p className="font-medium text-sm">{vaccine.childName}</p>
                  <p className="text-xs text-muted-foreground">{vaccine.vaccine} • {vaccine.dueDate}</p>
                </div>
                <Badge 
                  variant={
                    vaccine.status === 'overdue' ? 'destructive' : 
                    vaccine.status === 'due' ? 'default' : 'secondary'
                  }
                  className="text-xs"
                >
                  {vaccine.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Targets Section */}
      {activeSection === 'targets' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {text.targets}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={80} label="ANC Visits" count="24/30" />
            <ProgressBar value={80} label="Institutional Deliveries" count="8/10" />
            <ProgressBar value={72} label="Full Immunization" count="18/25" />
            <ProgressBar value={90} label="Home Visits" count="45/50" />
            <ProgressBar value={60} label="Nutrition Counseling" count="12/20" />
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{text.quickActions}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
              <Calendar className="h-5 w-5" />
              <span className="text-xs text-center">{text.addVisit}</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
              <FileText className="h-5 w-5" />
              <span className="text-xs text-center">{text.viewSchedule}</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-xs text-center">{text.reportIssue}</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1" asChild>
              <a href="tel:104">
                <Phone className="h-5 w-5" />
                <span className="text-xs text-center">{text.callSupervisor}</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
