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
  Shield,
  Star,
  MoreVertical,
  Plus,
  X,
  Search,
  Bookmark,
  Download,
  History,
  Lock
} from 'lucide-react';

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [tabs, setTabs] = useState([
    { id: 1, title: 'Google', url: 'https://www.google.com', isActive: true }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [bookmarks, setBookmarks] = useState([
    'https://www.google.com',
    'https://www.github.com',
    'https://www.stackoverflow.com',
    'https://www.youtube.com'
  ]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigateToUrl = (newUrl: string) => {
    setIsLoading(true);
    setCurrentUrl(newUrl);
    setUrl(newUrl);
    
    // تحديث التاريخ
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // تحديث التبويب النشط
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, url: newUrl, title: getDomainFromUrl(newUrl) }
        : tab
    ));
    
    setTimeout(() => setIsLoading(false), 1000);
  };

  const navigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const newUrl = history[newIndex];
      setUrl(newUrl);
      setCurrentUrl(newUrl);
    }
  };

  const navigateForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const newUrl = history[newIndex];
      setUrl(newUrl);
      setCurrentUrl(newUrl);
    }
  };

  const refreshPage = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const navigateHome = () => {
    navigateToUrl('https://www.google.com');
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url;
    
    // إضافة https إذا لم يكن موجوداً
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.')) {
        finalUrl = 'https://' + url;
      } else {
        // البحث في Google إذا لم يكن URL
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    
    navigateToUrl(finalUrl);
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'صفحة جديدة';
    }
  };

  const addNewTab = () => {
    const newTab = {
      id: Date.now(),
      title: 'تبويب جديد',
      url: 'https://www.google.com',
      isActive: false
    };
    setTabs(prev => [...prev, newTab]);
    switchToTab(newTab.id);
  };

  const closeTab = (tabId: number) => {
    if (tabs.length === 1) return; // لا يمكن إغلاق التبويب الأخير
    
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
        setUrl(newTabs[0].url);
        setCurrentUrl(newTabs[0].url);
      }
      return newTabs;
    });
  };

  const switchToTab = (tabId: number) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      setUrl(tab.url);
      setCurrentUrl(tab.url);
    }
  };

  const addBookmark = () => {
    if (!bookmarks.includes(currentUrl)) {
      setBookmarks(prev => [...prev, currentUrl]);
    }
  };

  const quickLinks = [
    { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '📺' },
    { name: 'GitHub', url: 'https://www.github.com', icon: '💻' },
    { name: 'Stack Overflow', url: 'https://www.stackoverflow.com', icon: '❓' },
    { name: 'MDN', url: 'https://developer.mozilla.org', icon: '📚' },
    { name: 'CodePen', url: 'https://codepen.io', icon: '✏️' }
  ];

  return (
    <div className={`flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* شريط التبويبات */}
      <div className="flex items-center bg-gray-100 border-b border-gray-200">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 border-r border-gray-200 cursor-pointer min-w-0 max-w-xs ${
                activeTabId === tab.id ? 'bg-white' : 'hover:bg-gray-50'
              }`}
              onClick={() => switchToTab(tab.id)}
            >
              <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm truncate flex-1">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addNewTab}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* شريط التنقل */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
        {/* أزرار التنقل */}
        <div className="flex items-center gap-1">
          <button
            onClick={navigateBack}
            disabled={historyIndex <= 0}
            className={`p-2 rounded hover:bg-gray-200 ${
              historyIndex <= 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'
            }`}
            title="السابق"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={navigateForward}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded hover:bg-gray-200 ${
              historyIndex >= history.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'
            }`}
            title="التالي"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={refreshPage}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            title="تحديث"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={navigateHome}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            title="الصفحة الرئيسية"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* شريط العنوان */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
            <div className="flex items-center gap-2">
              {currentUrl.startsWith('https://') ? (
                <Lock className="w-4 h-4 text-green-500" />
              ) : (
                <Shield className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 outline-none text-sm text-gray-700"
              placeholder="ابحث في Google أو اكتب عنوان URL"
            />
            <button type="submit" className="text-gray-400 hover:text-gray-600">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* أزرار التحكم */}
        <div className="flex items-center gap-1">
          <button
            onClick={addBookmark}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            title="إضافة إلى المفضلة"
          >
            <Star className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            title="المفضلة"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded hover:bg-gray-200 text-gray-600"
            title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button className="p-2 rounded hover:bg-gray-200 text-gray-600" title="المزيد">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* شريط المفضلة */}
      {showBookmarks && (
        <div className="bg-gray-50 border-b border-gray-200 p-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">المفضلة:</span>
            {bookmarks.map((bookmark, index) => (
              <button
                key={index}
                onClick={() => navigateToUrl(bookmark)}
                className="flex items-center gap-1 px-3 py-1 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm whitespace-nowrap"
              >
                <Globe className="w-3 h-3" />
                {getDomainFromUrl(bookmark)}
              </button>
            ))}
          </div>
        </div>
      )}

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
        
        {/* صفحة البداية */}
        {currentUrl === 'https://www.google.com' ? (
          <div className="h-full flex flex-col items-center justify-center bg-white p-8">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-light text-gray-800 mb-8">Google</h1>
              <form onSubmit={handleUrlSubmit} className="mb-8">
                <div className="flex items-center max-w-lg mx-auto bg-white border border-gray-300 rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-shadow">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    value={url === 'https://www.google.com' ? '' : url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 outline-none text-gray-700"
                    placeholder="ابحث في Google أو اكتب عنوان URL"
                  />
                </div>
              </form>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => navigateToUrl(`https://www.google.com/search?q=${encodeURIComponent(url)}`)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors"
                >
                  بحث Google
                </button>
                <button 
                  onClick={() => navigateToUrl('https://www.google.com/doodles')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors"
                >
                  ضربة حظ
                </button>
              </div>
            </div>
            
            {/* روابط سريعة */}
            <div className="w-full max-w-4xl">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">روابط سريعة</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToUrl(link.url)}
                    className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-2xl mb-2">{link.icon}</span>
                    <span className="text-sm text-gray-700">{link.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-none"
            title="محتوى المتصفح"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
            onLoad={() => setIsLoading(false)}
          />
        )}
      </div>

      {/* شريط الحالة */}
      <div className="flex items-center justify-between px-4 py-1 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>جاهز</span>
          {currentUrl.startsWith('https://') && (
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-green-500" />
              محمي
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>100%</span>
          <span>UTF-8</span>
          <span>{getDomainFromUrl(currentUrl)}</span>
        </div>
      </div>
    </div>
  );
};

export default BrowserApp;