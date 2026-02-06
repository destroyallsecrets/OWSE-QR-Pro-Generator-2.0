import React from 'react';
import { QRCustomOptions } from '../../../types';
import { Label, Input, Select, Slider, Switch } from '../../ui/Form';
import { Card, CardContent } from '../../ui/Layout';
import { Check } from 'lucide-react';

interface ColorSectionProps {
  options: QRCustomOptions;
  onChange: (options: QRCustomOptions) => void;
}

const PRESET_COLORS = [
  '#000000', '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#4f46e5',
  '#be185d', '#059669', '#d97706', '#7c3aed'
];

export const ColorSection: React.FC<ColorSectionProps> = ({ options, onChange }) => {
  const handleChange = (key: keyof QRCustomOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Preset Colors */}
      <div className="space-y-2">
        <Label>Preset Colors</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleChange('color', color)}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: color }}
              title={color}
            >
              {options.color.toLowerCase() === color.toLowerCase() && (
                <Check className="w-4 h-4 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Foreground Color</Label>
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-9">
              <Input 
                type="color" 
                value={options.color} 
                onChange={(e) => handleChange('color', e.target.value)} 
                className="absolute inset-0 w-full h-full p-0 border-0 opacity-0 cursor-pointer z-10"
              />
              <div 
                className="w-full h-full rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                style={{ backgroundColor: options.color }}
              />
            </div>
            <Input 
              type="text" 
              value={options.color} 
              onChange={(e) => handleChange('color', e.target.value)}
              className="flex-1 font-mono uppercase" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-9">
              <Input 
                type="color" 
                value={options.backgroundColor} 
                onChange={(e) => handleChange('backgroundColor', e.target.value)} 
                className="absolute inset-0 w-full h-full p-0 border-0 opacity-0 cursor-pointer z-10"
              />
               <div 
                className="w-full h-full rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                style={{ backgroundColor: options.backgroundColor }}
              />
            </div>
            <Input 
              type="text" 
              value={options.backgroundColor} 
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="flex-1 font-mono uppercase" 
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center justify-between mb-4">
          <Label>Enable Gradient</Label>
          <Switch 
            checked={options.gradient} 
            onChange={(e) => handleChange('gradient', e.target.checked)} 
          />
        </div>

        {options.gradient && (
          <Card className="bg-slate-50/50 dark:bg-slate-900/50 border-dashed">
            <CardContent className="pt-6 space-y-4">
               <div className="space-y-2">
                <Label>Gradient Type</Label>
                <Select 
                  value={options.gradientType} 
                  onChange={(e) => handleChange('gradientType', e.target.value)}
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Color</Label>
                  <Input 
                    type="color" 
                    value={options.gradientColor1} 
                    onChange={(e) => handleChange('gradientColor1', e.target.value)} 
                    className="h-9 w-full p-1 cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Color</Label>
                  <Input 
                    type="color" 
                    value={options.gradientColor2} 
                    onChange={(e) => handleChange('gradientColor2', e.target.value)} 
                    className="h-9 w-full p-1 cursor-pointer"
                  />
                </div>
              </div>

              <Slider 
                label="Rotation" 
                min={0} 
                max={360} 
                value={options.gradientRotation}
                onChange={(e) => handleChange('gradientRotation', Number(e.target.value))}
                valueDisplay={`${options.gradientRotation}°`}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};