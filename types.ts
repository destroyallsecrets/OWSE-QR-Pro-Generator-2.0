export type QRType = 
  | 'url' 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'wifi' 
  | 'vcard' 
  | 'location' 
  | 'event' 
  | 'crypto';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded';
export type CornerSquareStyle = 'square' | 'dot' | 'extra-rounded';
export type CornerDotStyle = 'square' | 'dot';
export type GradientType = 'linear' | 'radial';

export interface QRCustomOptions {
  // Colors
  color: string;
  backgroundColor: string;
  
  // Gradient
  gradient: boolean;
  gradientType: GradientType;
  gradientColor1: string;
  gradientColor2: string;
  gradientRotation: number;

  // Pattern
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerSquareColor: string;
  cornerDotStyle: CornerDotStyle;
  cornerDotColor: string;
  
  // Logo
  logoUrl?: string;
  logoSize: number; // 0 to 1 ratio relative to QR size, but we might use pixels in UI and convert
  logoMargin: number;
  hideBackgroundDots: boolean;

  // General
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  width: number;
}

export interface QRData {
  type: QRType;
  content: string;
}
