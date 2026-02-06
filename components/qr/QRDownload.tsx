import React, { useState } from 'react';
import { Button, Card, CardContent } from '../ui/Layout';
import { Download, Copy, Check } from 'lucide-react';
import { QRPreviewHandle } from './QRPreview';

interface QRDownloadProps {
  qrRef: React.RefObject<QRPreviewHandle>;
}

export const QRDownload: React.FC<QRDownloadProps> = ({ qrRef }) => {
  const [copied, setCopied] = useState(false);

  const handleDownload = (format: 'png' | 'svg' | 'jpeg' | 'webp') => {
    qrRef.current?.download(format);
  };

  const handleCopy = async () => {
    try {
      const blob = await qrRef.current?.getRawData();
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
      alert('Clipboard copy failed. Try downloading instead.');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button variant="outline" onClick={() => handleDownload('png')}>PNG</Button>
          <Button variant="outline" onClick={() => handleDownload('svg')}>SVG</Button>
          <Button variant="outline" onClick={() => handleDownload('jpeg')}>JPEG</Button>
          <Button variant="outline" onClick={() => handleDownload('webp')}>WEBP</Button>
        </div>
        <Button className="w-full" onClick={handleCopy}>
          {copied ? <Check className="mr-2 w-4 h-4" /> : <Copy className="mr-2 w-4 h-4" />}
          {copied ? 'Copied to Clipboard' : 'Copy Image'}
        </Button>
      </CardContent>
    </Card>
  );
};
