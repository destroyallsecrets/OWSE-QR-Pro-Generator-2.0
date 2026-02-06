import React from 'react';
import { QRCustomOptions } from '../../../types';
import { Label, Select, Slider } from '../../ui/Form';

interface SettingsSectionProps {
  options: QRCustomOptions;
  onChange: (options: QRCustomOptions) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ options, onChange }) => {
  const handleChange = (key: keyof QRCustomOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Error Correction Level</Label>
        <Select 
          value={options.errorCorrectionLevel} 
          onChange={(e) => handleChange('errorCorrectionLevel', e.target.value)}
        >
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </Select>
        <p className="text-xs text-slate-500">Higher levels allow for more damage/logos but are denser.</p>
      </div>

      <Slider 
        label="Margin (Quiet Zone)" 
        min={0} 
        max={50} 
        step={1} 
        value={options.margin} 
        onChange={(e) => handleChange('margin', Number(e.target.value))}
        valueDisplay={`${options.margin}px`}
      />

       <Slider 
        label="Download Size (Width)" 
        min={256} 
        max={2048} 
        step={64} 
        value={options.width} 
        onChange={(e) => handleChange('width', Number(e.target.value))}
        valueDisplay={`${options.width}px`}
      />
    </div>
  );
};
