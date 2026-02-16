import React, { useState, useEffect, useRef } from 'react';
import { MicrositeConfig, MicrositeLink, MicrositeLinkType } from '../../types';
import { Label, Input, Textarea, Select } from '../ui/Form';
import { Button } from '../ui/Layout';
import { 
  Plus, Trash2, GripVertical, Smartphone, Upload, 
  Image as ImageIcon, Video, FileUp, Loader2, Link as LinkIcon, 
  AlertTriangle, ShoppingBag, DollarSign
} from 'lucide-react';
import { encodeMicrositeData } from '../../lib/utils';

interface MicrositeBuilderProps {
  onChange: (url: string) => void;
}

const DEFAULT_CONFIG: MicrositeConfig = {
  title: 'My Microshop',
  description: 'Check out my favorite products!',
  imageUrl: '',
  themeColor: '#4f46e5',
  buttonStyle: 'rounded',
  links: []
};

export const MicrositeBuilder: React.FC<MicrositeBuilderProps> = ({ onChange }) => {
  const [config, setConfig] = useState<MicrositeConfig>(DEFAULT_CONFIG);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<MicrositeLinkType | 'product-image'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlLength, setUrlLength] = useState(0);

  useEffect(() => {
    // Generate the URL whenever config changes
    const encoded = encodeMicrositeData(config);
    const fullUrl = `${window.location.origin}${window.location.pathname}?p=${encoded}`;
    setUrlLength(fullUrl.length);
    onChange(fullUrl);
  }, [config, onChange]);

  const updateConfig = (key: keyof MicrositeConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const addLink = () => {
    const newLink: MicrositeLink = {
      id: Date.now().toString(),
      type: 'link',
      label: 'New Link',
      url: '',
      icon: 'link'
    };
    setConfig(prev => ({ ...prev, links: [...prev.links, newLink] }));
  };

  const addProduct = () => {
    const newLink: MicrositeLink = {
      id: Date.now().toString(),
      type: 'product',
      label: 'Product Name',
      subLabel: 'Description...',
      url: '',
      price: '9.99',
      currency: '$',
      icon: 'shopping-bag'
    };
    setConfig(prev => ({ ...prev, links: [...prev.links, newLink] }));
  };

  const handleFileUploadTrigger = (type: MicrositeLinkType | 'product-image', targetId: string | null = null) => {
    setUploadType(type);
    setUploadTargetId(targetId);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('https://file.io?expires=1w', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      
      if (result.success) {
        if (uploadType === 'product-image' && uploadTargetId) {
            // Update specific product image
            updateLink(uploadTargetId, 'imageUrl', result.link);
        } else {
            // Add new media item
            const newLink: MicrositeLink = {
              id: Date.now().toString(),
              type: uploadType as MicrositeLinkType,
              label: uploadType === 'file' ? file.name : (uploadType === 'image' ? 'Image' : 'Video'),
              subLabel: uploadType === 'file' ? `Size: ${(file.size / (1024*1024)).toFixed(2)}MB` : undefined,
              url: result.link,
              icon: uploadType === 'file' ? 'download' : (uploadType === 'image' ? 'image' : 'video')
            };
            setConfig(prev => ({ ...prev, links: [...prev.links, newLink] }));
        }
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
      setUploadTargetId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeLink = (id: string) => {
    setConfig(prev => ({ ...prev, links: prev.links.filter(l => l.id !== id) }));
  };

  const updateLink = (id: string, key: keyof MicrositeLink, value: any) => {
    setConfig(prev => ({
      ...prev,
      links: prev.links.map(l => l.id === id ? { ...l, [key]: value } : l)
    }));
  };

  const qrCapacityColor = urlLength > 2000 ? 'text-red-600' : urlLength > 1500 ? 'text-yellow-600' : 'text-slate-500';

  return (
    <div className="space-y-6">
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg dark:bg-indigo-900/20 dark:border-indigo-800">
        <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
                <h4 className="font-medium text-indigo-900 dark:text-indigo-200">Microshop & Page Builder</h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                    Create wishlists, product pages, or link hubs. Supports embedded products from Amazon, Etsy, etc.
                </p>
                <div className={`text-xs mt-2 flex items-center gap-1 ${qrCapacityColor}`}>
                    <AlertTriangle className="w-3 h-3" />
                    QR Data Load: {urlLength} / ~2500 chars recommended
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Page Title</Label>
          <Input value={config.title} onChange={e => updateConfig('title', e.target.value)} />
        </div>
        
        <div className="space-y-2">
          <Label>Description / Bio</Label>
          <Textarea value={config.description} onChange={e => updateConfig('description', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
            <Label>Theme Color</Label>
             <div className="flex items-center gap-2">
               <Input 
                 type="color" 
                 value={config.themeColor} 
                 onChange={e => updateConfig('themeColor', e.target.value)} 
                 className="w-12 h-9 p-1 cursor-pointer"
               />
               <Input 
                 value={config.themeColor} 
                 onChange={e => updateConfig('themeColor', e.target.value)} 
                 className="flex-1 font-mono uppercase" 
               />
             </div>
          </div>
          <div className="space-y-2">
             <Label>Button Style</Label>
             <Select value={config.buttonStyle} onChange={e => updateConfig('buttonStyle', e.target.value)}>
               <option value="rounded">Rounded</option>
               <option value="pill">Pill</option>
               <option value="square">Square</option>
             </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Profile Image URL</Label>
          <Input 
            placeholder="https://..." 
            value={config.imageUrl} 
            onChange={e => updateConfig('imageUrl', e.target.value)} 
          />
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
           <Label>Page Items</Label>
           <Input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
             <Button type="button" size="sm" variant="outline" onClick={addLink} className="gap-2 justify-start">
               <LinkIcon className="w-4 h-4" /> Link
             </Button>
             <Button type="button" size="sm" variant="outline" onClick={addProduct} className="gap-2 justify-start">
               <ShoppingBag className="w-4 h-4" /> Product
             </Button>
             <Button type="button" size="sm" variant="outline" onClick={() => handleFileUploadTrigger('file')} disabled={isUploading} className="gap-2 justify-start">
               {isUploading && uploadType === 'file' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
               File
             </Button>
             <Button type="button" size="sm" variant="outline" onClick={() => handleFileUploadTrigger('image')} disabled={isUploading} className="gap-2 justify-start">
               {isUploading && uploadType === 'image' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
               Image
             </Button>
             <Button type="button" size="sm" variant="outline" onClick={() => handleFileUploadTrigger('video')} disabled={isUploading} className="gap-2 justify-start">
               {isUploading && uploadType === 'video' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
               Video
             </Button>
        </div>

        <div className="space-y-3">
          {config.links.map((link) => (
            <div key={link.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-3 group relative overflow-hidden">
               {/* Type Indicator */}
               <div className="absolute right-0 top-0 p-1 px-2 bg-slate-200 dark:bg-slate-800 rounded-bl-lg text-[10px] uppercase font-bold text-slate-500">
                  {link.type}
               </div>

              <div className="flex items-center gap-2 mt-2">
                <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                <div className="flex-1 space-y-2">
                   
                   {/* Product Specific Inputs */}
                   {link.type === 'product' && (
                     <div className="space-y-2">
                        <Input 
                            placeholder="Product Title" 
                            value={link.label} 
                            onChange={e => updateLink(link.id, 'label', e.target.value)}
                            className="bg-white dark:bg-slate-800 font-medium"
                        />
                        <div className="flex gap-2">
                             <Input 
                                placeholder="$" 
                                value={link.currency} 
                                onChange={e => updateLink(link.id, 'currency', e.target.value)}
                                className="bg-white dark:bg-slate-800 w-12 text-center"
                            />
                             <Input 
                                placeholder="Price" 
                                value={link.price} 
                                onChange={e => updateLink(link.id, 'price', e.target.value)}
                                className="bg-white dark:bg-slate-800 w-24"
                            />
                             <Input 
                                placeholder="Description" 
                                value={link.subLabel} 
                                onChange={e => updateLink(link.id, 'subLabel', e.target.value)}
                                className="bg-white dark:bg-slate-800 flex-1"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Product Image URL" 
                                value={link.imageUrl || ''} 
                                onChange={e => updateLink(link.id, 'imageUrl', e.target.value)}
                                className="bg-white dark:bg-slate-800 flex-1 text-xs"
                            />
                            <Button size="sm" variant="outline" onClick={() => handleFileUploadTrigger('product-image', link.id)}>
                                {isUploading && uploadTargetId === link.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3"/>}
                            </Button>
                        </div>
                     </div>
                   )}

                   {link.type !== 'product' && link.type !== 'image' && link.type !== 'video' && (
                     <Input 
                        placeholder={link.type === 'file' ? "File Name" : "Label"} 
                        value={link.label} 
                        onChange={e => updateLink(link.id, 'label', e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                   )}
                   {link.type === 'file' && (
                     <Input 
                        placeholder="Size / Description" 
                        value={link.subLabel || ''} 
                        onChange={e => updateLink(link.id, 'subLabel', e.target.value)}
                        className="bg-white dark:bg-slate-800 text-xs h-7"
                      />
                   )}
                </div>
                
                <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 pl-6">
                {link.type === 'link' && (
                   <Select 
                    value={link.icon} 
                    onChange={e => updateLink(link.id, 'icon', e.target.value)}
                    className="w-[140px] bg-white dark:bg-slate-800"
                  >
                    <option value="link">Link Icon</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="mail">Mail</option>
                    <option value="phone">Phone</option>
                    <option value="shopping-bag">Shop</option>
                  </Select>
                )}
                {link.type === 'product' && <div className="text-xs px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded flex items-center gap-2 text-indigo-600"><ShoppingBag className="w-3 h-3"/> Product Link</div>}
                {link.type === 'file' && <div className="text-xs px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded">File Download</div>}
                {link.type === 'image' && <div className="text-xs px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Image Embed</div>}
                {link.type === 'video' && <div className="text-xs px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded flex items-center gap-2"><Video className="w-3 h-3"/> Video Embed</div>}

                <Input 
                  placeholder={link.type === 'product' ? "Shop URL (Amazon, etc.)" : "URL (https://...)"}
                  value={link.url} 
                  onChange={e => updateLink(link.id, 'url', e.target.value)}
                  className="bg-white dark:bg-slate-800 font-mono text-xs flex-1"
                />
              </div>

              {/* Preview Thumbnail for Media/Product */}
              {((link.type === 'image' || link.type === 'video') && link.url) || (link.type === 'product' && link.imageUrl) ? (
                <div className="pl-6">
                  {link.type === 'image' || link.type === 'product' ? (
                     <img src={link.type === 'product' ? link.imageUrl : link.url} alt="Preview" className="h-16 w-auto rounded border border-slate-200 dark:border-slate-700 object-cover" />
                  ) : (
                     <div className="h-16 w-24 bg-black rounded flex items-center justify-center text-white text-xs">Video</div>
                  )}
                </div>
              ) : null}
            </div>
          ))}
          {config.links.length === 0 && (
             <p className="text-center text-sm text-slate-500 py-4">No content added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};