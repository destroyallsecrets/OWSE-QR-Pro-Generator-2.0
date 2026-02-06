import React, { useState, useEffect } from 'react';
import { QRType, QRData } from '../../types';
import { Label, Input, Textarea, Select } from '../ui/Form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Layout';
import { 
  Link, FileText, Mail, Phone, MessageSquare, Wifi, 
  Contact, MapPin, Calendar, Bitcoin 
} from 'lucide-react';

interface QRTypeSelectorProps {
  data: QRData;
  onChange: (data: QRData) => void;
}

const TYPES: { type: QRType; label: string; icon: React.ReactNode }[] = [
  { type: 'url', label: 'URL', icon: <Link className="w-4 h-4" /> },
  { type: 'text', label: 'Text', icon: <FileText className="w-4 h-4" /> },
  { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { type: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
  { type: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
  { type: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
  { type: 'vcard', label: 'vCard', icon: <Contact className="w-4 h-4" /> },
  { type: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
  { type: 'event', label: 'Event', icon: <Calendar className="w-4 h-4" /> },
  { type: 'crypto', label: 'Crypto', icon: <Bitcoin className="w-4 h-4" /> },
];

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ data, onChange }) => {
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
    cryptoAddress: '', cryptoAmount: '', cryptoType: 'bitcoin'
  });

  const updateField = (key: string, value: string) => {
    const newFields = { ...fields, [key]: value };
    setFields(newFields);
    generateContent(data.type, newFields);
  };

  const handleTypeChange = (newType: QRType) => {
    generateContent(newType, fields);
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
        // Simple VEVENT construction
        content = `BEGIN:VEVENT\nSUMMARY:${currentFields.eventTitle}\nLOCATION:${currentFields.eventLocation}\nDTSTART:${currentFields.eventStart.replace(/[-:]/g, '')}\nDTEND:${currentFields.eventEnd.replace(/[-:]/g, '')}\nEND:VEVENT`;
        break;
    }
    onChange({ type, content });
  };

  // Trigger content generation on mount
  useEffect(() => {
    generateContent(data.type, fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
};