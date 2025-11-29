'use client';

import { useState } from 'react';
import {
  Star,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CheckCircle,
  X,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useHealthPlatform } from '../health-platform-provider';
import type { SupportedLanguage } from '@/lib/health-platform';

// Localized strings
const FEEDBACK_TEXT: Record<SupportedLanguage, {
  title: string;
  subtitle: string;
  rateExperience: string;
  howWasChat: string;
  helpful: string;
  notHelpful: string;
  selectCategory: string;
  categories: {
    accuracy: string;
    speed: string;
    language: string;
    ease: string;
    emergency: string;
    other: string;
  };
  comments: string;
  commentsPlaceholder: string;
  submit: string;
  submitting: string;
  thankYou: string;
  feedbackReceived: string;
  close: string;
  skip: string;
  required: string;
  optional: string;
  stars: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
}> = {
  en: {
    title: 'Share Your Feedback',
    subtitle: 'Help us improve the health assistant',
    rateExperience: 'How would you rate your experience?',
    howWasChat: 'Was this conversation helpful?',
    helpful: 'Yes, helpful',
    notHelpful: 'Not helpful',
    selectCategory: 'What aspect would you like to share about?',
    categories: {
      accuracy: 'Information Accuracy',
      speed: 'Response Speed',
      language: 'Language Quality',
      ease: 'Ease of Use',
      emergency: 'Emergency Help',
      other: 'Other',
    },
    comments: 'Additional Comments',
    commentsPlaceholder: 'Tell us more about your experience...',
    submit: 'Submit Feedback',
    submitting: 'Submitting...',
    thankYou: 'Thank You!',
    feedbackReceived: 'Your feedback helps us serve the community better.',
    close: 'Close',
    skip: 'Skip',
    required: 'Required',
    optional: 'Optional',
    stars: {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    },
  },
  hi: {
    title: 'अपनी प्रतिक्रिया साझा करें',
    subtitle: 'स्वास्थ्य सहायक को बेहतर बनाने में हमारी मदद करें',
    rateExperience: 'आप अपने अनुभव को कैसे रेट करेंगे?',
    howWasChat: 'क्या यह बातचीत मददगार थी?',
    helpful: 'हाँ, मददगार',
    notHelpful: 'मददगार नहीं',
    selectCategory: 'आप किस पहलू के बारे में बताना चाहेंगे?',
    categories: {
      accuracy: 'जानकारी की सटीकता',
      speed: 'प्रतिक्रिया की गति',
      language: 'भाषा गुणवत्ता',
      ease: 'उपयोग में आसानी',
      emergency: 'आपातकालीन सहायता',
      other: 'अन्य',
    },
    comments: 'अतिरिक्त टिप्पणियाँ',
    commentsPlaceholder: 'अपने अनुभव के बारे में और बताएं...',
    submit: 'प्रतिक्रिया भेजें',
    submitting: 'भेजा जा रहा है...',
    thankYou: 'धन्यवाद!',
    feedbackReceived: 'आपकी प्रतिक्रिया हमें समुदाय की बेहतर सेवा करने में मदद करती है।',
    close: 'बंद करें',
    skip: 'छोड़ें',
    required: 'आवश्यक',
    optional: 'वैकल्पिक',
    stars: {
      1: 'खराब',
      2: 'ठीक',
      3: 'अच्छा',
      4: 'बहुत अच्छा',
      5: 'उत्कृष्ट',
    },
  },
  mr: {
    title: 'तुमचा अभिप्राय शेअर करा',
    subtitle: 'आरोग्य सहाय्यक सुधारण्यात आम्हाला मदत करा',
    rateExperience: 'तुमचा अनुभव कसा होता?',
    howWasChat: 'हे संभाषण उपयुक्त होते का?',
    helpful: 'हो, उपयुक्त',
    notHelpful: 'उपयुक्त नाही',
    selectCategory: 'तुम्हाला कोणत्या बाबतीत सांगायचे आहे?',
    categories: {
      accuracy: 'माहितीची अचूकता',
      speed: 'प्रतिसादाचा वेग',
      language: 'भाषा गुणवत्ता',
      ease: 'वापरण्यास सोपे',
      emergency: 'आणीबाणी मदत',
      other: 'इतर',
    },
    comments: 'अतिरिक्त टिप्पण्या',
    commentsPlaceholder: 'तुमच्या अनुभवाबद्दल अधिक सांगा...',
    submit: 'अभिप्राय पाठवा',
    submitting: 'पाठवत आहे...',
    thankYou: 'धन्यवाद!',
    feedbackReceived: 'तुमचा अभिप्राय आम्हाला समुदायाची चांगली सेवा करण्यास मदत करतो.',
    close: 'बंद करा',
    skip: 'वगळा',
    required: 'आवश्यक',
    optional: 'ऐच्छिक',
    stars: {
      1: 'खराब',
      2: 'बरे',
      3: 'चांगले',
      4: 'खूप चांगले',
      5: 'उत्कृष्ट',
    },
  },
  pa: {
    title: 'ਆਪਣੀ ਫੀਡਬੈਕ ਸਾਂਝੀ ਕਰੋ',
    subtitle: 'ਸਿਹਤ ਸਹਾਇਕ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ',
    rateExperience: 'ਤੁਸੀਂ ਆਪਣੇ ਤਜ਼ਰਬੇ ਨੂੰ ਕਿਵੇਂ ਰੇਟ ਕਰੋਗੇ?',
    howWasChat: 'ਕੀ ਇਹ ਗੱਲਬਾਤ ਮਦਦਗਾਰ ਸੀ?',
    helpful: 'ਹਾਂ, ਮਦਦਗਾਰ',
    notHelpful: 'ਮਦਦਗਾਰ ਨਹੀਂ',
    selectCategory: 'ਤੁਸੀਂ ਕਿਸ ਪੱਖ ਬਾਰੇ ਦੱਸਣਾ ਚਾਹੋਗੇ?',
    categories: {
      accuracy: 'ਜਾਣਕਾਰੀ ਦੀ ਸ਼ੁੱਧਤਾ',
      speed: 'ਜਵਾਬ ਦੀ ਗਤੀ',
      language: 'ਭਾਸ਼ਾ ਗੁਣਵੱਤਾ',
      ease: 'ਵਰਤਣ ਵਿੱਚ ਆਸਾਨ',
      emergency: 'ਐਮਰਜੈਂਸੀ ਮਦਦ',
      other: 'ਹੋਰ',
    },
    comments: 'ਵਾਧੂ ਟਿੱਪਣੀਆਂ',
    commentsPlaceholder: 'ਆਪਣੇ ਤਜ਼ਰਬੇ ਬਾਰੇ ਹੋਰ ਦੱਸੋ...',
    submit: 'ਫੀਡਬੈਕ ਭੇਜੋ',
    submitting: 'ਭੇਜਿਆ ਜਾ ਰਿਹਾ...',
    thankYou: 'ਧੰਨਵਾਦ!',
    feedbackReceived: 'ਤੁਹਾਡੀ ਫੀਡਬੈਕ ਸਾਨੂੰ ਭਾਈਚਾਰੇ ਦੀ ਬਿਹਤਰ ਸੇਵਾ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।',
    close: 'ਬੰਦ ਕਰੋ',
    skip: 'ਛੱਡੋ',
    required: 'ਲੋੜੀਂਦਾ',
    optional: 'ਵਿਕਲਪਿਕ',
    stars: {
      1: 'ਮਾੜਾ',
      2: 'ਠੀਕ',
      3: 'ਚੰਗਾ',
      4: 'ਬਹੁਤ ਵਧੀਆ',
      5: 'ਸ਼ਾਨਦਾਰ',
    },
  },
};

type FeedbackCategory = 'accuracy' | 'speed' | 'language' | 'ease' | 'emergency' | 'other';

interface FeedbackFormProps {
  chatId?: string;
  onSubmit?: (feedback: FeedbackData) => Promise<void>;
  onClose?: () => void;
  onSkip?: () => void;
  compact?: boolean;
}

export interface FeedbackData {
  rating: number;
  isHelpful: boolean | null;
  category: FeedbackCategory | null;
  comment: string;
  chatId?: string;
  language: SupportedLanguage;
}

// Star Rating Component
function StarRating({ 
  rating, 
  onRate, 
  labels 
}: { 
  rating: number; 
  onRate: (rating: number) => void;
  labels: Record<number, string>;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {(hoverRating || rating) > 0 && (
        <span className="text-sm text-muted-foreground">
          {labels[(hoverRating || rating) as keyof typeof labels]}
        </span>
      )}
    </div>
  );
}

export function FeedbackForm({ 
  chatId, 
  onSubmit, 
  onClose, 
  onSkip,
  compact = false,
}: FeedbackFormProps) {
  const { language } = useHealthPlatform();
  const text = FEEDBACK_TEXT[language];

  const [rating, setRating] = useState(0);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    
    const feedbackData: FeedbackData = {
      rating,
      isHelpful,
      category,
      comment,
      chatId,
      language,
    };

    try {
      if (onSubmit) {
        await onSubmit(feedbackData);
      } else {
        // Default: post to API
        await fetch('/api/health/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackData),
        });
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <Card className={compact ? '' : 'max-w-md mx-auto'}>
        <CardContent className="pt-6 text-center">
          <div className="mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">{text.thankYou}</h3>
          <p className="text-muted-foreground mb-4">{text.feedbackReceived}</p>
          {onClose && (
            <Button onClick={onClose}>{text.close}</Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? '' : 'max-w-md mx-auto'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {text.title}
            </CardTitle>
            <CardDescription>{text.subtitle}</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            {text.rateExperience}
            <Badge variant="outline" className="text-xs">{text.required}</Badge>
          </label>
          <StarRating 
            rating={rating} 
            onRate={setRating}
            labels={text.stars}
          />
        </div>

        {/* Helpful Yes/No */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{text.howWasChat}</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={isHelpful === true ? 'default' : 'outline'}
              onClick={() => setIsHelpful(true)}
              className="flex-1"
            >
              <ThumbsUp className={`h-4 w-4 mr-2 ${isHelpful === true ? 'fill-current' : ''}`} />
              {text.helpful}
            </Button>
            <Button
              type="button"
              variant={isHelpful === false ? 'destructive' : 'outline'}
              onClick={() => setIsHelpful(false)}
              className="flex-1"
            >
              <ThumbsDown className={`h-4 w-4 mr-2 ${isHelpful === false ? 'fill-current' : ''}`} />
              {text.notHelpful}
            </Button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            {text.selectCategory}
            <Badge variant="secondary" className="text-xs">{text.optional}</Badge>
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(text.categories) as FeedbackCategory[]).map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={category === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(category === cat ? null : cat)}
              >
                {text.categories[cat]}
              </Button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            {text.comments}
            <Badge variant="secondary" className="text-xs">{text.optional}</Badge>
          </label>
          <Textarea
            placeholder={text.commentsPlaceholder}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onSkip && (
            <Button variant="ghost" onClick={onSkip} className="flex-1">
              {text.skip}
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0 || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {text.submitting}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {text.submit}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact inline feedback (for chat footer)
export function InlineFeedback({ 
  onSubmit,
  chatId,
}: { 
  onSubmit?: (isHelpful: boolean) => void;
  chatId?: string;
}) {
  const { language } = useHealthPlatform();
  const text = FEEDBACK_TEXT[language];
  const [submitted, setSubmitted] = useState<boolean | null>(null);

  const handleFeedback = async (helpful: boolean) => {
    setSubmitted(helpful);
    if (onSubmit) {
      onSubmit(helpful);
    } else {
      // Post to API
      try {
        await fetch('/api/health/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating: helpful ? 5 : 2,
            isHelpful: helpful,
            chatId,
            language,
          }),
        });
      } catch (error) {
        console.error('Failed to submit feedback:', error);
      }
    }
  };

  if (submitted !== null) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span>{text.thankYou}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">{text.howWasChat}</span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback(true)}
          className="h-8 px-2"
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback(false)}
          className="h-8 px-2"
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
