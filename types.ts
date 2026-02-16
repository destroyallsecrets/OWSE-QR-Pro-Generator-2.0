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
  | 'crypto'
  | 'whatsapp'
  | 'paypal'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'youtube'
  | 'image'
  | 'file'
  | 'microsite';

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

// Microsite / Page Builder Types
export type MicrositeLinkType = 'link' | 'file' | 'image' | 'video' | 'product';

export interface MicrositeLink {
  id: string;
  type: MicrositeLinkType;
  label: string;
  subLabel?: string;
  url: string;
  imageUrl?: string; // Used for product images
  price?: string;
  currency?: string;
  icon: 'link' | 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'github' | 'linkedin' | 'mail' | 'phone' | 'file' | 'image' | 'video' | 'download' | 'shopping-bag';
}

export interface MicrositeConfig {
  title: string;
  description: string;
  imageUrl: string; // URL or Base64
  themeColor: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  links: MicrositeLink[];
}