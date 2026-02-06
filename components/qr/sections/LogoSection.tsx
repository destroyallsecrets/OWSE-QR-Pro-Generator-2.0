import React, { useRef } from 'react';
import { QRCustomOptions } from '../../../types';
import { Label, Slider, Switch, Input } from '../../ui/Form';
import { Button } from '../../ui/Layout';
import { Upload, X } from 'lucide-react';

interface LogoSectionProps {
  options: QRCustomOptions;
  onChange: (options: QRCustomOptions) => void;
}

export const LogoSection: React.FC<LogoSectionProps> = ({ options, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({ ...options, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange({ ...options, logoUrl: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (key: keyof QRCustomOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Upload Logo</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
             <Input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="cursor-pointer file:cursor-pointer file:text-indigo-600 file:hover:text-indigo-700 dark:file:text-indigo-400 dark:file:hover:text-indigo-300"
            />
          </div>
          {options.logoUrl && (
            <Button variant="outline" size="icon" onClick={removeLogo} title="Remove Logo">
              <X className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Recommended: Transparent PNG or SVG.
        </p>
      </div>

      {options.logoUrl && (
        <>
          <div className="flex justify-center p-4 bg-slate-50 border border-slate-200 rounded-lg dark:bg-slate-800 dark:border-slate-700">
            <img src={options.logoUrl} alt="Logo Preview" className="h-16 object-contain" />
          </div>

          <Slider 
            label="Logo Size" 
            min={0.1} 
            max={0.4} 
            step={0.05} 
            value={options.logoSize} 
            onChange={(e) => handleChange('logoSize', Number(e.target.value))}
            valueDisplay={`${Math.round(options.logoSize * 100)}%`}
          />

           <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-900/50 dark:text-yellow-500">
             ⚠️ Large logos may make the QR code unscannable. Test before printing.
           </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center justify-between">
                <Label>Remove Dots Behind Logo</Label>
                <Switch 
                  checked={options.hideBackgroundDots} 
                  onChange={(e) => handleChange('hideBackgroundDots', e.target.checked)} 
                />
             </div>
             <p className="text-xs text-slate-500 dark:text-slate-400">Cleaner look for transparent logos.</p>
          </div>
        </>
      )}
    </div>
  );
};