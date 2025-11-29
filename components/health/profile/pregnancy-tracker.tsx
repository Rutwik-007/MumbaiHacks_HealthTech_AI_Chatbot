'use client';

import { useState, useMemo } from 'react';
import {
  Baby,
  Calendar,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  Apple,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useHealthPlatform } from '../health-platform-provider';
import type { SupportedLanguage } from '@/lib/health-platform';

// Localized strings
const PREGNANCY_TEXT: Record<SupportedLanguage, {
  title: string;
  week: string;
  weeks: string;
  dueDate: string;
  trimester: string;
  first: string;
  second: string;
  third: string;
  progress: string;
  milestones: string;
  upcomingCheckups: string;
  dangerSigns: string;
  tips: string;
  completed: string;
  upcoming: string;
  overdue: string;
  scheduleVisit: string;
  callHelpline: string;
  babySize: string;
  weightGain: string;
  currentMilestone: string;
}> = {
  en: {
    title: 'Pregnancy Tracker',
    week: 'Week',
    weeks: 'weeks',
    dueDate: 'Expected Due Date',
    trimester: 'Trimester',
    first: 'First',
    second: 'Second',
    third: 'Third',
    progress: 'Pregnancy Progress',
    milestones: 'Development Milestones',
    upcomingCheckups: 'Upcoming Checkups',
    dangerSigns: 'Danger Signs to Watch',
    tips: 'Tips for This Week',
    completed: 'Completed',
    upcoming: 'Upcoming',
    overdue: 'Overdue',
    scheduleVisit: 'Schedule ANC Visit',
    callHelpline: 'Call Health Helpline',
    babySize: 'Baby Size',
    weightGain: 'Expected Weight Gain',
    currentMilestone: 'Current Milestone',
  },
  hi: {
    title: 'गर्भावस्था ट्रैकर',
    week: 'सप्ताह',
    weeks: 'सप्ताह',
    dueDate: 'अपेक्षित प्रसव तिथि',
    trimester: 'तिमाही',
    first: 'पहली',
    second: 'दूसरी',
    third: 'तीसरी',
    progress: 'गर्भावस्था प्रगति',
    milestones: 'विकास मील के पत्थर',
    upcomingCheckups: 'आगामी जांच',
    dangerSigns: 'खतरे के संकेत',
    tips: 'इस सप्ताह के लिए सुझाव',
    completed: 'पूर्ण',
    upcoming: 'आगामी',
    overdue: 'अतिदेय',
    scheduleVisit: 'ANC विज़िट शेड्यूल करें',
    callHelpline: 'स्वास्थ्य हेल्पलाइन कॉल करें',
    babySize: 'शिशु का आकार',
    weightGain: 'अपेक्षित वजन वृद्धि',
    currentMilestone: 'वर्तमान मील का पत्थर',
  },
  mr: {
    title: 'गर्भधारणा ट्रॅकर',
    week: 'आठवडा',
    weeks: 'आठवडे',
    dueDate: 'अपेक्षित प्रसूती तारीख',
    trimester: 'त्रैमासिक',
    first: 'पहिला',
    second: 'दुसरा',
    third: 'तिसरा',
    progress: 'गर्भधारणा प्रगती',
    milestones: 'विकास टप्पे',
    upcomingCheckups: 'आगामी तपासण्या',
    dangerSigns: 'धोक्याची चिन्हे',
    tips: 'या आठवड्यासाठी टिप्स',
    completed: 'पूर्ण',
    upcoming: 'आगामी',
    overdue: 'थकीत',
    scheduleVisit: 'ANC भेट शेड्यूल करा',
    callHelpline: 'आरोग्य हेल्पलाइन कॉल करा',
    babySize: 'बाळाचा आकार',
    weightGain: 'अपेक्षित वजन वाढ',
    currentMilestone: 'सध्याचा टप्पा',
  },
  pa: {
    title: 'ਗਰਭ ਅਵਸਥਾ ਟ੍ਰੈਕਰ',
    week: 'ਹਫ਼ਤਾ',
    weeks: 'ਹਫ਼ਤੇ',
    dueDate: 'ਸੰਭਾਵਿਤ ਜਣੇਪੇ ਦੀ ਤਾਰੀਖ',
    trimester: 'ਤਿਮਾਹੀ',
    first: 'ਪਹਿਲੀ',
    second: 'ਦੂਜੀ',
    third: 'ਤੀਜੀ',
    progress: 'ਗਰਭ ਅਵਸਥਾ ਤਰੱਕੀ',
    milestones: 'ਵਿਕਾਸ ਮੀਲ ਪੱਥਰ',
    upcomingCheckups: 'ਆਉਣ ਵਾਲੀਆਂ ਜਾਂਚਾਂ',
    dangerSigns: 'ਖ਼ਤਰੇ ਦੇ ਸੰਕੇਤ',
    tips: 'ਇਸ ਹਫ਼ਤੇ ਲਈ ਸੁਝਾਅ',
    completed: 'ਪੂਰਾ',
    upcoming: 'ਆਉਣ ਵਾਲਾ',
    overdue: 'ਬਕਾਇਆ',
    scheduleVisit: 'ANC ਮੁਲਾਕਾਤ ਤਹਿ ਕਰੋ',
    callHelpline: 'ਸਿਹਤ ਹੈਲਪਲਾਈਨ ਕਾਲ ਕਰੋ',
    babySize: 'ਬੱਚੇ ਦਾ ਆਕਾਰ',
    weightGain: 'ਸੰਭਾਵਿਤ ਭਾਰ ਵਾਧਾ',
    currentMilestone: 'ਮੌਜੂਦਾ ਮੀਲ ਪੱਥਰ',
  },
};

// Pregnancy milestones by week
const MILESTONES: Record<number, { size: string; milestone: string; tips: string[] }> = {
  4: { size: 'Poppy seed', milestone: 'Implantation complete', tips: ['Start taking folic acid', 'Avoid alcohol and smoking'] },
  8: { size: 'Raspberry', milestone: 'Heart starts beating', tips: ['Schedule first ANC visit', 'Eat iron-rich foods'] },
  12: { size: 'Lime', milestone: 'All organs formed', tips: ['First trimester screening', 'Continue prenatal vitamins'] },
  16: { size: 'Avocado', milestone: 'Can hear sounds', tips: ['Anomaly scan due', 'Start gentle exercise'] },
  20: { size: 'Banana', milestone: 'Halfway there! Baby kicks', tips: ['Anatomy scan', 'Feel baby movements'] },
  24: { size: 'Corn', milestone: 'Lungs developing', tips: ['Glucose screening test', 'Monitor weight gain'] },
  28: { size: 'Eggplant', milestone: 'Eyes can open', tips: ['Third trimester begins', 'Count baby kicks daily'] },
  32: { size: 'Squash', milestone: 'Gaining weight rapidly', tips: ['Hospital bag ready', 'Learn labor signs'] },
  36: { size: 'Honeydew', milestone: 'Head may engage', tips: ['Weekly checkups start', 'Finalize birth plan'] },
  40: { size: 'Watermelon', milestone: 'Full term!', tips: ['Watch for labor signs', 'Stay calm and ready'] },
};

// ANC visit schedule
const ANC_SCHEDULE = [
  { week: 12, visit: 'First ANC Visit', tests: ['Blood tests', 'Urine test', 'BP check'] },
  { week: 20, visit: 'Second ANC Visit', tests: ['Anomaly scan', 'Weight check'] },
  { week: 26, visit: 'Third ANC Visit', tests: ['Glucose test', 'Hemoglobin'] },
  { week: 30, visit: 'Fourth ANC Visit', tests: ['Growth scan', 'BP monitoring'] },
  { week: 34, visit: 'Fifth ANC Visit', tests: ['Position check', 'NST if needed'] },
  { week: 36, visit: 'Weekly visits begin', tests: ['Cervix check', 'Fetal monitoring'] },
];

// Danger signs
const DANGER_SIGNS = [
  { icon: '🩸', en: 'Heavy bleeding', hi: 'भारी रक्तस्राव', mr: 'जास्त रक्तस्त्राव', pa: 'ਭਾਰੀ ਖੂਨ ਵਹਿਣਾ' },
  { icon: '🤕', en: 'Severe headache', hi: 'तेज सिरदर्द', mr: 'तीव्र डोकेदुखी', pa: 'ਤੇਜ਼ ਸਿਰ ਦਰਦ' },
  { icon: '👁️', en: 'Blurred vision', hi: 'धुंधली दृष्टि', mr: 'धूसर दृष्टी', pa: 'ਧੁੰਦਲੀ ਨਜ਼ਰ' },
  { icon: '🤒', en: 'High fever', hi: 'तेज बुखार', mr: 'ताप', pa: 'ਤੇਜ਼ ਬੁਖਾਰ' },
  { icon: '💧', en: 'Water leaking', hi: 'पानी टपकना', mr: 'पाणी गळणे', pa: 'ਪਾਣੀ ਲੀਕ' },
  { icon: '😣', en: 'Severe pain', hi: 'तेज दर्द', mr: 'तीव्र वेदना', pa: 'ਤੇਜ਼ ਦਰਦ' },
];

interface PregnancyTrackerProps {
  currentWeek: number;
  startDate?: Date;
}

export function PregnancyTracker({ currentWeek, startDate }: PregnancyTrackerProps) {
  const { language } = useHealthPlatform();
  const text = PREGNANCY_TEXT[language];

  // Calculate due date
  const dueDate = useMemo(() => {
    if (startDate) {
      const due = new Date(startDate);
      due.setDate(due.getDate() + 280); // 40 weeks
      return due;
    }
    const due = new Date();
    due.setDate(due.getDate() + (40 - currentWeek) * 7);
    return due;
  }, [startDate, currentWeek]);

  // Get trimester
  const trimester = currentWeek <= 12 ? 1 : currentWeek <= 27 ? 2 : 3;
  const trimesterLabels = [text.first, text.second, text.third];

  // Get current milestone
  const milestoneWeeks = Object.keys(MILESTONES).map(Number).sort((a, b) => a - b);
  const currentMilestoneWeek = milestoneWeeks.reduce((prev, curr) => 
    curr <= currentWeek ? curr : prev, milestoneWeeks[0]);
  const milestone = MILESTONES[currentMilestoneWeek];

  // Progress percentage
  const progressPercent = Math.min(Math.round((currentWeek / 40) * 100), 100);

  // Upcoming and completed checkups
  const checkups = ANC_SCHEDULE.map(c => ({
    ...c,
    status: c.week < currentWeek ? 'completed' : c.week === currentWeek || c.week === currentWeek + 1 ? 'upcoming' : 'future',
  }));

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-2xl">
          🤰
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{text.title}</h1>
          <p className="text-sm text-muted-foreground">
            {text.trimester}: {trimesterLabels[trimester - 1]} ({trimester}/3)
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-pink-600">{currentWeek}</p>
          <p className="text-xs text-muted-foreground">{text.weeks}</p>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200 dark:border-pink-800">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{text.progress}</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{text.week} 1</span>
              <span>{text.week} 40</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-pink-500" />
              <span className="text-sm">{text.dueDate}:</span>
            </div>
            <Badge variant="secondary" className="text-sm">
              {dueDate.toLocaleDateString(language === 'en' ? 'en-IN' : `${language}-IN`, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Current Milestone */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Baby className="h-4 w-4 text-pink-500" />
            {text.currentMilestone}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-2xl">
              🍼
            </div>
            <div className="flex-1">
              <p className="font-medium">{milestone.milestone}</p>
              <p className="text-sm text-muted-foreground">
                {text.babySize}: {milestone.size}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">{text.tips}:</p>
            {milestone.tips.map((tip, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Checkups */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            {text.upcomingCheckups}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {checkups.slice(0, 4).map((checkup, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                checkup.status === 'completed' 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                  : checkup.status === 'upcoming'
                    ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                    : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {checkup.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : checkup.status === 'upcoming' ? (
                  <Clock className="h-5 w-5 text-orange-500" />
                ) : (
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-sm">{checkup.visit}</p>
                  <p className="text-xs text-muted-foreground">
                    {text.week} {checkup.week} • {checkup.tests.join(', ')}
                  </p>
                </div>
              </div>
              <Badge variant={
                checkup.status === 'completed' ? 'default' :
                checkup.status === 'upcoming' ? 'secondary' : 'outline'
              }>
                {checkup.status === 'completed' ? text.completed :
                 checkup.status === 'upcoming' ? text.upcoming : `${text.week} ${checkup.week}`}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Signs */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {text.dangerSigns}
          </CardTitle>
          <CardDescription>
            Call 108 immediately if you experience any of these
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {DANGER_SIGNS.map((sign, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-950/20">
                <span>{sign.icon}</span>
                <span className="text-sm">{sign[language]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
          <Calendar className="h-5 w-5" />
          <span className="text-xs">{text.scheduleVisit}</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1" asChild>
          <a href="tel:104">
            <Activity className="h-5 w-5" />
            <span className="text-xs">{text.callHelpline}</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
