import { Menu, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";

import ticketImage from "@assets/455c3dc333504d44bfe63f8258282e15.webp";

const getTicketPrice = () => {
  return 40;
};

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const [pricePerTicket, setPricePerTicket] = useState(40);
  
  useEffect(() => {
    setPricePerTicket(getTicketPrice());
  }, []);
  
  const subtotal = pricePerTicket * quantity;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />
      <ProgressSteps />
      <TitleBanner />
      <main className="flex-1 px-4 py-6">
        <CartItem 
          quantity={quantity} 
          setQuantity={setQuantity} 
          price={pricePerTicket} 
        />
        <Subtotal total={subtotal} />
      </main>
      <ContinueButton total={subtotal} quantity={quantity} />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-[#3d3428] text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button size="icon" variant="ghost" className="text-white" data-testid="button-menu">
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 flex justify-center">
            <img src="/logo-white.svg" alt="الدرعية" className="h-12" data-testid="img-cart-logo" />
          </div>
          
          <div className="w-10" />
        </div>
      </div>
    </header>
  );
}

function ProgressSteps() {
  return (
    <div className="bg-[#f5f0e8] p-4" data-testid="progress-steps-cart">
      <div className="flex items-center justify-center gap-2">
        {[
          { number: 1, label: "تسجيل" },
          { number: 2, label: "الحجز" },
          { number: 3, label: "السلة" },
          { number: 4, label: "الدفع" },
        ].map((step, index, arr) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.number <= 3
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <span className="text-xs mt-1 text-foreground">{step.label}</span>
            </div>
            {index < arr.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  step.number < 3 ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TitleBanner() {
  return (
    <div className="bg-[#c4956a] py-4 px-4 text-center">
      <h1 className="text-xl font-bold text-white" data-testid="text-cart-title">
        إتمام الشراء
      </h1>
    </div>
  );
}

function CartItem({ 
  quantity, 
  setQuantity, 
  price 
}: { 
  quantity: number; 
  setQuantity: (q: number) => void; 
  price: number;
}) {
  const formattedPrice = `${price.toLocaleString('ar-SA')} ر.س`;

  return (
    <div className="border-b pb-6 mb-6" data-testid="cart-item">
      <div className="flex gap-4">
        <img 
          src={ticketImage} 
          alt="تذكرة دخول الدرعية" 
          className="w-16 h-16 object-cover rounded"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm" data-testid="text-item-title">
                حجز تذكرة دخول الدرعية
              </h3>
              <p className="text-muted-foreground text-sm mt-1">{formattedPrice}</p>
            </div>
            <Button size="icon" variant="ghost" className="text-muted-foreground" data-testid="button-delete-item">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-foreground font-semibold">{formattedPrice}</p>
            
            <div className="flex items-center gap-2 border rounded">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                data-testid="button-decrease"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center" data-testid="text-quantity">{quantity}</span>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
                data-testid="button-increase"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Subtotal({ total }: { total: number }) {
  const formattedTotal = `${total.toLocaleString('ar-SA')} ر.س`;
  
  return (
    <div className="flex items-center justify-between py-4" data-testid="subtotal">
      <span className="text-lg">المجموع</span>
      <span className="text-lg font-semibold" data-testid="text-subtotal">{formattedTotal}</span>
    </div>
  );
}

function ContinueButton({ total, quantity }: { total: number; quantity: number }) {
  const handleContinue = () => {
    localStorage.setItem("cartTotal", total.toString());
    localStorage.setItem("ticketQuantity", quantity.toString());
  };

  return (
    <div className="sticky bottom-0 bg-[#e8d5b5] p-4">
      <Link href="/checkout">
        <Button 
          className="w-full bg-[#c4956a] hover:bg-[#b38559] text-white py-6 text-lg"
          data-testid="button-continue-checkout"
          onClick={handleContinue}
        >
          المتابعة لإتمام الحجز
        </Button>
      </Link>
    </div>
  );
}
