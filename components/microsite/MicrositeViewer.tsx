import React from 'react';
import { MicrositeConfig } from '../../types';
import { 
  Link, Instagram, Twitter, Facebook, Youtube, Github, Linkedin, Mail, Phone, ExternalLink, Download, FileText, Image as ImageIcon, Video, ShoppingBag
} from 'lucide-react';

interface MicrositeViewerProps {
  data: MicrositeConfig;
}

const ICONS = {
  link: Link,
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  phone: Phone,
  file: FileText,
  download: Download,
  image: ImageIcon,
  video: Video,
  'shopping-bag': ShoppingBag
};

export const MicrositeViewer: React.FC<MicrositeViewerProps> = ({ data }) => {
  if (!data) return <div className="min-h-screen flex items-center justify-center text-slate-500">Invalid Page Data</div>;

  const buttonRadius = 
    data.buttonStyle === 'pill' ? 'rounded-full' : 
    data.buttonStyle === 'rounded' ? 'rounded-lg' : 'rounded-none';

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 transition-colors duration-300"
         style={{ backgroundColor: data.themeColor }}>
      
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Header Profile */}
        <div className="flex flex-col items-center text-center space-y-4">
          {data.imageUrl ? (
            <img 
              src={data.imageUrl} 
              alt={data.title} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl">
              👤
            </div>
          )}
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white break-words">{data.title}</h1>
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{data.description}</p>
          </div>
        </div>

        {/* Content Items */}
        <div className="space-y-4 w-full">
          {data.links.map((item) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS] || Link;
            
            // Render Image Embed
            if (item.type === 'image') {
              return (
                <div key={item.id} className="w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <img src={item.url} alt="Embed" className="w-full h-auto object-cover" loading="lazy" />
                </div>
              );
            }

            // Render Video Embed
            if (item.type === 'video') {
               return (
                <div key={item.id} className="w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-black">
                  <video src={item.url} controls className="w-full h-auto" />
                </div>
              );
            }

            // Render Product Card
            if (item.type === 'product') {
               return (
                <div key={item.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-row h-32">
                        {/* Product Image */}
                        <div className="w-1/3 bg-slate-50 dark:bg-slate-700 relative">
                             {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.label} className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                             )}
                        </div>
                        {/* Product Details */}
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight">{item.label}</h3>
                                {item.subLabel && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{item.subLabel}</p>}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-lg text-slate-900 dark:text-white">
                                    {item.currency}{item.price}
                                </span>
                                <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-1 font-medium"
                                >
                                    View Deal <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
               );
            }

            // Render File Download Button
            if (item.type === 'file') {
              return (
                 <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-transform shadow-sm group ${buttonRadius}`}
                >
                  <div 
                    className={`p-3 rounded-lg mr-4 text-white shrink-0 bg-slate-500`}
                  >
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.label}</div>
                    {item.subLabel && <div className="text-xs text-slate-500 dark:text-slate-400">{item.subLabel}</div>}
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </a>
              );
            }

            // Render Standard Link Button
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-transform shadow-sm group ${buttonRadius}`}
              >
                <div 
                  className={`p-2 rounded-full mr-4 text-white shrink-0`}
                  style={{ backgroundColor: data.themeColor }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-800 dark:text-slate-200 flex-1 text-left truncate">{item.label}</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              </a>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="pt-8 text-center">
            <p className="text-xs text-slate-400/80">Powered by QR Pro</p>
        </div>
      </div>
    </div>
  );
};