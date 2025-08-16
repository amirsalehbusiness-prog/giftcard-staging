import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useUser } from '../contexts/UserContext';

export function CartIndicator() {
  const { cartItems, loggedInUser } = useUser();

  // فقط برای کاربران لاگین شده نمایش داده شود
  if (!loggedInUser || cartItems.length === 0) {
    return null;
  }

  const handleCartClick = () => {
    // انتقال به صفحه پروفایل و تب سبد خرید
    window.dispatchEvent(new CustomEvent('navigateToProfile', { 
      detail: { tab: 'cart' } 
    }));
  };

  return (
    <Button 
      onClick={handleCartClick}
      variant="outline" 
      className="rounded-xl relative"
    >
      <ShoppingCart size={18} />
      <span className="hidden lg:inline ml-2">سبد خرید</span>
      
      {cartItems.length > 0 && (
        <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
          {cartItems.length}
        </Badge>
      )}
    </Button>
  );
}