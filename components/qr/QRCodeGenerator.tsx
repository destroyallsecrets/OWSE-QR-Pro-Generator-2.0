import React, { useState, useRef } from 'react';
import { QRData, QRCustomOptions } from '../../types';
import { QRTypeSelector } from './QRTypeSelector';
import { QRCustomization } from './QRCustomization';
import { QRPreview, QRPreviewHandle } from './QRPreview';
import { QRDownload } from './QRDownload';

export const QRCodeGenerator: React.FC = () => {
  const qrRef = useRef<QRPreviewHandle>(null);

  const [qrData, setQrData] = useState<QRData>({
    type: 'url',
    content: 'https://example.com'
  });

  const [options, setOptions] = useState<QRCustomOptions>({
    color: '#000000',
    backgroundColor: '#ffffff',
    gradient: false,
    gradientType: 'linear',
    gradientColor1: '#000000',
    gradientColor2: '#4f46e5',
    gradientRotation: 0,
    dotStyle: 'square',
    cornerSquareStyle: 'square',
    cornerSquareColor: '#000000',
    cornerDotStyle: 'square',
    cornerDotColor: '#000000',
    logoSize: 0.2,
    logoMargin: 10,
    hideBackgroundDots: true,
    errorCorrectionLevel: 'M',
    margin: 10,
    width: 300,
  });

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      
      {/* Left Column: Input & Customization */}
      <div className="lg:col-span-7 space-y-6">
        <QRTypeSelector 
          data={qrData} 
          onChange={setQrData} 
        />
        
        <QRCustomization 
          options={options} 
          onChange={setOptions} 
        />
      </div>

      {/* Right Column: Preview & Download (Sticky) */}
      <div className="lg:col-span-5 lg:sticky lg:top-8 h-fit space-y-6">
         <div className="text-center lg:text-left mb-2">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Preview</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Live preview of your design</p>
         </div>
         
         <QRPreview 
           ref={qrRef} 
           content={qrData.content} 
           options={options} 
         />

         <QRDownload qrRef={qrRef} />
      </div>

    </div>
  );
};