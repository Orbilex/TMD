import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { Palette, User, Link as LinkIcon, Save, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function CustomizationTab() {
  const { profile, updateProfile } = useCreator();
  
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [slug, setSlug] = useState(profile.slug);
  const [accentColor, setAccentColor] = useState(profile.accentColor);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const colors = [
    { name: 'Tawny (Default)', value: '#CD5700' },
    { name: 'Sunset Orange', value: '#FF7300' },
    { name: 'Deep Rust', value: '#9A3A00' },
    { name: 'Ocean Blue', value: '#0284C7' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Amethyst', value: '#7C3AED' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({ name, bio, slug, accentColor });
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Page</h1>
        <a 
          href={`/demo`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-tawny-600 bg-tawny-50 hover:bg-tawny-100 px-4 py-2 rounded-xl transition-colors"
        >
          View Live Page <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="xl:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 space-y-8 flex-1">
              
              {/* Profile Info */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-tawny-500" /> Profile Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Creator Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tawny-500 focus:border-tawny-500 outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom URL Slug</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm">
                        treatmeadonut.com/
                      </span>
                      <input 
                        type="text" 
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-tawny-500 focus:border-tawny-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea 
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tawny-500 focus:border-tawny-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Theme */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-tawny-500" /> Theme Customization
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Accent Color</label>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setAccentColor(color.value)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                          accentColor === color.value ? 'border-gray-900 scale-110 shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {accentColor === color.value && <CheckCircle2 className="w-6 h-6 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-between gap-4 mt-auto">
              <div className="text-sm text-gray-500">
                Changes will be reflected on your live page immediately.
              </div>
              <div className="flex items-center gap-4">
                {saved && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-green-600 flex items-center gap-2 font-medium text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Saved
                  </motion.span>
                )}
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-tawny-500 hover:bg-tawny-600 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-md shadow-tawny-500/20 disabled:opacity-70 flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div className="xl:col-span-5 sticky top-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-500 flex-1 flex items-center gap-2 font-mono">
                <LinkIcon className="w-3 h-3" /> treatmeadonut.com/{slug || 'your-slug'}
              </div>
            </div>
            
            <div className="p-6 bg-gray-50/50 flex-1 flex items-center justify-center min-h-[500px]">
              {/* Mini Profile Card Preview */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-sm border border-gray-100 transform transition-all duration-500 hover:scale-[1.02]">
                <div 
                  className="h-32 relative transition-colors duration-500"
                  style={{ backgroundColor: accentColor, opacity: 0.8 }}
                >
                  <img 
                    src="https://picsum.photos/seed/workspace/800/300" 
                    alt="Banner" 
                    className="w-full h-full object-cover mix-blend-overlay opacity-50"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="px-6 pb-6 relative">
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden absolute -top-10 left-6 bg-white shadow-sm">
                    <img 
                      src="https://picsum.photos/seed/avatar/200/200" 
                      alt={name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="pt-12">
                    <h3 className="text-xl font-bold mb-1 truncate">{name || 'Your Name'}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{bio || 'Your bio will appear here...'}</p>
                    
                    <div 
                      className="flex items-center gap-2 text-xs font-medium w-fit px-3 py-1.5 rounded-full mb-6 transition-colors duration-500"
                      style={{ color: accentColor, backgroundColor: `${accentColor}15` }}
                    >
                      <Heart className="w-3 h-3" />
                      <span>1,204 Supporters</span>
                    </div>

                    <div className="space-y-3">
                      <div 
                        className="w-full py-3 rounded-xl font-bold text-white text-center text-sm transition-colors duration-500 shadow-sm"
                        style={{ backgroundColor: accentColor }}
                      >
                        Support ${(2.00).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
