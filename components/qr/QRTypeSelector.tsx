import React, { useState, useEffect, useRef } from 'react';
import { QRType, QRData } from '../../types';
import { Label, Input, Textarea, Select } from '../ui/Form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Layout';
import { 
  Link, FileText, Mail, Phone, MessageSquare, Wifi, 
  Contact, MapPin, Calendar, Bitcoin,
  MessageCircle, DollarSign, Instagram, Facebook, Twitter, Youtube, Image as ImageIcon,
  LayoutTemplate, FileUp, Upload, Loader2, File as FileIcon
} from 'lucide-react';
import { MicrositeBuilder } from '../microsite/MicrositeBuilder';

interface QRTypeSelectorProps {
  data: QRData;
  onChange: (data: QRData) => void;
}

const TYPES: { type: QRType; label: string; icon: React.ReactNode }[] = [
  { type: 'url', label: 'URL', icon: <Link className="w-4 h-4" /> },
  { type: 'microsite', label: 'Page', icon: <LayoutTemplate className="w-4 h-4" /> },
  { type: 'file', label: 'File', icon: <FileUp className="w-4 h-4" /> },
  { type: 'text', label: 'Text', icon: <FileText className="w-4 h-4" /> },
  { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { type: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
  { type: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
  { type: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
  { type: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
  { type: 'vcard', label: 'vCard', icon: <Contact className="w-4 h-4" /> },
  { type: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
  { type: 'event', label: 'Event', icon: <Calendar className="w-4 h-4" /> },
  { type: 'paypal', label: 'PayPal', icon: <DollarSign className="w-4 h-4" /> },
  { type: 'crypto', label: 'Crypto', icon: <Bitcoin className="w-4 h-4" /> },
  { type: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
  { type: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
  { type: 'twitter', label: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
  { type: 'youtube', label: 'Video', icon: <Youtube className="w-4 h-4" /> },
  { type: 'image', label: 'Photo', icon: <ImageIcon className="w-4 h-4" /> },
];

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ data, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state to manage form fields before composing final content string
  const [fields, setFields] = useState<Record<string, string>>({
    url: 'https://example.com',
    text: 'Hello World',
    email: '', subject: '', body: '',
    phone: '',
    smsPhone: '', smsMessage: '',
    ssid: '', password: '', encryption: 'WPA',
    vFirstName: '', vLastName: '', vPhone: '', vEmail: '', vOrg: '', vUrl: '',
    lat: '', lng: '',
    eventTitle: '', eventLocation: '', eventStart: '', eventEnd: '',
    cryptoAddress: '', cryptoAmount: '', cryptoType: 'bitcoin',
    whatsappPhone: '', whatsappMessage: '',
    paypalId: '', paypalAmount: '',
    instagramUser: '', facebookUser: '', twitterUser: '',
    videoUrl: '', imageUrl: '',
    fileUrl: '', fileName: ''
  });

  const updateField = (key: string, value: string) => {
    const newFields = { ...fields, [key]: value };
    setFields(newFields);
    generateContent(data.type, newFields);
  };

  const handleTypeChange = (newType: QRType) => {
    // Reset specific fields if needed, or just switch type
    if (newType !== 'microsite') {
      generateContent(newType, fields);
    } else {
      onChange({ type: newType, content: '' }); // Content will be set by the Builder component
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Update local state for UI
      updateField('fileName', file.name);

      // Upload to file.io (free, ephemeral hosting for demo)
      // In production, you'd replace this with S3/Cloudinary/etc.
      const response = await fetch('https://file.io?expires=1w', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        updateField('fileUrl', result.link);
      } else {
        alert('Upload failed. Please try again.');
        updateField('fileName', '');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Upload failed. Check your connection.');
      updateField('fileName', '');
    } finally {
      setIsUploading(false);
    }
  };

  const generateContent = (type: QRType, currentFields: Record<string, string>) => {
    let content = '';
    switch (type) {
      case 'url': content = currentFields.url; break;
      case 'text': content = currentFields.text; break;
      case 'email': content = `mailto:${currentFields.email}?subject=${encodeURIComponent(currentFields.subject)}&body=${encodeURIComponent(currentFields.body)}`; break;
      case 'phone': content = `tel:${currentFields.phone}`; break;
      case 'sms': content = `SMSTO:${currentFields.smsPhone}:${currentFields.smsMessage}`; break;
      case 'wifi': content = `WIFI:T:${currentFields.encryption};S:${currentFields.ssid};P:${currentFields.password};;`; break;
      case 'location': content = `geo:${currentFields.lat},${currentFields.lng}`; break;
      case 'crypto': content = `${currentFields.cryptoType}:${currentFields.cryptoAddress}?amount=${currentFields.cryptoAmount}`; break;
      case 'vcard':
        content = `BEGIN:VCARD\nVERSION:3.0\nN:${currentFields.vLastName};${currentFields.vFirstName}\nFN:${currentFields.vFirstName} ${currentFields.vLastName}\nORG:${currentFields.vOrg}\nTEL:${currentFields.vPhone}\nEMAIL:${currentFields.vEmail}\nURL:${currentFields.vUrl}\nEND:VCARD`;
        break;
      case 'event':
        content = `BEGIN:VEVENT\nSUMMARY:${currentFields.eventTitle}\nLOCATION:${currentFields.eventLocation}\nDTSTART:${currentFields.eventStart.replace(/[-:]/g, '')}\nDTEND:${currentFields.eventEnd.replace(/[-:]/g, '')}\nEND:VEVENT`;
        break;
      case 'whatsapp':
        content = `https://wa.me/${currentFields.whatsappPhone.replace(/[^0-9]/g, '')}`;
        if (currentFields.whatsappMessage) content += `?text=${encodeURIComponent(currentFields.whatsappMessage)}`;
        break;
      case 'paypal':
        content = `https://paypal.me/${currentFields.paypalId}`;
        if (currentFields.paypalAmount) content += `/${currentFields.paypalAmount}`;
        break;
      case 'instagram': content = `https://instagram.com/${currentFields.instagramUser.replace('@', '')}`; break;
      case 'facebook': content = `https://facebook.com/${currentFields.facebookUser}`; break;
      case 'twitter': content = `https://x.com/${currentFields.twitterUser.replace('@', '')}`; break;
      case 'youtube': content = currentFields.videoUrl || 'https://youtube.com'; break;
      case 'image': content = currentFields.imageUrl || 'https://'; break;
      case 'file': content = currentFields.fileUrl || ''; break;
    }
    onChange({ type, content });
  };

  // Trigger content generation on mount if not microsite
  useEffect(() => {
    if (data.type !== 'microsite') {
      generateContent(data.type, fields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.type}
              onClick={() => handleTypeChange(t.type)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-xs gap-2
                ${data.type === t.type 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-500/50' 
                  : 'border-slate-200 hover:border-indigo-300 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:border-slate-700'
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Dynamic Inputs */}
        <div className="space-y-4">
          
          {/* SPECIAL MICROSITE BUILDER */}
          {data.type === 'microsite' && (
             <MicrositeBuilder onChange={(url) => onChange({ type: 'microsite', content: url })} />
          )}

          {data.type === 'file' && (
            <div className="space-y-4">
               <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                     {isUploading ? (
                       <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                     ) : (
                       <Upload className="w-6 h-6 text-indigo-600" />
                     )}
                  </div>
                  <div className="space-y-1">
                     <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {isUploading ? "Uploading..." : "Click to upload a file"}
                     </p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">
                        PDF, MP3, Video, Images (Max 100MB)
                     </p>
                  </div>
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    Select File
                  </button>
               </div>

               {fields.fileName && (
                 <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <FileIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800 dark:text-green-300 font-medium truncate flex-1">
                      {fields.fileName}
                    </span>
                    <span className="text-xs text-green-600 uppercase">Uploaded</span>
                 </div>
               )}

               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or paste URL</span>
                  </div>
               </div>

               <div className="space-y-2">
                 <Label>Direct File Link</Label>
                 <Input 
                   placeholder="https://example.com/file.pdf" 
                   value={fields.fileUrl} 
                   onChange={(e) => updateField('fileUrl', e.target.value)} 
                 />
                 <p className="text-xs text-slate-500 dark:text-slate-400">
                   Note: Uploaded files are hosted on file.io and are ephemeral. For permanent hosting, use Google Drive or Dropbox links.
                 </p>
               </div>
            </div>
          )}

          {data.type === 'url' && (
             <div className="space-y-2">
              <Label>Website URL</Label>
              <Input placeholder="https://example.com" value={fields.url} onChange={(e) => updateField('url', e.target.value)} />
            </div>
          )}

          {data.type === 'text' && (
            <div className="space-y-2">
              <Label>Plain Text</Label>
              <Textarea placeholder="Enter your text here..." value={fields.text} onChange={(e) => updateField('text', e.target.value)} />
            </div>
          )}

          {data.type === 'email' && (
            <>
              <Input placeholder="Email Address" value={fields.email} onChange={(e) => updateField('email', e.target.value)} />
              <Input placeholder="Subject" value={fields.subject} onChange={(e) => updateField('subject', e.target.value)} />
              <Textarea placeholder="Message Body" value={fields.body} onChange={(e) => updateField('body', e.target.value)} />
            </>
          )}

          {data.type === 'phone' && (
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+1 234 567 8900" value={fields.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
          )}

           {data.type === 'sms' && (
            <>
              <Input type="tel" placeholder="Phone Number" value={fields.smsPhone} onChange={(e) => updateField('smsPhone', e.target.value)} />
              <Textarea placeholder="Message" value={fields.smsMessage} onChange={(e) => updateField('smsMessage', e.target.value)} />
            </>
          )}

          {data.type === 'whatsapp' && (
            <>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input type="tel" placeholder="+1 234 567 8900" value={fields.whatsappPhone} onChange={(e) => updateField('whatsappPhone', e.target.value)} />
                <p className="text-xs text-slate-500 dark:text-slate-400">Include country code.</p>
              </div>
              <div className="space-y-2">
                <Label>Message (Optional)</Label>
                <Textarea placeholder="Hello! I'm interested..." value={fields.whatsappMessage} onChange={(e) => updateField('whatsappMessage', e.target.value)} />
              </div>
            </>
          )}

          {data.type === 'wifi' && (
            <>
              <div className="space-y-2">
                <Label>Network Name (SSID)</Label>
                <Input placeholder="WiFi Name" value={fields.ssid} onChange={(e) => updateField('ssid', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Password" value={fields.password} onChange={(e) => updateField('password', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Encryption</Label>
                <Select value={fields.encryption} onChange={(e) => updateField('encryption', e.target.value)}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Encryption</option>
                </Select>
              </div>
            </>
          )}

          {data.type === 'vcard' && (
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First Name" value={fields.vFirstName} onChange={(e) => updateField('vFirstName', e.target.value)} />
              <Input placeholder="Last Name" value={fields.vLastName} onChange={(e) => updateField('vLastName', e.target.value)} />
              <Input className="col-span-2" placeholder="Phone" value={fields.vPhone} onChange={(e) => updateField('vPhone', e.target.value)} />
              <Input className="col-span-2" placeholder="Email" value={fields.vEmail} onChange={(e) => updateField('vEmail', e.target.value)} />
              <Input className="col-span-2" placeholder="Organization" value={fields.vOrg} onChange={(e) => updateField('vOrg', e.target.value)} />
              <Input className="col-span-2" placeholder="Website" value={fields.vUrl} onChange={(e) => updateField('vUrl', e.target.value)} />
            </div>
          )}

          {data.type === 'location' && (
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Latitude" value={fields.lat} onChange={(e) => updateField('lat', e.target.value)} />
              <Input placeholder="Longitude" value={fields.lng} onChange={(e) => updateField('lng', e.target.value)} />
            </div>
          )}

          {data.type === 'event' && (
            <div className="space-y-3">
              <Input placeholder="Event Title" value={fields.eventTitle} onChange={(e) => updateField('eventTitle', e.target.value)} />
              <Input placeholder="Location" value={fields.eventLocation} onChange={(e) => updateField('eventLocation', e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Start</Label>
                  <Input type="datetime-local" value={fields.eventStart} onChange={(e) => updateField('eventStart', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End</Label>
                  <Input type="datetime-local" value={fields.eventEnd} onChange={(e) => updateField('eventEnd', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {data.type === 'paypal' && (
             <div className="space-y-2">
              <Label>PayPal Username</Label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono">paypal.me/</span>
                <Input placeholder="username" value={fields.paypalId} onChange={(e) => updateField('paypalId', e.target.value)} />
              </div>
              <Label className="mt-2 block">Amount (Optional)</Label>
              <Input type="number" placeholder="0.00" value={fields.paypalAmount} onChange={(e) => updateField('paypalAmount', e.target.value)} />
            </div>
          )}

          {data.type === 'crypto' && (
            <>
               <Select value={fields.cryptoType} onChange={(e) => updateField('cryptoType', e.target.value)}>
                  <option value="bitcoin">Bitcoin</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="litecoin">Litecoin</option>
                </Select>
              <Input placeholder="Wallet Address" value={fields.cryptoAddress} onChange={(e) => updateField('cryptoAddress', e.target.value)} />
              <Input type="number" placeholder="Amount" value={fields.cryptoAmount} onChange={(e) => updateField('cryptoAmount', e.target.value)} />
            </>
          )}

          {data.type === 'instagram' && (
            <div className="space-y-2">
              <Label>Instagram Username</Label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">@</span>
                <Input placeholder="username" value={fields.instagramUser} onChange={(e) => updateField('instagramUser', e.target.value)} />
              </div>
            </div>
          )}

          {data.type === 'facebook' && (
            <div className="space-y-2">
              <Label>Facebook Profile / Page</Label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-xs">facebook.com/</span>
                <Input placeholder="username" value={fields.facebookUser} onChange={(e) => updateField('facebookUser', e.target.value)} />
              </div>
            </div>
          )}

          {data.type === 'twitter' && (
            <div className="space-y-2">
              <Label>X (Twitter) Username</Label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">@</span>
                <Input placeholder="username" value={fields.twitterUser} onChange={(e) => updateField('twitterUser', e.target.value)} />
              </div>
            </div>
          )}

          {data.type === 'youtube' && (
            <div className="space-y-2">
              <Label>YouTube Video or Channel URL</Label>
              <Input placeholder="https://youtube.com/watch?v=..." value={fields.videoUrl} onChange={(e) => updateField('videoUrl', e.target.value)} />
              <p className="text-xs text-slate-500 dark:text-slate-400">Paste the full link to the video you want to share.</p>
            </div>
          )}

          {data.type === 'image' && (
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input placeholder="https://example.com/image.jpg" value={fields.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} />
               <p className="text-xs text-slate-500 dark:text-slate-400">
                Link to an image hosted online (Google Photos, Imgur, your website). 
                <br/>QR codes cannot store actual image files directly.
              </p>
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  );
};