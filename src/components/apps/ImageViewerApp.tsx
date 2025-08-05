import React, { useState } from 'react';
import { Image, Upload, ZoomIn, ZoomOut, RotateCw, Download, Trash2 } from 'lucide-react';

const ImageViewerApp: React.FC = () => {
  const [images, setImages] = useState([
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const zoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const rotate = () => setRotation(prev => (prev + 90) % 360);
  const resetView = () => {
    setZoom(100);
    setRotation(0);
  };

  return (
    <div className="h-full flex bg-gray-900 text-white">
      {/* الشريط الجانبي */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-semibold mb-3">عارض الصور</h3>
          <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">رفع صور</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded overflow-hidden border-2 transition-all ${
                  selectedImage === index ? 'border-blue-500' : 'border-transparent hover:border-gray-600'
                }`}
                onClick={() => {
                  setSelectedImage(index);
                  resetView();
                }}
              >
                <img
                  src={image}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* منطقة العرض الرئيسية */}
      <div className="flex-1 flex flex-col">
        {/* شريط الأدوات */}
        <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm px-2">{zoom}%</span>
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-600 mx-2"></div>
            <button
              onClick={rotate}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="دوران"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="px-3 py-2 text-sm hover:bg-gray-700 rounded transition-colors"
            >
              إعادة تعيين
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {selectedImage + 1} من {images.length}
            </span>
            <button
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="تحميل"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const newImages = images.filter((_, index) => index !== selectedImage);
                setImages(newImages);
                if (selectedImage >= newImages.length) {
                  setSelectedImage(Math.max(0, newImages.length - 1));
                }
              }}
              className="p-2 hover:bg-red-600 rounded transition-colors"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* منطقة عرض الصورة */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          {images.length > 0 ? (
            <div className="relative">
              <img
                src={images[selectedImage]}
                alt={`صورة ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                }}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">لا توجد صور</p>
              <p className="text-sm">ارفع بعض الصور لبدء العرض</p>
            </div>
          )}
        </div>

        {/* شريط التنقل السفلي */}
        {images.length > 1 && (
          <div className="bg-gray-800 border-t border-gray-700 p-3 flex items-center justify-center gap-2">
            <button
              onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
              disabled={selectedImage === 0}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded text-sm transition-colors"
            >
              السابق
            </button>
            <div className="flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    selectedImage === index ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setSelectedImage(prev => Math.min(images.length - 1, prev + 1))}
              disabled={selectedImage === images.length - 1}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded text-sm transition-colors"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewerApp;