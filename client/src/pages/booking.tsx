import { ArrowRight, ChevronDown, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useState } from "react";

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("06:15");

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />
      <main className="flex-1 pb-8">
        <TitleSection />
        <BookingForm date={date} setDate={setDate} time={time} setTime={setTime} />
        <TermsSection />
        <FooterSection />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-[#3d3428] text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/registration">
            <Button size="icon" variant="ghost" className="text-white" data-testid="button-back-booking">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          
          <div className="flex-1 flex justify-center">
            <img src="/logo-white.svg" alt="الدرعية" className="h-12" data-testid="img-booking-logo" />
          </div>
          
          <div className="w-10" />
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-4">
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
                    step.number <= 2
                      ? "bg-primary text-white"
                      : "bg-white/30 text-white"
                  }`}
                >
                  {step.number}
                </div>
                <span className="text-xs mt-1 text-white">{step.label}</span>
              </div>
              {index < arr.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 ${
                    step.number < 2 ? "bg-primary" : "bg-white/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function TitleSection() {
  return (
    <div className="bg-[#e8d5b5] py-6 px-4 text-center">
      <h1 className="text-xl font-bold text-foreground" data-testid="text-booking-title">
        تصريح دخول الدرعية
      </h1>
    </div>
  );
}

function BookingForm({ 
  date, 
  setDate, 
  time, 
  setTime 
}: { 
  date: Date | undefined; 
  setDate: (d: Date | undefined) => void; 
  time: string; 
  setTime: (t: string) => void;
}) {
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", 
    "17:00", "18:00"
  ];

  return (
    <section className="px-4 py-6" data-testid="section-booking-form">
      <div className="bg-white rounded-lg border p-6 space-y-6">
        <h2 className="text-center text-lg font-semibold text-foreground mb-6">
          الرجاء الاختيار
        </h2>

        <div className="space-y-6">
          <div>
            <Label className="text-sm text-foreground mb-3 block">
              اختيار التاريخ *
            </Label>
            <Input
              type="date"
              value={date ? date.toISOString().split('T')[0] : ''}
              onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : undefined)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full text-center"
              data-testid="input-date"
            />
            {date && (
              <p className="text-center mt-3 text-sm text-primary" data-testid="text-selected-date">
                التاريخ المحدد: {date.toLocaleDateString('ar-SA')}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-foreground mb-3 block">
              اختيار الوقت *
            </Label>
            <div className="relative">
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground appearance-none text-center"
                data-testid="select-time"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="bg-[#f5f0e8] rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-foreground mb-2">أسعار التذاكر</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• تذكرة دخول الدرعية: <span className="font-semibold text-foreground">40 ر.س</span></li>
          </ul>
        </div>

        <div className="space-y-3 pt-4">
          <Link href="/cart">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white py-6"
              onClick={() => {
                localStorage.setItem("bookingData", JSON.stringify({ date, time }));
              }}
              data-testid="button-confirm-booking"
            >
              احجز الآن
            </Button>
          </Link>

          <Link href="/restaurants">
            <Button 
              variant="outline"
              className="w-full py-6 gap-2 border-primary/30 text-primary hover:bg-primary/5"
              data-testid="button-view-restaurants"
            >
              <UtensilsCrossed className="w-5 h-5" />
              تصفح المطاعم واحجز طاولة
            </Button>
          </Link>
          
          <Link href="/tickets">
            <Button 
              variant="outline"
              className="w-full py-6"
              data-testid="button-cancel-booking"
            >
              إلغاء
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TermsSection() {
  return (
    <section className="px-4 py-6" data-testid="section-booking-terms">
      <h3 className="text-lg font-bold text-foreground mb-4">الشروط والأحكام</h3>
      <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
        <p>
          يلزم الضيف بالحجز والوصول في الوقت المحدد.
        </p>
        <p>
          يلزم الضيف بعدم الحجز لتذاكر لعدة مطاعم في نفس الوقت، كما يُحظر إعادة بيع الحجوزات، حيث قد تضطر الإدارة لإلغاء الحجز أجزاء في مثل هذه الحالات.
        </p>
        <p>
          يمكن إجراء الحجوزات من خلال الموقع الإلكتروني الخاص بالمحل فقط.
        </p>
        <p>
          الحجوزات تسمح بالدخول مرة واحدة إلى المنطقة ومغادرة التاريخ المحدد فقط.
        </p>
        <p>
          تخضع جميع الحجوزات لتوفر الطاولات الوقت والتاريخ ونوع المحل المحدد، مع العلم أن تأكيد الحجز يتم بعد تلقي تأكيد رسالة عبر البريد الإلكتروني.
        </p>
        <p>
          لا يمكن حجز/تقديم للمجموعات التي يزيد عدد أفرادها عن 8 أشخاص إلا عن طريق الاتصال بالمطعم مباشرة.
        </p>
        <p>
          تلتزم الدرعية بتقديم خدمات عالية الجودة للزوار والمرافق التابعة لها وتلتزم حرصا منها على إلغاء أو على أعلى مستويات الخدمة والمتابعة، وبذلك يحتفظ على الزوار/الأفراد أو تعديل أي حجوزات قبل 24 ساعة على الأقل من يوم الحجز، يمكن إلغاء الحجز عن طريق الاتصال بخدمة العملاء.
        </p>
        <p>
          يملك كل مطعم سياسته الخاصة فيما يتعلق بعدم الحضور بعد الحجز يرجى مراجعة سياسة المطعم المحددة فيما يتعلق بالحضور المسموح به لدخول المطاعم (إن وجدت)، أو الاتصال بخدمة العملاء لإيه تعليمات.
        </p>
        <p>
          جميع المبالغ التي لم يتم دفعها للحجز غير مستردة، لن يكون هناك استرداد للمبالغ في حال عدم الحضور أو إلغاء الحجوزات بعد 24 ساعة من تاريخ الحجز.
        </p>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="px-4 py-6 text-center" data-testid="section-booking-footer">
      <p className="text-xs text-muted-foreground">
        حقوق النشر 2024. جميع الحقوق محفوظة
      </p>
    </footer>
  );
}
