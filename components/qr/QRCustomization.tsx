import React, { useState } from 'react';
import { QRCustomOptions } from '../../types';
import { ColorSection } from './sections/ColorSection';
import { StyleSection } from './sections/StyleSection';
import { LogoSection } from './sections/LogoSection';
import { SettingsSection } from './sections/SettingsSection';
import { Card } from '../ui/Layout';
import { ChevronDown, ChevronUp, Palette, QrCode, Image as ImageIcon, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QRCustomizationProps {
  options: QRCustomOptions;
  onChange: (options: QRCustomOptions) => void;
}

export const QRCustomization: React.FC<QRCustomizationProps> = ({ options, onChange }) => {
  const [openSection, setOpenSection] = useState<string | null>('colors');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    { id: 'colors', title: 'Colors & Gradient', icon: <Palette className="w-4 h-4"/>, component: ColorSection },
    { id: 'style', title: 'Pattern & Shapes', icon: <QrCode className="w-4 h-4"/>, component: StyleSection },
    { id: 'logo', title: 'Logo', icon: <ImageIcon className="w-4 h-4"/>, component: LogoSection },
    { id: 'settings', title: 'Settings', icon: <Settings className="w-4 h-4"/>, component: SettingsSection },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.id} className="overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg dark:bg-slate-800 dark:text-indigo-400">
                {section.icon}
              </div>
              <span className="font-medium text-slate-800 dark:text-slate-200">{section.title}</span>
            </div>
            {openSection === section.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          <div 
            className={cn(
              "transition-all duration-300 ease-in-out",
              openSection === section.id ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800">
               <div className="pt-4">
                 <section.component options={options} onChange={onChange} />
               </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};