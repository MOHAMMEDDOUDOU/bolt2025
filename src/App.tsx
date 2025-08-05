import React, { useState } from 'react';
import { Globe, Palette, Image, Bot } from 'lucide-react';
import BrowserApp from './components/apps/BrowserApp';
import ColorPickerApp from './components/apps/ColorPickerApp';
import ImageViewerApp from './components/apps/ImageViewerApp';
import AIAssistantApp from './components/apps/AIAssistantApp';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
}

interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

function App() {
  const [activeTab, setActiveTab] = useState('browser');

  const tabs: Tab[] = [
    {
      id: 'browser',
      name: 'المتصفح',
      icon: <Globe className="w-4 h-4" />,
      component: <BrowserApp />
    },
    {
      id: 'ai-assistant',
      name: 'المساعد الذكي',
      icon: <Bot className="w-4 h-4" />,
      component: (
        <AIAssistantApp 
          currentFile={{
            id: 'index',
            name: 'index.html',
            type: 'file',
            content: ''
          }}
          onSave={() => {}}
          onPreview={() => {}}
        />
      )
    },
    {
      id: 'color-picker',
      name: 'الألوان والتدرجات',
      icon: <Palette className="w-4 h-4" />,
      component: <ColorPickerApp />
    },
    {
      id: 'image-viewer',
      name: 'عارض الصور',
      icon: <Image className="w-4 h-4" />,
      component: <ImageViewerApp />
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* شريط التبويبات العلوي */}
      <div className="bg-gray-800 border-b border-gray-700 flex items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
                }
              `}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* أزرار إضافية */}
        <div className="flex-1 flex justify-end items-center px-4">
          <div className="text-sm text-gray-400">
            بيئة التطوير المتكاملة 2025
          </div>
        </div>
      </div>

      {/* منطقة المحتوى الرئيسية */}
      <div className="flex-1 relative">
        {activeTabData && (
          <div className="h-full">
            {activeTabData.component}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;