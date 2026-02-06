import React from 'react';
import { QRCustomOptions } from '../../../types';
import { Label, Select, Input } from '../../ui/Form';

interface StyleSectionProps {
  options: QRCustomOptions;
  onChange: (options: QRCustomOptions) => void;
}

export const StyleSection: React.FC<StyleSectionProps> = ({ options, onChange }) => {
  const handleChange = (key: keyof QRCustomOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Dots Pattern Style</Label>
        <Select value={options.dotStyle} onChange={(e) => handleChange('dotStyle', e.target.value)}>
          <option value="square">Square</option>
          <option value="rounded">Rounded</option>
          <option value="dots">Dots</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
        </Select>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Label className="text-base text-slate-800 dark:text-slate-200">Corners</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Square Style</Label>
            <Select 
              value={options.cornerSquareStyle} 
              onChange={(e) => handleChange('cornerSquareStyle', e.target.value)}
            >
              <option value="square">Square</option>
              <option value="dot">Dot</option>
              <option value="extra-rounded">Extra Rounded</option>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Square Color</Label>
             <div className="flex items-center gap-2">
              <div className="relative w-10 h-9">
                  <Input 
                    type="color" 
                    value={options.cornerSquareColor} 
                    onChange={(e) => handleChange('cornerSquareColor', e.target.value)} 
                    className="absolute inset-0 w-full h-full p-0 border-0 opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="w-full h-full rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                    style={{ backgroundColor: options.cornerSquareColor }}
                  />
              </div>
              <Input 
                value={options.cornerSquareColor} 
                onChange={(e) => handleChange('cornerSquareColor', e.target.value)} 
                className="font-mono"
              />
             </div>
          </div>

          <div className="space-y-2">
            <Label>Inner Dot Style</Label>
            <Select 
              value={options.cornerDotStyle} 
              onChange={(e) => handleChange('cornerDotStyle', e.target.value)}
            >
              <option value="square">Square</option>
              <option value="dot">Dot</option>
            </Select>
          </div>

           <div className="space-y-2">
            <Label>Inner Dot Color</Label>
             <div className="flex items-center gap-2">
              <div className="relative w-10 h-9">
                  <Input 
                    type="color" 
                    value={options.cornerDotColor} 
                    onChange={(e) => handleChange('cornerDotColor', e.target.value)} 
                    className="absolute inset-0 w-full h-full p-0 border-0 opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="w-full h-full rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                    style={{ backgroundColor: options.cornerDotColor }}
                  />
              </div>
              <Input 
                value={options.cornerDotColor} 
                onChange={(e) => handleChange('cornerDotColor', e.target.value)} 
                className="font-mono"
              />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};