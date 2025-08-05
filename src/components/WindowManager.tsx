import React, { useState } from 'react';
import { X, Minus, Square, Maximize2, Minimize2 } from 'lucide-react';

interface Window {
  id: string;
  title: string;
  component: React.ReactNode;
  isMaximized: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface WindowManagerProps {
  windows: Window[];
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
}

const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onFocusWindow
}) => {
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (!window || window.isMaximized) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedWindow(windowId);
    onFocusWindow(windowId);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedWindow) return;

    const window = windows.find(w => w.id === draggedWindow);
    if (!window) return;

    // تحديث موقع النافذة (هذا يتطلب تحديث الحالة في المكون الأب)
    // يمكن إضافة callback لتحديث موقع النافذة
  };

  const handleMouseUp = () => {
    setDraggedWindow(null);
    setDragOffset({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    if (draggedWindow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedWindow]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {windows
        .filter(window => !window.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => (
          <div
            key={window.id}
            className={`
              absolute bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden pointer-events-auto
              ${window.isMaximized ? 'inset-4' : ''}
            `}
            style={{
              left: window.isMaximized ? undefined : window.position.x,
              top: window.isMaximized ? undefined : window.position.y,
              width: window.isMaximized ? undefined : window.size.width,
              height: window.isMaximized ? undefined : window.size.height,
              zIndex: window.zIndex
            }}
            onClick={() => onFocusWindow(window.id)}
          >
            {/* شريط العنوان */}
            <div
              className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between cursor-move select-none"
              onMouseDown={(e) => handleMouseDown(e, window.id)}
            >
              <h3 className="font-medium text-gray-800">{window.title}</h3>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onMinimizeWindow(window.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                
                <button
                  onClick={() => onMaximizeWindow(window.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {window.isMaximized ? (
                    <Minimize2 className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                
                <button
                  onClick={() => onCloseWindow(window.id)}
                  className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* محتوى النافذة */}
            <div className="h-full overflow-hidden">
              {window.component}
            </div>
          </div>
        ))}
    </div>
  );
};

export default WindowManager;