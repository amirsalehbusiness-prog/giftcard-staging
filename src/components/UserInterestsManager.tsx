import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Globe, 
  Lock, 
  Save, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Check,
  X,
  Eye,
  EyeOff,
  Share2,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { INTEREST_CATEGORIES, getCategoryById, getSubcategoryById, getUserInterestsSummary } from '../data/interests';
import type { UserInterests, InterestCategory } from '../types';

type UserInterestsManagerProps = {
  userPhone: string;
  currentInterests?: UserInterests;
  onUpdateInterests: (interests: UserInterests) => void;
};

export function UserInterestsManager({ 
  userPhone, 
  currentInterests, 
  onUpdateInterests 
}: UserInterestsManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedInterests, setSelectedInterests] = useState<{
    categoryId: string;
    subcategoryIds: string[];
  }[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize state from current interests
  useEffect(() => {
    if (currentInterests) {
      setSelectedInterests(currentInterests.selectedInterests || []);
      setIsPublic(currentInterests.isPublic || false);
    }
  }, [currentInterests]);

  // Check for changes
  useEffect(() => {
    const currentSelected = currentInterests?.selectedInterests || [];
    const currentPublic = currentInterests?.isPublic || false;
    
    const hasInterestChanges = JSON.stringify(selectedInterests) !== JSON.stringify(currentSelected);
    const hasPublicChanges = isPublic !== currentPublic;
    
    setHasChanges(hasInterestChanges || hasPublicChanges);
  }, [selectedInterests, isPublic, currentInterests]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSubcategory = (categoryId: string, subcategoryId: string) => {
    setSelectedInterests(prev => {
      const existingCategoryIndex = prev.findIndex(item => item.categoryId === categoryId);
      
      if (existingCategoryIndex >= 0) {
        const existingCategory = prev[existingCategoryIndex];
        const subcategoryIndex = existingCategory.subcategoryIds.indexOf(subcategoryId);
        
        if (subcategoryIndex >= 0) {
          // Remove subcategory
          const newSubcategoryIds = existingCategory.subcategoryIds.filter(id => id !== subcategoryId);
          
          if (newSubcategoryIds.length === 0) {
            // Remove entire category if no subcategories left
            return prev.filter(item => item.categoryId !== categoryId);
          } else {
            // Update category with remaining subcategories
            const newInterests = [...prev];
            newInterests[existingCategoryIndex] = {
              ...existingCategory,
              subcategoryIds: newSubcategoryIds
            };
            return newInterests;
          }
        } else {
          // Add subcategory to existing category
          const newInterests = [...prev];
          newInterests[existingCategoryIndex] = {
            ...existingCategory,
            subcategoryIds: [...existingCategory.subcategoryIds, subcategoryId]
          };
          return newInterests;
        }
      } else {
        // Add new category with subcategory
        return [...prev, {
          categoryId,
          subcategoryIds: [subcategoryId]
        }];
      }
    });
  };

  const isSubcategorySelected = (categoryId: string, subcategoryId: string): boolean => {
    const categoryInterest = selectedInterests.find(item => item.categoryId === categoryId);
    return categoryInterest?.subcategoryIds.includes(subcategoryId) || false;
  };

  const getCategorySelectedCount = (categoryId: string): number => {
    const categoryInterest = selectedInterests.find(item => item.categoryId === categoryId);
    return categoryInterest?.subcategoryIds.length || 0;
  };

  const handleSave = () => {
    const newInterests: UserInterests = {
      selectedInterests,
      isPublic,
      lastUpdated: new Date().toISOString()
    };
    
    onUpdateInterests(newInterests);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (currentInterests) {
      setSelectedInterests(currentInterests.selectedInterests || []);
      setIsPublic(currentInterests.isPublic || false);
    } else {
      setSelectedInterests([]);
      setIsPublic(false);
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تمام علاقمندی‌ها را پاک کنید؟')) {
      setSelectedInterests([]);
      setIsPublic(false);
    }
  };

  const getTotalSelectedCount = (): number => {
    return selectedInterests.reduce((total, category) => total + category.subcategoryIds.length, 0);
  };

  const getInterestsSummaryText = (): string => {
    if (selectedInterests.length === 0) return 'هیچ علاقمندی انتخاب نشده';
    
    const summaryItems = selectedInterests.map(interest => {
      const category = getCategoryById(interest.categoryId);
      if (!category) return null;
      
      if (interest.subcategoryIds.length === 1) {
        const subcategory = category.subcategories.find(sub => sub.id === interest.subcategoryIds[0]);
        return `${category.icon} ${subcategory?.name || 'نامشخص'}`;
      } else {
        return `${category.icon} ${category.name} (${interest.subcategoryIds.length})`;
      }
    }).filter(Boolean);
    
    return summaryItems.join('، ');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} className="text-blue-600" />
              <h3 className="font-bold text-gray-800">خلاصه علاقمندی‌ها</h3>
              <Badge className="rounded-xl bg-blue-100 text-blue-800">
                {getTotalSelectedCount()} مورد انتخاب شده
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {getInterestsSummaryText()}
            </p>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="rounded-xl"
              >
                <Star size={16} className="ml-2" />
                ویرایش علاقمندی‌ها
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="rounded-xl bg-green-600 hover:bg-green-700"
                >
                  <Save size={16} className="ml-2" />
                  ذخیره
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="rounded-xl"
                >
                  <X size={16} className="ml-2" />
                  انصراف
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            {isPublic ? <Globe size={18} className="text-green-600" /> : <Lock size={18} className="text-gray-600" />}
            <div>
              <div className="font-semibold text-gray-800">
                {isPublic ? 'علاقمندی‌ها عمومی است' : 'علاقمندی‌ها خصوصی است'}
              </div>
              <div className="text-sm text-gray-600">
                {isPublic 
                  ? 'سایر کاربران می‌توانند علاقمندی‌های شما را ببینند'
                  : 'علاقمندی‌های شما فقط برای خودتان قابل مشاهده است'
                }
              </div>
            </div>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
            disabled={!isEditing}
          />
        </div>

        {isPublic && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-2 text-orange-800 text-sm">
              <Users size={16} />
              <span>
                با فعال کردن حالت عمومی، سایر کاربران هنگام خرید کارت هدیه برای شما می‌توانند علاقمندی‌هایتان را ببینند
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      {isEditing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">انتخاب علاقمندی‌ها</h4>
            <Button
              onClick={handleReset}
              variant="outline"
              className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
            >
              <RefreshCw size={16} className="ml-2" />
              پاک کردن همه
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {INTEREST_CATEGORIES.map((category) => {
              const selectedCount = getCategorySelectedCount(category.id);
              const isExpanded = expandedCategories.has(category.id);
              
              return (
                <Card key={category.id} className="rounded-2xl overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <div className="text-sm text-gray-600">
                            {category.subcategories.length} زیرمجموعه
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {selectedCount > 0 && (
                          <Badge className="rounded-xl bg-green-100 text-green-800">
                            {selectedCount} انتخاب شده
                          </Badge>
                        )}
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {category.subcategories.map((subcategory) => {
                          const isSelected = isSubcategorySelected(category.id, subcategory.id);
                          
                          return (
                            <button
                              key={subcategory.id}
                              onClick={() => toggleSubcategory(category.id, subcategory.id)}
                              className={`
                                flex items-center gap-2 p-3 rounded-xl border transition-all text-right
                                ${isSelected 
                                  ? 'border-green-500 bg-green-50 text-green-800' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                              `}
                            >
                              <span className="text-lg">{subcategory.icon}</span>
                              <span className="text-sm font-medium flex-1">{subcategory.name}</span>
                              {isSelected && <Check size={16} className="text-green-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Interests Display (when not editing) */}
      {!isEditing && selectedInterests.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star size={20} />
              علاقمندی‌های انتخاب شده
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedInterests.map((interest) => {
                const category = getCategoryById(interest.categoryId);
                if (!category) return null;
                
                return (
                  <div key={interest.categoryId} className="border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{category.name}</div>
                        <div className="text-sm text-gray-600">
                          {interest.subcategoryIds.length} مورد انتخاب شده
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {interest.subcategoryIds.map((subcategoryId) => {
                        const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
                        if (!subcategory) return null;
                        
                        return (
                          <Badge 
                            key={subcategoryId}
                            variant="secondary" 
                            className="rounded-xl flex items-center gap-1"
                          >
                            <span>{subcategory.icon}</span>
                            <span>{subcategory.name}</span>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isEditing && selectedInterests.length === 0 && (
        <Card className="rounded-2xl">
          <CardContent className="p-12 text-center">
            <Star size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              هنوز علاقمندی‌ای انتخاب نکرده‌اید
            </h3>
            <p className="text-gray-600 mb-6">
              با انتخاب علاقمندی‌هایتان، تجربه بهتری از خرید کارت هدیه خواهید داشت
            </p>
            <Button
              onClick={() => setIsEditing(true)}
              className="rounded-xl"
            >
              <Star size={18} className="ml-2" />
              شروع انتخاب علاقمندی‌ها
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}