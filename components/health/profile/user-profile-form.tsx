'use client';

import { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Phone,
  Baby,
  Heart,
  Save,
  Languages,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useHealthPlatform } from '../health-platform-provider';
import type { SupportedLanguage, UserRole } from '@/lib/health-platform';

// Localized strings
const PROFILE_TEXT: Record<SupportedLanguage, {
  title: string;
  subtitle: string;
  personalInfo: string;
  healthInfo: string;
  preferences: string;
  name: string;
  phone: string;
  region: string;
  district: string;
  village: string;
  isPregnant: string;
  pregnancyWeeks: string;
  hasChildren: string;
  numberOfChildren: string;
  childAges: string;
  childAgesPlaceholder: string;
  preferredLanguage: string;
  role: string;
  voiceOutput: string;
  saveProfile: string;
  saving: string;
  saved: string;
  lastUpdated: string;
  completeProfile: string;
  profileComplete: string;
  languages: Record<SupportedLanguage, string>;
  roles: Record<UserRole, string>;
}> = {
  en: {
    title: 'Health Profile',
    subtitle: 'Your personalized health information',
    personalInfo: 'Personal Information',
    healthInfo: 'Health Information',
    preferences: 'Preferences',
    name: 'Full Name',
    phone: 'Phone Number',
    region: 'State/Region',
    district: 'District',
    village: 'Village/Town',
    isPregnant: 'Currently Pregnant',
    pregnancyWeeks: 'Weeks Pregnant',
    hasChildren: 'Have Children Under 5',
    numberOfChildren: 'Number of Children',
    childAges: 'Children Ages (years)',
    childAgesPlaceholder: 'e.g., 2, 4',
    preferredLanguage: 'Preferred Language',
    role: 'User Type',
    voiceOutput: 'Voice Responses',
    saveProfile: 'Save Profile',
    saving: 'Saving...',
    saved: 'Profile Saved!',
    lastUpdated: 'Last updated',
    completeProfile: 'Complete your profile for personalized recommendations',
    profileComplete: 'Profile complete',
    languages: { en: 'English', hi: 'Hindi', mr: 'Marathi', pa: 'Punjabi' },
    roles: { citizen: 'Citizen', asha: 'ASHA Worker', officer: 'Health Officer' },
  },
  hi: {
    title: 'स्वास्थ्य प्रोफ़ाइल',
    subtitle: 'आपकी व्यक्तिगत स्वास्थ्य जानकारी',
    personalInfo: 'व्यक्तिगत जानकारी',
    healthInfo: 'स्वास्थ्य जानकारी',
    preferences: 'प्राथमिकताएं',
    name: 'पूरा नाम',
    phone: 'फोन नंबर',
    region: 'राज्य/क्षेत्र',
    district: 'जिला',
    village: 'गांव/शहर',
    isPregnant: 'वर्तमान में गर्भवती',
    pregnancyWeeks: 'गर्भावस्था के सप्ताह',
    hasChildren: '5 वर्ष से कम के बच्चे हैं',
    numberOfChildren: 'बच्चों की संख्या',
    childAges: 'बच्चों की उम्र (वर्ष)',
    childAgesPlaceholder: 'जैसे, 2, 4',
    preferredLanguage: 'पसंदीदा भाषा',
    role: 'उपयोगकर्ता प्रकार',
    voiceOutput: 'वॉइस प्रतिक्रियाएं',
    saveProfile: 'प्रोफ़ाइल सहेजें',
    saving: 'सहेजा जा रहा है...',
    saved: 'प्रोफ़ाइल सहेजी गई!',
    lastUpdated: 'अंतिम अपडेट',
    completeProfile: 'व्यक्तिगत सिफारिशों के लिए अपनी प्रोफ़ाइल पूरी करें',
    profileComplete: 'प्रोफ़ाइल पूर्ण',
    languages: { en: 'अंग्रेज़ी', hi: 'हिन्दी', mr: 'मराठी', pa: 'पंजाबी' },
    roles: { citizen: 'नागरिक', asha: 'आशा कार्यकर्ता', officer: 'स्वास्थ्य अधिकारी' },
  },
  mr: {
    title: 'आरोग्य प्रोफाइल',
    subtitle: 'तुमची वैयक्तिक आरोग्य माहिती',
    personalInfo: 'वैयक्तिक माहिती',
    healthInfo: 'आरोग्य माहिती',
    preferences: 'प्राधान्ये',
    name: 'पूर्ण नाव',
    phone: 'फोन नंबर',
    region: 'राज्य/प्रदेश',
    district: 'जिल्हा',
    village: 'गाव/शहर',
    isPregnant: 'सध्या गर्भवती',
    pregnancyWeeks: 'गर्भधारणेचे आठवडे',
    hasChildren: '5 वर्षाखालील मुले आहेत',
    numberOfChildren: 'मुलांची संख्या',
    childAges: 'मुलांचे वय (वर्षे)',
    childAgesPlaceholder: 'उदा., 2, 4',
    preferredLanguage: 'पसंतीची भाषा',
    role: 'वापरकर्ता प्रकार',
    voiceOutput: 'व्हॉइस प्रतिसाद',
    saveProfile: 'प्रोफाइल जतन करा',
    saving: 'जतन करत आहे...',
    saved: 'प्रोफाइल जतन झाली!',
    lastUpdated: 'शेवटचे अपडेट',
    completeProfile: 'वैयक्तिक शिफारसींसाठी तुमचे प्रोफाइल पूर्ण करा',
    profileComplete: 'प्रोफाइल पूर्ण',
    languages: { en: 'इंग्रजी', hi: 'हिंदी', mr: 'मराठी', pa: 'पंजाबी' },
    roles: { citizen: 'नागरिक', asha: 'आशा कार्यकर्ता', officer: 'आरोग्य अधिकारी' },
  },
  pa: {
    title: 'ਸਿਹਤ ਪ੍ਰੋਫਾਈਲ',
    subtitle: 'ਤੁਹਾਡੀ ਨਿੱਜੀ ਸਿਹਤ ਜਾਣਕਾਰੀ',
    personalInfo: 'ਨਿੱਜੀ ਜਾਣਕਾਰੀ',
    healthInfo: 'ਸਿਹਤ ਜਾਣਕਾਰੀ',
    preferences: 'ਤਰਜੀਹਾਂ',
    name: 'ਪੂਰਾ ਨਾਮ',
    phone: 'ਫ਼ੋਨ ਨੰਬਰ',
    region: 'ਰਾਜ/ਖੇਤਰ',
    district: 'ਜ਼ਿਲ੍ਹਾ',
    village: 'ਪਿੰਡ/ਸ਼ਹਿਰ',
    isPregnant: 'ਵਰਤਮਾਨ ਵਿੱਚ ਗਰਭਵਤੀ',
    pregnancyWeeks: 'ਗਰਭ ਅਵਸਥਾ ਦੇ ਹਫ਼ਤੇ',
    hasChildren: '5 ਸਾਲ ਤੋਂ ਘੱਟ ਉਮਰ ਦੇ ਬੱਚੇ ਹਨ',
    numberOfChildren: 'ਬੱਚਿਆਂ ਦੀ ਗਿਣਤੀ',
    childAges: 'ਬੱਚਿਆਂ ਦੀ ਉਮਰ (ਸਾਲ)',
    childAgesPlaceholder: 'ਜਿਵੇਂ, 2, 4',
    preferredLanguage: 'ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ',
    role: 'ਉਪਭੋਗਤਾ ਕਿਸਮ',
    voiceOutput: 'ਵੌਇਸ ਜਵਾਬ',
    saveProfile: 'ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਕਰੋ',
    saving: 'ਸੇਵ ਹੋ ਰਿਹਾ...',
    saved: 'ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਹੋਈ!',
    lastUpdated: 'ਆਖਰੀ ਅੱਪਡੇਟ',
    completeProfile: 'ਨਿੱਜੀ ਸਿਫ਼ਾਰਸ਼ਾਂ ਲਈ ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਪੂਰੀ ਕਰੋ',
    profileComplete: 'ਪ੍ਰੋਫਾਈਲ ਪੂਰੀ',
    languages: { en: 'ਅੰਗਰੇਜ਼ੀ', hi: 'ਹਿੰਦੀ', mr: 'ਮਰਾਠੀ', pa: 'ਪੰਜਾਬੀ' },
    roles: { citizen: 'ਨਾਗਰਿਕ', asha: 'ਆਸ਼ਾ ਵਰਕਰ', officer: 'ਸਿਹਤ ਅਧਿਕਾਰੀ' },
  },
};

// Indian states for region dropdown
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export interface UserProfileData {
  name: string;
  phone: string;
  region: string;
  district: string;
  village: string;
  isPregnant: boolean;
  pregnancyWeeks: number | null;
  hasChildren: boolean;
  childrenAges: number[];
  preferredLanguage: SupportedLanguage;
  role: UserRole;
  voiceOutput: boolean;
  updatedAt?: string;
}

interface UserProfileFormProps {
  initialData?: Partial<UserProfileData>;
  onSave?: (data: UserProfileData) => Promise<void>;
}

export function UserProfileForm({ initialData, onSave }: UserProfileFormProps) {
  const { language, role, setLanguage, setRole, voiceOutputEnabled, setVoiceOutputEnabled } = useHealthPlatform();
  const text = PROFILE_TEXT[language];

  const [formData, setFormData] = useState<UserProfileData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    region: initialData?.region || '',
    district: initialData?.district || '',
    village: initialData?.village || '',
    isPregnant: initialData?.isPregnant || false,
    pregnancyWeeks: initialData?.pregnancyWeeks || null,
    hasChildren: initialData?.hasChildren || false,
    childrenAges: initialData?.childrenAges || [],
    preferredLanguage: initialData?.preferredLanguage || language,
    role: initialData?.role || role,
    voiceOutput: initialData?.voiceOutput ?? voiceOutputEnabled,
    updatedAt: initialData?.updatedAt,
  });

  const [childAgesInput, setChildAgesInput] = useState(
    formData.childrenAges.length > 0 ? formData.childrenAges.join(', ') : ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  // Load saved profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('health-user-profile');
    if (saved && !initialData) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        if (parsed.childrenAges?.length > 0) {
          setChildAgesInput(parsed.childrenAges.join(', '));
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      }
    }
  }, [initialData]);

  const handleChange = (field: keyof UserProfileData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveStatus('idle');
  };

  const handleChildAgesChange = (value: string) => {
    setChildAgesInput(value);
    const ages = value
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 0 && n <= 18);
    handleChange('childrenAges', ages);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const dataToSave = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem('health-user-profile', JSON.stringify(dataToSave));

      // Update context
      if (formData.preferredLanguage !== language) {
        setLanguage(formData.preferredLanguage);
      }
      if (formData.role !== role) {
        setRole(formData.role);
      }
      if (formData.voiceOutput !== voiceOutputEnabled) {
        setVoiceOutputEnabled(formData.voiceOutput);
      }

      // Call external save handler
      if (onSave) {
        await onSave(dataToSave);
      }

      // Also save to API
      try {
        await fetch('/api/health/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
      } catch (e) {
        console.warn('API save failed, data saved locally');
      }

      setFormData(dataToSave);
      setSaveStatus('saved');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate profile completion
  const completionFields = [
    formData.name,
    formData.phone,
    formData.region,
    formData.district,
  ];
  const completedFields = completionFields.filter(Boolean).length;
  const completionPercent = Math.round((completedFields / completionFields.length) * 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <User className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{text.title}</h1>
          <p className="text-sm text-muted-foreground">{text.subtitle}</p>
        </div>
        {completionPercent < 100 ? (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {completionPercent}%
          </Badge>
        ) : (
          <Badge variant="default" className="flex items-center gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            {text.profileComplete}
          </Badge>
        )}
      </div>

      {completionPercent < 100 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
          💡 {text.completeProfile}
        </div>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            {text.personalInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{text.name}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {text.phone}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {text.region}
              </Label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">{text.district}</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="Your district"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="village">{text.village}</Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) => handleChange('village', e.target.value)}
                placeholder="Your village/town"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            {text.healthInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pregnancy */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-pink-50 dark:bg-pink-950/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                🤰
              </div>
              <div>
                <Label htmlFor="isPregnant" className="font-medium">{text.isPregnant}</Label>
              </div>
            </div>
            <Switch
              id="isPregnant"
              checked={formData.isPregnant}
              onCheckedChange={(checked) => handleChange('isPregnant', checked)}
            />
          </div>

          {formData.isPregnant && (
            <div className="ml-4 pl-4 border-l-2 border-pink-200 space-y-2">
              <Label htmlFor="pregnancyWeeks">{text.pregnancyWeeks}</Label>
              <Input
                id="pregnancyWeeks"
                type="number"
                min={1}
                max={42}
                value={formData.pregnancyWeeks || ''}
                onChange={(e) => handleChange('pregnancyWeeks', parseInt(e.target.value) || null)}
                placeholder="e.g., 12"
                className="max-w-[150px]"
              />
            </div>
          )}

          <Separator />

          {/* Children */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Baby className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <Label htmlFor="hasChildren" className="font-medium">{text.hasChildren}</Label>
              </div>
            </div>
            <Switch
              id="hasChildren"
              checked={formData.hasChildren}
              onCheckedChange={(checked) => handleChange('hasChildren', checked)}
            />
          </div>

          {formData.hasChildren && (
            <div className="ml-4 pl-4 border-l-2 border-blue-200 space-y-2">
              <Label htmlFor="childAges">{text.childAges}</Label>
              <Input
                id="childAges"
                value={childAgesInput}
                onChange={(e) => handleChildAgesChange(e.target.value)}
                placeholder={text.childAgesPlaceholder}
                className="max-w-[200px]"
              />
              {formData.childrenAges.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {formData.childrenAges.map((age, i) => (
                    <Badge key={i} variant="secondary">
                      {age} {age === 1 ? 'year' : 'years'}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {text.preferences}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredLanguage" className="flex items-center gap-1">
                <Languages className="h-3 w-3" />
                {text.preferredLanguage}
              </Label>
              <select
                id="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={(e) => handleChange('preferredLanguage', e.target.value as SupportedLanguage)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {(Object.keys(text.languages) as SupportedLanguage[]).map(lang => (
                  <option key={lang} value={lang}>{text.languages[lang]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{text.role}</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value as UserRole)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {(Object.keys(text.roles) as UserRole[]).map(r => (
                  <option key={r} value={r}>{text.roles[r]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <Label htmlFor="voiceOutput" className="font-medium">{text.voiceOutput}</Label>
              <p className="text-xs text-muted-foreground">Enable voice responses</p>
            </div>
            <Switch
              id="voiceOutput"
              checked={formData.voiceOutput}
              onCheckedChange={(checked) => handleChange('voiceOutput', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        {formData.updatedAt && (
          <p className="text-xs text-muted-foreground">
            {text.lastUpdated}: {new Date(formData.updatedAt).toLocaleDateString()}
          </p>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto"
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              {text.saving}
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              {text.saved}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {text.saveProfile}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
