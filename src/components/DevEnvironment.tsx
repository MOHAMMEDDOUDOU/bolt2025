import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  Code, 
  Terminal as TerminalIcon, 
  Folder,
  Play,
  Save,
  RefreshCw,
  Settings,
  Maximize2,
  Minimize2,
  X,
  Plus,
  FileText,
  Image,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface Tab {
  id: string;
  name: string;
  type: 'file' | 'preview';
  content?: string;
  filePath?: string;
}

const DevEnvironment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('welcome');
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'welcome',
      name: 'مرحباً',
      type: 'file',
      content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بيئة التطوير المتكاملة</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
            text-align: center;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            animation: fadeInUp 1s ease-out;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }
        .feature {
            background: rgba(255,255,255,0.15);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            transition: transform 0.3s ease;
        }
        .feature:hover {
            transform: translateY(-10px);
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 بيئة التطوير المتكاملة</h1>
        <div class="features">
            <div class="feature">
                <h3>💻 محرر الكود</h3>
                <p>محرر متقدم مع تمييز الأكواد</p>
            </div>
            <div class="feature">
                <h3>🌐 متصفح مدمج</h3>
                <p>معاينة مباشرة للمشروع</p>
            </div>
            <div class="feature">
                <h3>📁 مدير الملفات</h3>
                <p>إدارة شاملة للمشروع</p>
            </div>
            <div class="feature">
                <h3>⚡ Terminal</h3>
                <p>تنفيذ الأوامر مباشرة</p>
            </div>
        </div>
    </div>
</body>
</html>`
    }
  ]);

  const [projectFiles, setProjectFiles] = useState<FileNode[]>([
    {
      id: 'root',
      name: 'مشروعي',
      type: 'folder',
      children: [
        {
          id: 'index-html',
          name: 'index.html',
          type: 'file',
          content: tabs[0].content
        },
        {
          id: 'style-css',
          name: 'style.css',
          type: 'file',
          content: `/* ملف CSS للمشروع */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    margin-bottom: 2rem;
}

.card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 1rem;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
}`
        },
        {
          id: 'script-js',
          name: 'script.js',
          type: 'file',
          content: `// ملف JavaScript للمشروع
console.log('مرحباً من JavaScript!');

// دالة تهيئة التطبيق
function initApp() {
    console.log('تم تحميل التطبيق بنجاح!');
    
    // إضافة مستمعي الأحداث
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            console.log('تم النقر على زر');
        }
    });
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);

// دالة مساعدة لإنشاء عناصر HTML
function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
}`
        },
        {
          id: 'assets',
          name: 'assets',
          type: 'folder',
          children: [
            {
              id: 'images',
              name: 'images',
              type: 'folder',
              children: []
            },
            {
              id: 'css',
              name: 'css',
              type: 'folder',
              children: []
            },
            {
              id: 'js',
              name: 'js',
              type: 'folder',
              children: []
            }
          ]
        }
      ]
    }
  ]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'assets']));
  const [selectedFileId, setSelectedFileId] = useState<string>('index-html');
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  // Terminal state
  const [terminalCommands, setTerminalCommands] = useState<Array<{type: 'input' | 'output', content: string}>>([
    { type: 'output', content: '🚀 مرحباً بك في Terminal المتطور' },
    { type: 'output', content: 'اكتب "help" لعرض الأوامر المتاحة' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // إعدادات المحرر
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    theme: 'dark',
    wordWrap: true,
    lineNumbers: true
  });

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalCommands]);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? 
        <ChevronDown className="w-4 h-4 text-blue-500" /> : 
        <ChevronRight className="w-4 h-4 text-blue-500" />;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
      case 'htm':
        return <Code className="w-4 h-4 text-orange-500" />;
      case 'css':
        return <Code className="w-4 h-4 text-blue-400" />;
      case 'js':
      case 'jsx':
        return <Code className="w-4 h-4 text-yellow-500" />;
      case 'json':
        return <Settings className="w-4 h-4 text-green-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const findFileById = (files: FileNode[], id: string): FileNode | null => {
    for (const file of files) {
      if (file.id === id) return file;
      if (file.children) {
        const found = findFileById(file.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const openFile = (file: FileNode) => {
    const existingTab = tabs.find(tab => tab.id === file.id);
    if (!existingTab) {
      const newTab: Tab = {
        id: file.id,
        name: file.name,
        type: 'file',
        content: file.content || '',
        filePath: file.name
      };
      setTabs(prev => [...prev, newTab]);
    }
    setActiveTab(file.id);
    setSelectedFileId(file.id);
  };

  const closeTab = (tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        setActiveTab(remainingTabs[remainingTabs.length - 1].id);
      }
    }
  };

  const saveCurrentFile = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (activeTabData && activeTabData.type === 'file') {
      // حفظ المحتوى في ملف المشروع
      const updateFileContent = (files: FileNode[]): FileNode[] => {
        return files.map(file => {
          if (file.id === activeTab) {
            return { ...file, content: activeTabData.content };
          }
          if (file.children) {
            return { ...file, children: updateFileContent(file.children) };
          }
          return file;
        });
      };
      
      setProjectFiles(updateFileContent);
      console.log('تم حفظ الملف:', activeTabData.name);
    }
  };

  const runProject = () => {
    const indexFile = findFileById(projectFiles, 'index-html');
    if (indexFile && iframeRef.current) {
      const blob = new Blob([indexFile.content || ''], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      iframeRef.current.src = blobUrl;
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    }
  };

  const executeTerminalCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    setTerminalCommands(prev => [...prev, { type: 'input', content: `$ ${cmd}` }]);

    let output = '';
    
    switch (trimmedCmd) {
      case 'help':
        output = `الأوامر المتاحة:
  help          - عرض هذه الرسالة
  clear         - مسح الشاشة
  ls            - عرض الملفات والمجلدات
  pwd           - عرض المسار الحالي
  mkdir [name]  - إنشاء مجلد جديد
  touch [name]  - إنشاء ملف جديد
  cat [file]    - عرض محتوى الملف
  npm install   - تثبيت الحزم
  npm start     - تشغيل المشروع
  npm run build - بناء المشروع
  git status    - حالة Git
  git add .     - إضافة جميع الملفات
  git commit    - حفظ التغييرات
  code .        - فتح المشروع في المحرر`;
        break;
        
      case 'clear':
        setTerminalCommands([]);
        return;
        
      case 'ls':
        output = `index.html    style.css     script.js     assets/
package.json  README.md     .gitignore    node_modules/`;
        break;
        
      case 'pwd':
        output = '/home/user/my-project';
        break;
        
      case 'npm install':
        output = `📦 جاري تثبيت الحزم...
✅ react@18.2.0
✅ typescript@4.9.5
✅ vite@4.3.9
✅ tailwindcss@3.3.0
🎉 تم تثبيت 847 حزمة في 23.4 ثانية`;
        break;
        
      case 'npm start':
        output = `🚀 تشغيل خادم التطوير...

  Local:   http://localhost:3000/
  Network: http://192.168.1.100:3000/
  
✅ جاهز في 1.2 ثانية`;
        runProject();
        break;
        
      case 'npm run build':
        output = `🏗️  بناء المشروع للإنتاج...

✅ تم تحسين الملفات
✅ تم ضغط الصور
✅ تم تصغير CSS و JS
📦 حجم البناء: 245 KB

✨ تم البناء بنجاح في مجلد dist/`;
        break;
        
      case 'git status':
        output = `📋 حالة Git:

On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  📝 modified:   index.html
  📝 modified:   style.css
  
Untracked files:
  ➕ script.js
  ➕ assets/images/logo.png`;
        break;
        
      case 'git add .':
        output = `✅ تم إضافة جميع الملفات إلى staging area`;
        break;
        
      case 'git commit':
        output = `💾 تم حفظ التغييرات:
[main 7a8b9c2] تحديث المشروع
 3 files changed, 45 insertions(+), 12 deletions(-)`;
        break;
        
      case 'code .':
        output = `🚀 فتح المشروع في محرر الكود...`;
        break;
        
      default:
        if (trimmedCmd.startsWith('mkdir ')) {
          const folderName = cmd.substring(6);
          output = `📁 تم إنشاء المجلد: ${folderName}`;
        } else if (trimmedCmd.startsWith('touch ')) {
          const fileName = cmd.substring(6);
          output = `📄 تم إنشاء الملف: ${fileName}`;
        } else if (trimmedCmd.startsWith('cat ')) {
          const fileName = cmd.substring(4);
          const file = findFileById(projectFiles, fileName);
          if (file && file.content) {
            output = `📖 محتوى الملف ${fileName}:\n\n${file.content.substring(0, 500)}${file.content.length > 500 ? '...' : ''}`;
          } else {
            output = `❌ الملف غير موجود: ${fileName}`;
          }
        } else {
          output = `❌ الأمر غير موجود: ${cmd}
💡 اكتب "help" لعرض الأوامر المتاحة`;
        }
    }
    
    setTerminalCommands(prev => [...prev, { type: 'output', content: output }]);
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentCommand.trim()) {
        executeTerminalCommand(currentCommand);
      }
      setCurrentCommand('');
    }
  };

  const renderFileTree = (files: FileNode[], depth: number = 0) => {
    return files.map(file => (
      <div key={file.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer group ${
            selectedFileId === file.id ? 'bg-blue-600' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.id);
            } else {
              openFile(file);
            }
          }}
        >
          {getFileIcon(file)}
          <span className="text-sm text-gray-200 flex-1">{file.name}</span>
          {file.type === 'folder' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // إضافة ملف جديد
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
        
        {file.type === 'folder' && expandedFolders.has(file.id) && file.children && (
          <div>
            {renderFileTree(file.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* شريط الأدوات العلوي */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white">🚀 بيئة التطوير المتكاملة</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={saveCurrentFile}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              حفظ
            </button>
            <button
              onClick={runProject}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              تشغيل
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className={`p-2 rounded transition-colors ${
              isPreviewVisible ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            title="تبديل المعاينة"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
            className={`p-2 rounded transition-colors ${
              isTerminalVisible ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            title="تبديل Terminal"
          >
            <TerminalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* المنطقة الرئيسية */}
      <div className="flex-1 flex overflow-hidden">
        {/* مستكشف الملفات */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Folder className="w-4 h-4" />
              مستكشف الملفات
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {renderFileTree(projectFiles)}
          </div>
        </div>

        {/* منطقة المحرر والمعاينة */}
        <div className="flex-1 flex flex-col">
          {/* شريط التبويبات */}
          <div className="bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 border-r border-gray-700 cursor-pointer ${
                  activeTab === tab.id ? 'bg-gray-700' : 'hover:bg-gray-750'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="text-sm">{tab.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="hover:bg-gray-600 rounded p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* منطقة المحتوى */}
          <div className="flex-1 flex">
            {/* المحرر */}
            <div className={`${isPreviewVisible ? 'w-1/2' : 'w-full'} flex flex-col`}>
              {activeTabData && (
                <div className="flex-1 relative">
                  <textarea
                    value={activeTabData.content || ''}
                    onChange={(e) => {
                      const updatedTabs = tabs.map(tab =>
                        tab.id === activeTab ? { ...tab, content: e.target.value } : tab
                      );
                      setTabs(updatedTabs);
                    }}
                    className="w-full h-full p-4 bg-gray-900 text-green-400 font-mono text-sm border-none outline-none resize-none"
                    style={{
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      fontSize: `${editorSettings.fontSize}px`,
                      lineHeight: '1.5',
                      tabSize: 2
                    }}
                    placeholder="ابدأ الكتابة هنا..."
                    spellCheck={false}
                  />
                  
                  {/* مؤشر اللغة */}
                  <div className="absolute bottom-2 right-2 bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                    {activeTabData.name.split('.').pop()?.toUpperCase() || 'TEXT'}
                  </div>
                </div>
              )}
            </div>

            {/* المعاينة */}
            {isPreviewVisible && (
              <div className="w-1/2 border-l border-gray-700 bg-white">
                <div className="bg-gray-100 border-b border-gray-200 p-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">معاينة المشروع</span>
                  <button
                    onClick={runProject}
                    className="ml-auto p-1 hover:bg-gray-200 rounded"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-none"
                  title="معاينة المشروع"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal */}
      {isTerminalVisible && (
        <div 
          className="bg-gray-900 border-t border-gray-700"
          style={{ height: `${terminalHeight}px` }}
        >
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4" />
              <span className="text-white text-sm">Terminal</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTerminalCommands([])}
                className="text-xs px-2 py-1 hover:bg-gray-700 rounded"
              >
                مسح
              </button>
              <button 
                onClick={() => setIsTerminalVisible(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div 
            ref={terminalRef}
            className="h-full overflow-y-auto p-4 space-y-1 font-mono text-sm"
            style={{ height: `${terminalHeight - 40}px` }}
          >
            {terminalCommands.map((cmd, index) => (
              <div key={index} className={cmd.type === 'input' ? 'text-white' : 'text-green-400'}>
                <pre className="whitespace-pre-wrap">{cmd.content}</pre>
              </div>
            ))}
            
            <div className="flex items-center gap-2 text-white">
              <span className="text-green-400">$</span>
              <input
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                className="flex-1 bg-transparent outline-none text-white"
                placeholder="اكتب أمراً..."
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevEnvironment;