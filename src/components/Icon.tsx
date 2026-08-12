import React from 'react';
import {
  Sparkles,
  Activity,
  Zap,
  Heart,
  Smile,
  Layers,
  Award,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Tag,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Instagram,
  Share2,
  X,
  ExternalLink,
  Check,
  Edit3,
  Settings,
  PhoneCall,
  Navigation,
  Copy,
  Upload,
  Image as ImageIcon,
  Camera,
  Sparkle
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const iconProps = { className, size };

  switch (name) {
    case 'Sparkles':
      return <Sparkles {...iconProps} />;
    case 'Activity':
      return <Activity {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'Heart':
      return <Heart {...iconProps} />;
    case 'Smile':
      return <Smile {...iconProps} />;
    case 'Layers':
      return <Layers {...iconProps} />;
    case 'Award':
      return <Award {...iconProps} />;
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...iconProps} />;
    case 'MapPin':
      return <MapPin {...iconProps} />;
    case 'Clock':
      return <Clock {...iconProps} />;
    case 'Tag':
      return <Tag {...iconProps} />;
    case 'HelpCircle':
      return <HelpCircle {...iconProps} />;
    case 'ChevronRight':
      return <ChevronRight {...iconProps} />;
    case 'ArrowRight':
      return <ArrowRight {...iconProps} />;
    case 'MessageCircle':
      return <MessageCircle {...iconProps} />;
    case 'Instagram':
      return <Instagram {...iconProps} />;
    case 'Share2':
      return <Share2 {...iconProps} />;
    case 'X':
      return <X {...iconProps} />;
    case 'ExternalLink':
      return <ExternalLink {...iconProps} />;
    case 'Check':
      return <Check {...iconProps} />;
    case 'Edit3':
      return <Edit3 {...iconProps} />;
    case 'Settings':
      return <Settings {...iconProps} />;
    case 'PhoneCall':
      return <PhoneCall {...iconProps} />;
    case 'Navigation':
      return <Navigation {...iconProps} />;
    case 'Copy':
      return <Copy {...iconProps} />;
    case 'Upload':
      return <Upload {...iconProps} />;
    case 'Image':
      return <ImageIcon {...iconProps} />;
    case 'Camera':
      return <Camera {...iconProps} />;
    default:
      return <Sparkle {...iconProps} />;
  }
};
