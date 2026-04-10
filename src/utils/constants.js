import { 
  DollarSign, GraduationCap, Users, MapPin, 
  Home, Star, Heart, Shield, Briefcase, Zap, Trophy 
} from 'lucide-react';

export const CRITERIA = [
  { id: 'cost', label: 'Financial Aid & Cost', Icon: DollarSign },
  { id: 'acad', label: 'Academic Rigor/Reputation', Icon: GraduationCap },
  { id: 'vibe', label: 'Social Scene & Culture', Icon: Users },
  { id: 'loc', label: 'Location & Lifestyle', Icon: MapPin },
  { id: 'dorm', label: 'Housing & Dorms', Icon: Home },
  { id: 'out', label: 'Career Outcomes', Icon: Briefcase },
  { id: 'safety', label: 'Campus Safety', Icon: Shield },
  { id: 'sport', label: 'Sports & Athletics', Icon: Trophy }, // Added trophy for sports
  { id: 'well', label: 'Wellness & Support', Icon: Heart },
  { id: 'tech', label: 'Tech & Facilities', Icon: Zap }
];

export const WEIGHTS = [
  { val: 1, label: 'Low' },
  { val: 2, label: 'Medium' },
  { val: 3, label: 'High' }
];

export const FIN = [
  { id: 'tuition', label: 'Tuition & Fees', c: 'cost' },
  { id: 'housing', label: 'Housing & Food', c: 'cost' },
  { id: 'books', label: 'Books & Supplies', c: 'cost' },
  { id: 'trans', label: 'Transportation', c: 'cost' },
  { id: 'grants', label: 'Grants & Scholarships', c: 'aid' },
  { id: 'faid', label: 'Financial Aid', c: 'aid' },
  { id: 'loans', label: 'Student Loans', c: 'loan' },
  { id: 'work', label: 'Work Study', c: 'aid' }
];

export const COLORS = ["#f06449", "#5bc0eb", "#9bc53d", "#c3423f", "#212d40"];
