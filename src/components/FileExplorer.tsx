import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Image, 
  Code, 
  Settings,
  Plus,
  MoreHorizontal
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  onFileCreate: (parentId: string, name: string, type: 'file' | 'folder') => void;
  selectedFileId?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  onFileSelect, 
  onFileCreate, 
  selectedFileId 
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [showCreateMenu, setShowCreateMenu] = useState<string | null>(null);

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
        <FolderOpen className="w-4 h-4 text-blue-500" /> : 
        <Folder className="w-4 h-4 text-blue-500" />;
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
      case 'ts':
      case 'tsx':
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

  const renderFileNode = (file: FileNode, depth: number = 0) => {
    const isSelected = file.id === selectedFileId;
    const isExpanded = expandedFolders.has(file.id);

    return (
      <div key={file.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer group ${
            isSelected ? 'bg-blue-100 border-r-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.id);
            } else {
              onFileSelect(file);
            }
          }}
        >
          {getFileIcon(file)}
          <span className="text-sm text-gray-700 flex-1">{file.name}</span>
          {file.type === 'folder' && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCreateMenu(showCreateMenu === file.id ? null : file.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {showCreateMenu === file.id && (
          <div className="absolute bg-white border rounded shadow-lg z-10 ml-4">
            <button
              onClick={() => {
                const name = prompt('اسم الملف:');
                if (name) {
                  onFileCreate(file.id, name, 'file');
                  setShowCreateMenu(null);
                }
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              ملف جديد
            </button>
            <button
              onClick={() => {
                const name = prompt('اسم المجلد:');
                if (name) {
                  onFileCreate(file.id, name, 'folder');
                  setShowCreateMenu(null);
                }
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              مجلد جديد
            </button>
          </div>
        )}

        {file.type === 'folder' && isExpanded && file.children && (
          <div>
            {file.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm">مستكشف الملفات</h3>
      </div>
      <div className="relative">
        {files.map(file => renderFileNode(file))}
      </div>
    </div>
  );
};

export default FileExplorer;