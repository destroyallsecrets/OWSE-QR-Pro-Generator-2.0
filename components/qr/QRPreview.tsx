import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { QRCustomOptions } from '../../types';

interface QRPreviewProps {
  content: string;
  options: QRCustomOptions;
}

export interface QRPreviewHandle {
  download: (format: 'png' | 'jpeg' | 'webp' | 'svg') => void;
  getRawData: () => Promise<Blob | null>;
}

export const QRPreview = forwardRef<QRPreviewHandle, QRPreviewProps>(({ content, options }, ref) => {
  const qrCode = useRef<QRCodeStyling>();
  const refContainer = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    download: (format) => {
      qrCode.current?.download({
        name: 'qr-code',
        extension: format
      });
    },
    getRawData: async () => {
      return await qrCode.current?.getRawData('png') || null;
    }
  }));

  useEffect(() => {
    // Initialize standard options
    const qrOptions: Options = {
      width: options.width,
      height: options.width,
      data: content,
      margin: options.margin,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: options.errorCorrectionLevel
      },
      imageOptions: {
        hideBackgroundDots: options.hideBackgroundDots,
        imageSize: options.logoSize,
        margin: options.logoMargin,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        type: options.dotStyle,
        color: options.color,
        gradient: options.gradient ? {
          type: options.gradientType,
          rotation: (options.gradientRotation * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: options.gradientColor1 },
            { offset: 1, color: options.gradientColor2 }
          ]
        } : undefined
      },
      backgroundOptions: {
        color: options.backgroundColor,
      },
      image: options.logoUrl,
      cornersSquareOptions: {
        type: options.cornerSquareStyle,
        color: options.cornerSquareColor || options.color
      },
      cornersDotOptions: {
        type: options.cornerDotStyle,
        color: options.cornerDotColor || options.color
      },
    };

    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(qrOptions);
      if (refContainer.current) {
        qrCode.current.append(refContainer.current);
      }
    } else {
      qrCode.current.update(qrOptions);
    }
  }, [content, options]);

  return (
    <div className="flex items-center justify-center p-8 bg-slate-100 rounded-xl border border-slate-200 shadow-inner dark:bg-slate-900/50 dark:border-slate-800">
      <div ref={refContainer} className="overflow-hidden rounded-lg shadow-sm bg-white" />
    </div>
  );
});

QRPreview.displayName = "QRPreview";