
import { User, MessageSquare, Bell, Settings, Shield, Lock, CreditCard, LogOut } from 'lucide-react';

export const accountNavItems = [
  { icon: User, label: "Pwofil", path: "/profile" },
  { icon: MessageSquare, label: "Mesaj", path: "/messages" },
  { icon: Bell, label: "Notifikasyon", path: "/" },
  { icon: Settings, label: "Paramèt", path: "/settings" },
  { icon: Shield, label: "Sekirite", path: "/security" },
  { icon: Lock, label: "Konfidansyalite", path: "/privacy" },
  { icon: CreditCard, label: "Metòd Peman", path: "/payment-methods" },
  { icon: LogOut, label: "Dekonekte", path: "/" },
];
