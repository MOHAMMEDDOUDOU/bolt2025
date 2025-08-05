import React, { useState, useRef, useEffect } from 'react';
import { 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Globe,
  Maximize2,
  Minimize2,
  Settings,
  Shield
} from 'lucide-react';

interface BrowserPreviewProps {
  htmlContent: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const BrowserPreview: React.FC<BrowserPreviewProps> = ({ 
  htmlContent, 
  isFullscreen, 
  onToggleFullscreen 
}) => {
  const [url, setUrl] = useState('preview://index.html');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['preview://index.html']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const refreshPreview = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      // إنشاء blob URL للمحتوى
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      iframeRef.current.src = blobUrl;
      
      // تنظيف URL السابق بعد التحميل
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    refreshPreview();
  }, [htmlContent]);

  const navigateBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setUrl(history[historyIndex - 1]);
    }
  };

  const navigateForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setUrl(history[historyIndex + 1]);
    }
  };

  const navigateHome = () => {
    setUrl('preview://index.html');
    refreshPreview();
  };

  return (
    <div className={`flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* شريط المتصفح */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b border-gray-200">
        {/* أزرار التنقل */}
        <div className="flex items-center gap-1">
          <button
            onClick={navigateBack}
            disabled={historyIndex <= 0}
            className={`p-2 rounded hover:bg-gray-200 ${
              historyIndex <= 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={navigateForward}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded hover:bg-gray-200 ${
              historyIndex >= history.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={refreshPreview}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={navigateHome}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* شريط العنوان */}
        <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-300">
          <Shield className="w-4 h-4 text-green-500" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700"
            placeholder="أدخل عنوان URL أو ابحث..."
          />
          <Globe className="w-4 h-4 text-gray-400" />
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button className="p-2 rounded hover:bg-gray-200 text-gray-600">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* شريط التبويبات */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-r border-gray-200">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Globe className="w-2 h-2 text-white" />
          </div>
          <span className="text-sm text-gray-700">معاينة المشروع</span>
          <button className="text-gray-400 hover:text-gray-600 ml-2">×</button>
        </div>
        <button className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm">+</button>
      </div>

      {/* منطقة المحتوى */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>جاري التحميل...</span>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none"
          title="معاينة المشروع"
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* شريط الحالة */}
      <div className="flex items-center justify-between px-4 py-1 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>جاهز</span>
          <span>محمي</span>
        </div>
        <div className="flex items-center gap-4">
          <span>100%</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default BrowserPreview;