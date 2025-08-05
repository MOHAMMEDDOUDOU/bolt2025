import React, { useState, useEffect } from 'react';
import { Save, Play, Eye, Code2 } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
}

interface CodeEditorProps {
  file: FileNode | null;
  onSave: (fileId: string, content: string) => void;
  onPreview: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, onSave, onPreview }) => {
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setHasChanges(false);
    }
  }, [file]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (file && hasChanges) {
      onSave(file.id, content);
      setHasChanges(false);
    }
  };

  const getLanguageFromExtension = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
      case 'htm':
        return 'html';
      case 'css':
        return 'css';
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'jsx';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'tsx';
      case 'json':
        return 'json';
      default:
        return 'text';
    }
  };

  const getDefaultContent = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
      case 'htm':
        return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>صفحة جديدة</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            border-radius: 25px;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        .button:hover {
            background: white;
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>مرحباً بك!</h1>
        <p>هذه صفحة ويب جديدة تم إنشاؤها في بيئة التطوير المتكاملة</p>
        <a href="#" class="button">ابدأ الآن</a>
    </div>
    
    <script>
        console.log('تم تحميل الصفحة بنجاح!');
        
        document.querySelector('.button').addEventListener('click', function(e) {
            e.preventDefault();
            alert('مرحباً من JavaScript!');
        });
    </script>
</body>
</html>`;
      case 'css':
        return `/* ملف CSS جديد */
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

/* إضافة المزيد من الأنماط هنا */`;
      case 'js':
        return `// ملف JavaScript جديد
console.log('مرحباً من JavaScript!');

// دالة مثال
function sayHello(name) {
    return \`مرحباً \${name}!\`;
}

// استخدام الدالة
const message = sayHello('المطور');
console.log(message);`;
      default:
        return '';
    }
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">اختر ملفاً لبدء التحرير</p>
          <p className="text-sm">يمكنك إنشاء ملف جديد من مستكشف الملفات</p>
        </div>
      </div>
    );
  }

  const currentContent = content || getDefaultContent(file.name);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* شريط الأدوات */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{file.name}</span>
          {hasChanges && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
              hasChanges 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            حفظ
          </button>
          <button
            onClick={onPreview}
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            <Eye className="w-4 h-4" />
            معاينة
          </button>
        </div>
      </div>

      {/* محرر النصوص */}
      <div className="flex-1 relative">
        <textarea
          value={currentContent}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none bg-gray-900 text-green-400"
          style={{
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            tabSize: 2
          }}
          placeholder="ابدأ الكتابة هنا..."
          spellCheck={false}
        />
        
        {/* مؤشر اللغة */}
        <div className="absolute bottom-2 right-2 bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
          {getLanguageFromExtension(file.name)}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;