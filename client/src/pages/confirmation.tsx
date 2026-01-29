import { Link } from "wouter";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <SuccessMessage />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-[#3d3428] text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <img
            src="/logo-white.svg"
            alt="الدرعية"
            className="h-12"
            data-testid="img-confirmation-logo"
          />
        </div>
      </div>
    </header>
  );
}

function SuccessMessage() {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground" data-testid="text-success-title">
          تم الحجز بنجاح!
        </h1>
        <p className="text-muted-foreground">
          شكراً لك، تم تأكيد حجزك. سيتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني.
        </p>
      </div>

      <div className="bg-[#f5f0e8] rounded-lg p-4 space-y-2">
        <p className="text-sm text-muted-foreground">رقم الحجز</p>
        <p className="text-xl font-bold text-primary" data-testid="text-booking-number">
          DIR-{Math.random().toString(36).substring(2, 8).toUpperCase()}
        </p>
      </div>

      <Link href="/">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white py-6"
          data-testid="button-back-home"
        >
          العودة للصفحة الرئيسية
        </Button>
      </Link>
    </div>
  );
}
