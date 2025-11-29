'use client';

import { useState, useMemo } from 'react';
import {
  Baby,
  Syringe,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Plus,
  Ruler,
  Scale,
  Heart,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useHealthPlatform } from '../health-platform-provider';
import type { SupportedLanguage } from '@/lib/health-platform';
import { VACCINE_SCHEDULE } from '@/lib/health-platform';

// Localized strings
const CHILD_TEXT: Record<SupportedLanguage, {
  title: string;
  age: string;
  months: string;
  years: string;
  vaccinations: string;
  growth: string;
  milestones: string;
  completed: string;
  due: string;
  overdue: string;
  upcoming: string;
  nextVaccine: string;
  vaccinesDone: string;
  addChild: string;
  height: string;
  weight: string;
  headCircumference: string;
  growthStatus: string;
  normal: string;
  underweight: string;
  stunted: string;
  developmentMilestones: string;
  canDo: string;
  watchFor: string;
  tipsForAge: string;
}> = {
  en: {
    title: 'Child Health Tracker',
    age: 'Age',
    months: 'months',
    years: 'years',
    vaccinations: 'Vaccinations',
    growth: 'Growth',
    milestones: 'Milestones',
    completed: 'Completed',
    due: 'Due Now',
    overdue: 'Overdue',
    upcoming: 'Upcoming',
    nextVaccine: 'Next Vaccine',
    vaccinesDone: 'vaccines done',
    addChild: 'Add Child',
    height: 'Height',
    weight: 'Weight',
    headCircumference: 'Head',
    growthStatus: 'Growth Status',
    normal: 'Normal',
    underweight: 'Underweight',
    stunted: 'Stunted',
    developmentMilestones: 'Development Milestones',
    canDo: 'Your child can',
    watchFor: 'Watch for',
    tipsForAge: 'Tips for this age',
  },
  hi: {
    title: 'बाल स्वास्थ्य ट्रैकर',
    age: 'उम्र',
    months: 'महीने',
    years: 'साल',
    vaccinations: 'टीकाकरण',
    growth: 'विकास',
    milestones: 'मील के पत्थर',
    completed: 'पूर्ण',
    due: 'अभी देय',
    overdue: 'अतिदेय',
    upcoming: 'आगामी',
    nextVaccine: 'अगला टीका',
    vaccinesDone: 'टीके लग चुके',
    addChild: 'बच्चा जोड़ें',
    height: 'लंबाई',
    weight: 'वजन',
    headCircumference: 'सिर',
    growthStatus: 'विकास स्थिति',
    normal: 'सामान्य',
    underweight: 'कम वजन',
    stunted: 'बौना',
    developmentMilestones: 'विकास मील के पत्थर',
    canDo: 'आपका बच्चा कर सकता है',
    watchFor: 'ध्यान दें',
    tipsForAge: 'इस उम्र के लिए सुझाव',
  },
  mr: {
    title: 'बाल आरोग्य ट्रॅकर',
    age: 'वय',
    months: 'महिने',
    years: 'वर्षे',
    vaccinations: 'लसीकरण',
    growth: 'वाढ',
    milestones: 'टप्पे',
    completed: 'पूर्ण',
    due: 'आता देय',
    overdue: 'थकीत',
    upcoming: 'आगामी',
    nextVaccine: 'पुढील लस',
    vaccinesDone: 'लसी दिल्या',
    addChild: 'मूल जोडा',
    height: 'उंची',
    weight: 'वजन',
    headCircumference: 'डोके',
    growthStatus: 'वाढ स्थिती',
    normal: 'सामान्य',
    underweight: 'कमी वजन',
    stunted: 'खुंटलेले',
    developmentMilestones: 'विकास टप्पे',
    canDo: 'तुमचे मूल करू शकते',
    watchFor: 'लक्ष द्या',
    tipsForAge: 'या वयासाठी टिप्स',
  },
  pa: {
    title: 'ਬੱਚਿਆਂ ਦੀ ਸਿਹਤ ਟ੍ਰੈਕਰ',
    age: 'ਉਮਰ',
    months: 'ਮਹੀਨੇ',
    years: 'ਸਾਲ',
    vaccinations: 'ਟੀਕਾਕਰਨ',
    growth: 'ਵਿਕਾਸ',
    milestones: 'ਮੀਲ ਪੱਥਰ',
    completed: 'ਪੂਰਾ',
    due: 'ਹੁਣੇ ਬਕਾਇਆ',
    overdue: 'ਮਿਆਦ ਪੁੱਗੀ',
    upcoming: 'ਆਉਣ ਵਾਲਾ',
    nextVaccine: 'ਅਗਲਾ ਟੀਕਾ',
    vaccinesDone: 'ਟੀਕੇ ਲੱਗੇ',
    addChild: 'ਬੱਚਾ ਸ਼ਾਮਲ ਕਰੋ',
    height: 'ਕੱਦ',
    weight: 'ਭਾਰ',
    headCircumference: 'ਸਿਰ',
    growthStatus: 'ਵਿਕਾਸ ਸਥਿਤੀ',
    normal: 'ਆਮ',
    underweight: 'ਘੱਟ ਭਾਰ',
    stunted: 'ਰੁਕਿਆ',
    developmentMilestones: 'ਵਿਕਾਸ ਮੀਲ ਪੱਥਰ',
    canDo: 'ਤੁਹਾਡਾ ਬੱਚਾ ਕਰ ਸਕਦਾ ਹੈ',
    watchFor: 'ਧਿਆਨ ਦਿਓ',
    tipsForAge: 'ਇਸ ਉਮਰ ਲਈ ਸੁਝਾਅ',
  },
};

// Development milestones by age (months)
const MILESTONES_BY_AGE: Record<number, {
  canDo: string[];
  watchFor: string[];
  tips: string[];
}> = {
  2: {
    canDo: ['Smiles at people', 'Follows things with eyes', 'Makes cooing sounds'],
    watchFor: ['No response to loud sounds', 'No smiling'],
    tips: ['Talk and sing to baby', 'Tummy time for 3-5 minutes'],
  },
  4: {
    canDo: ['Holds head steady', 'Pushes down on legs', 'Brings hands to mouth'],
    watchFor: ['Head flops back', 'No sounds', 'No eye contact'],
    tips: ['Provide colorful toys', 'Read books with pictures'],
  },
  6: {
    canDo: ['Sits with support', 'Rolls over', 'Responds to name'],
    watchFor: ['No reaching for objects', 'No rolling', 'Stiff muscles'],
    tips: ['Start solid foods', 'Safe floor play time'],
  },
  9: {
    canDo: ['Sits without support', 'Crawls', 'Points at things'],
    watchFor: ['Cannot sit', 'No babbling', 'No eye contact'],
    tips: ['Encourage crawling', 'Name objects around'],
  },
  12: {
    canDo: ['Pulls to stand', 'Says mama/papa', 'Waves bye-bye'],
    watchFor: ['Cannot stand with support', 'No words', 'No pointing'],
    tips: ['Practice walking with support', 'Read simple books'],
  },
  18: {
    canDo: ['Walks alone', 'Says several words', 'Drinks from cup'],
    watchFor: ['Cannot walk', 'No words', 'No interest in others'],
    tips: ['Encourage exploration', 'Limit screen time'],
  },
  24: {
    canDo: ['Runs', 'Speaks 2-word sentences', 'Follows instructions'],
    watchFor: ['No 2-word phrases', 'No copying', 'Regression'],
    tips: ['Encourage play with others', 'Potty training readiness'],
  },
  36: {
    canDo: ['Climbs well', 'Speaks in sentences', 'Plays pretend'],
    watchFor: ['Unclear speech', 'No interest in play', 'Drooling'],
    tips: ['Enroll in anganwadi', 'Encourage independence'],
  },
  48: {
    canDo: ['Hops on one foot', 'Tells stories', 'Knows colors'],
    watchFor: ['Cannot jump', 'Does not understand instructions'],
    tips: ['Pre-school activities', 'Social play dates'],
  },
  60: {
    canDo: ['Draws person with 6 parts', 'Counts to 10', 'Knows address'],
    watchFor: ['No interest in playing', 'Extreme behavior'],
    tips: ['School readiness activities', 'Reading practice'],
  },
};

// Get vaccines for age
function getVaccinesForAge(ageMonths: number) {
  const vaccines: Array<{
    name: string;
    ageLabel: string;
    status: 'completed' | 'due' | 'upcoming';
    dueMonths: number;
  }> = [];

  VACCINE_SCHEDULE.forEach(schedule => {
    const ageLabel = schedule.age;
    let dueMonths = 0;
    
    // Parse age to months
    if (ageLabel.includes('Birth')) dueMonths = 0;
    else if (ageLabel.includes('weeks')) {
      const weeks = parseInt(ageLabel) || 6;
      dueMonths = Math.floor(weeks / 4);
    }
    else if (ageLabel.includes('months')) dueMonths = parseInt(ageLabel) || 0;
    else if (ageLabel.includes('years')) dueMonths = (parseInt(ageLabel) || 1) * 12;

    schedule.vaccines.forEach(vaccine => {
      const status = dueMonths < ageMonths - 1 ? 'completed' :
                     dueMonths <= ageMonths + 1 ? 'due' : 'upcoming';
      vaccines.push({ name: vaccine, ageLabel, status, dueMonths });
    });
  });

  return vaccines;
}

interface ChildData {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  weight?: number; // kg
  height?: number; // cm
  headCircumference?: number; // cm
  completedVaccines: string[];
}

interface ChildHealthTrackerProps {
  children?: ChildData[];
  onAddChild?: () => void;
}

export function ChildHealthTracker({ children = [], onAddChild }: ChildHealthTrackerProps) {
  const { language } = useHealthPlatform();
  const text = CHILD_TEXT[language];
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  // Sample data if no children provided
  const sampleChildren: ChildData[] = children.length > 0 ? children : [
    {
      id: '1',
      name: 'Baby',
      dateOfBirth: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000), // 8 months ago
      gender: 'male',
      weight: 8.2,
      height: 70,
      headCircumference: 44,
      completedVaccines: ['BCG', 'OPV-0', 'Hepatitis B birth dose', 'OPV-1', 'Pentavalent-1', 'Rotavirus-1', 'PCV-1'],
    },
  ];

  const child = sampleChildren[selectedChildIndex];
  
  // Calculate age
  const now = new Date();
  const ageMs = now.getTime() - child.dateOfBirth.getTime();
  const ageMonths = Math.floor(ageMs / (30 * 24 * 60 * 60 * 1000));
  const ageYears = Math.floor(ageMonths / 12);
  const remainingMonths = ageMonths % 12;

  // Get vaccines
  const vaccines = useMemo(() => getVaccinesForAge(ageMonths), [ageMonths]);
  const completedCount = vaccines.filter(v => v.status === 'completed').length;
  const dueVaccines = vaccines.filter(v => v.status === 'due');
  const upcomingVaccines = vaccines.filter(v => v.status === 'upcoming').slice(0, 3);

  // Get milestones for nearest age
  const milestoneAges = Object.keys(MILESTONES_BY_AGE).map(Number);
  const nearestMilestoneAge = milestoneAges.reduce((prev, curr) =>
    Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
  );
  const milestones = MILESTONES_BY_AGE[nearestMilestoneAge];

  // Vaccination progress
  const totalVaccines = vaccines.length;
  const vaccineProgress = Math.round((completedCount / totalVaccines) * 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-2xl">
          👶
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{text.title}</h1>
          <p className="text-sm text-muted-foreground">
            {child.name} • {text.age}: {ageYears > 0 ? `${ageYears} ${text.years} ` : ''}{remainingMonths} {text.months}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onAddChild}>
          <Plus className="h-4 w-4 mr-1" />
          {text.addChild}
        </Button>
      </div>

      {/* Child selector (if multiple) */}
      {sampleChildren.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sampleChildren.map((c, i) => (
            <Button
              key={c.id}
              variant={i === selectedChildIndex ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedChildIndex(i)}
            >
              {c.name}
            </Button>
          ))}
        </div>
      )}

      {/* Vaccination Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Syringe className="h-4 w-4 text-blue-500" />
            {text.vaccinations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{completedCount} {text.vaccinesDone}</span>
              <span className="font-medium">{vaccineProgress}%</span>
            </div>
            <Progress value={vaccineProgress} className="h-3" />
          </div>
          
          {/* Due vaccines */}
          {dueVaccines.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {text.due}: {dueVaccines.map(v => v.name).join(', ')}
              </p>
            </div>
          )}

          {/* Upcoming vaccines */}
          {upcomingVaccines.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">{text.upcoming}:</p>
              <div className="flex flex-wrap gap-1">
                {upcomingVaccines.map((v, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {v.name} ({v.ageLabel})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Growth Card */}
      {(child.weight || child.height) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              {text.growth}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {child.weight && (
                <div className="text-center p-3 rounded-lg bg-muted">
                  <Scale className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">{child.weight} kg</p>
                  <p className="text-xs text-muted-foreground">{text.weight}</p>
                </div>
              )}
              {child.height && (
                <div className="text-center p-3 rounded-lg bg-muted">
                  <Ruler className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">{child.height} cm</p>
                  <p className="text-xs text-muted-foreground">{text.height}</p>
                </div>
              )}
              {child.headCircumference && (
                <div className="text-center p-3 rounded-lg bg-muted">
                  <span className="text-lg">🧠</span>
                  <p className="text-lg font-bold">{child.headCircumference} cm</p>
                  <p className="text-xs text-muted-foreground">{text.headCircumference}</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                {text.normal}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Development Milestones */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            {text.developmentMilestones}
          </CardTitle>
          <CardDescription>
            {nearestMilestoneAge} {text.months}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Can do */}
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {text.canDo}:
            </p>
            <div className="flex flex-wrap gap-1">
              {milestones.canDo.map((item, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Watch for */}
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              {text.watchFor}:
            </p>
            <div className="flex flex-wrap gap-1">
              {milestones.watchFor.map((item, i) => (
                <Badge key={i} variant="outline" className="text-xs border-orange-300 text-orange-700">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
            <p className="text-sm font-medium mb-2">💡 {text.tipsForAge}:</p>
            <ul className="space-y-1">
              {milestones.tips.map((tip, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Schedule Vaccination</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
          <Activity className="h-5 w-5" />
          <span className="text-xs">Record Growth</span>
        </Button>
      </div>
    </div>
  );
}
