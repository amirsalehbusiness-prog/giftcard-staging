import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Image, 
  Video, 
  X, 
  Camera, 
  Film,
  FileImage,
  AlertCircle,
  Check,
  Loader
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

type MediaFile = {
  id: string;
  file: File;
  type: 'image' | 'video';
  url: string;
  size: number;
  name: string;
};

type MediaUploadProps = {
  onFilesChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
};

export function MediaUpload({ 
  onFilesChange, 
  maxFiles = 4, 
  maxFileSize = 10,
  acceptedTypes = ['image/*', 'video/*'],
  className = ''
}: MediaUploadProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `فایل ${file.name} بیش از ${maxFileSize}MB است`;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `نوع فایل ${file.name} پشتیبانی نمی‌شود`;
    }

    return null;
  };

  const processFiles = useCallback(async (fileList: FileList) => {
    const newErrors: string[] = [];
    const newFiles: MediaFile[] = [];

    // Check total files limit
    if (files.length + fileList.length > maxFiles) {
      newErrors.push(`حداکثر ${maxFiles} فایل مجاز است`);
      setErrors(newErrors);
      return;
    }

    setUploading(true);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const error = validateFile(file);
      
      if (error) {
        newErrors.push(error);
        continue;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      const mediaFile: MediaFile = {
        id: Date.now().toString() + i,
        file,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url,
        size: file.size,
        name: file.name
      };

      newFiles.push(mediaFile);
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    setErrors(newErrors);
    setUploading(false);
  }, [files, maxFiles, maxFileSize, onFilesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    // Revoke URL to free memory
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center" style={{ paddingTop: '32px' }}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          
          {uploading ? (
            <div className="space-y-3">
              <Loader className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
              <p className="text-gray-600">در حال آپلود...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Upload size={32} className="text-gray-400" />
                </div>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  فایل‌های خود را اینجا بکشید
                </p>
                <p className="text-gray-600 mb-3">
                  یا کلیک کنید تا فایل انتخاب کنید
                </p>
                
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Image size={16} />
                    <span>تصاویر</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video size={16} />
                    <span>ویدیوها</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-2">
                  حداکثر {maxFiles} فایل، هر فایل تا {maxFileSize}MB
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">فایل‌های انتخاب شده</h4>
            <Badge className="rounded-xl">
              {files.length} از {maxFiles}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <div key={file.id} className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <Film size={32} className="mb-2" />
                      <span className="text-xs text-center px-2">{file.name}</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      variant="ghost"
                      className="rounded-full p-2 bg-white/20 hover:bg-white/30 text-white"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  
                  {/* File Type Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge className="rounded-lg text-xs bg-black/50 text-white border-0">
                      {file.type === 'image' ? (
                        <FileImage size={12} className="ml-1" />
                      ) : (
                        <Film size={12} className="ml-1" />
                      )}
                      {file.type}
                    </Badge>
                  </div>
                </div>
                
                {/* File Info */}
                <div className="mt-2 text-xs text-gray-600">
                  <p className="truncate" title={file.name}>{file.name}</p>
                  <p>{formatFileSize(file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          onClick={openFileDialog}
          variant="outline"
          className="rounded-xl flex-1"
        >
          <Camera size={16} className="ml-2" />
          انتخاب تصاویر
        </Button>
        <Button
          onClick={openFileDialog}
          variant="outline"
          className="rounded-xl flex-1"
        >
          <Film size={16} className="ml-2" />
          انتخاب ویدیو
        </Button>
      </div>
    </div>
  );
}