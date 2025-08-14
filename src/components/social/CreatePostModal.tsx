import React, { useState } from 'react';
import { 
  X, 
  Image, 
  Video, 
  Gift, 
  MapPin, 
  Hash,
  Smile,
  Send,
  Globe,
  Lock,
  Users
} from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { MediaUpload } from './MediaUpload';
import { useSocial } from '../../contexts/SocialContext';
import { useUser } from '../../contexts/UserContext';
import type { SocialPost } from '../../types/social';

type MediaFile = {
  id: string;
  file: File;
  type: 'image' | 'video';
  url: string;
  size: number;
  name: string;
};

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { createPost, socialProfiles } = useSocial();
  const { loggedInUser } = useUser();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserProfile = socialProfiles.find(p => p.userId === loggedInUser);

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;
    if (!loggedInUser) return;

    setIsSubmitting(true);

    try {
      // In a real app, you would upload media files to a server here
      const mediaUrls = mediaFiles.map(file => file.url);

      const postData: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'> = {
        authorId: loggedInUser,
        content: content.trim(),
        images: mediaFiles.filter(f => f.type === 'image').map(f => f.url),
        videos: mediaFiles.filter(f => f.type === 'video').map(f => f.url),
        type: 'text',
        likes: [],
        comments: [],
        shares: [],
        isPublic
      };

      createPost(postData);
      
      // Reset form
      setContent('');
      setMediaFiles([]);
      setLocation('');
      setHashtags('');
      setIsPublic(true);
      
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaChange = (files: MediaFile[]) => {
    setMediaFiles(files);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0095da] to-[#ff4f00] flex items-center justify-center text-white">
                  <Send size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">ایجاد پست جدید</h3>
                  <p className="text-sm text-gray-600">محتوای خود را با دوستان به اشتراک بگذارید</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={onClose}
                className="rounded-xl p-2"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {currentUserProfile?.displayName.charAt(0) || '؟'}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {currentUserProfile?.displayName || 'کاربر'}
                </div>
                <div className="text-sm text-gray-600">
                  @{currentUserProfile?.username || 'username'}
                </div>
              </div>
            </div>

            {/* Content Input */}
            <div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="چه خبر؟ چیزی برای به اشتراک گذاشتن دارید؟"
                rows={4}
                className="rounded-2xl border-gray-300 focus:border-blue-500 resize-none text-lg"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  {content.length}/280 کاراکتر
                </div>
                <Button variant="ghost" className="rounded-xl p-2">
                  <Smile size={18} />
                </Button>
              </div>
            </div>

            {/* Media Upload */}
            <MediaUpload
              onFilesChange={handleMediaChange}
              maxFiles={4}
              maxFileSize={10}
            />

            {/* Additional Options */}
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-600" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="موقعیت خود را اضافه کنید..."
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Hashtags */}
              <div className="flex items-center gap-3">
                <Hash size={18} className="text-gray-600" />
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="هشتگ‌ها را با # جدا کنید..."
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Privacy Settings */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe size={18} className="text-green-600" />
                  ) : (
                    <Lock size={18} className="text-gray-600" />
                  )}
                  <div>
                    <div className="font-semibold text-gray-800">
                      {isPublic ? 'عمومی' : 'خصوصی'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isPublic 
                        ? 'همه می‌توانند این پست را ببینند'
                        : 'فقط دنبال‌کنندگان شما می‌توانند ببینند'
                      }
                    </div>
                  </div>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
            </div>

            {/* Post Preview */}
            {(content.trim() || mediaFiles.length > 0) && (
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                <div className="text-sm font-medium text-gray-700 mb-3">پیش‌نمایش پست:</div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {currentUserProfile?.displayName.charAt(0) || '؟'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">
                        {currentUserProfile?.displayName || 'کاربر'}
                      </div>
                      <div className="text-xs text-gray-500">همین الان</div>
                    </div>
                  </div>
                  
                  {content.trim() && (
                    <p className="text-gray-800 mb-3 text-sm">{content}</p>
                  )}
                  
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {mediaFiles.slice(0, 4).map((file) => (
                        <div key={file.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          {file.type === 'image' ? (
                            <img
                              src={file.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <Video size={24} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {location && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <MapPin size={12} />
                      <span>{location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>0 پسند</span>
                    <span>0 نظر</span>
                    <span>0 اشتراک</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white rounded-b-3xl border-t border-gray-200 p-6 pt-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl"
                disabled={isSubmitting}
              >
                انصراف
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={(!content.trim() && mediaFiles.length === 0) || isSubmitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#0095da] to-[#ff4f00] text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2"></div>
                    در حال انتشار...
                  </>
                ) : (
                  <>
                    <Send size={18} className="ml-2" />
                    انتشار پست
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}