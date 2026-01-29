import { ArrowRight, MapPin, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

import ticketHeroImage from "@assets/455c3dc333504d44bfe63f8258282e15.webp";

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />
      <main className="flex-1 pb-20">
        <HeroImage />
        <TicketInfo />
        <MapSection />
        <TermsSection />
        <FooterSection />
      </main>
      <BookNowButton />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button size="icon" variant="ghost" data-testid="button-back">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          
          <div className="flex-1 flex justify-center">
            <img src="/bug.svg" alt="الدرعية" className="h-10" data-testid="img-tickets-logo" />
          </div>
          
          <div className="w-10" />
        </div>
      </div>
    </header>
  );
}

function HeroImage() {
  return (
    <div className="relative h-64">
      <img 
        src={ticketHeroImage} 
        alt="حي الطريف التاريخي" 
        className="w-full h-full object-cover"
        data-testid="img-ticket-hero"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-4 right-4 left-4 text-right">
        <p className="text-primary text-sm mb-1">اكتشف</p>
        <h1 className="text-white text-xl font-bold" data-testid="text-ticket-title">
          تذكرة دخول الدرعية
        </h1>
      </div>
    </div>
  );
}

function TicketInfo() {
  return (
    <section className="px-4 py-6" data-testid="section-ticket-info">
      <div className="flex items-center gap-2 mb-6">
        <ArrowRight className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground" data-testid="text-access-title">
          تصريح دخول الدرعية
        </h2>
      </div>

      <div className="space-y-6">
        <InfoItem 
          icon={<Clock className="w-4 h-4" />}
          title="الوقت:"
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">مطل البجيري</p>
              <p>أيام الأسبوع:</p>
              <p>من الساعة 9:00 صباحاً حتى 12:00 منتصف الليل</p>
              <p>نهاية الأسبوع:</p>
              <p>من الساعة 9:00 صباحاً حتى 1:00 صباحاً</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">الطريف</p>
              <p>من السبت إلى الخميس:</p>
              <p>من الساعة 10:00 صباحاً حتى 12:00 منتصف الليل</p>
              <p>يوم الجمعة:</p>
              <p>من الساعة 2:00 مساءً حتى الساعة 12:00 منتصف الليل</p>
            </div>
            <p className="text-xs">آخر وقت للدخول الساعة 11 مساءً</p>
          </div>
        </InfoItem>

        <InfoItem 
          icon={<MapPin className="w-4 h-4" />}
          title="المدينة : الدرعية ، الرياض"
        />

        <InfoItem 
          icon={<MapPin className="w-4 h-4" />}
          title="المكان : مطل البجيري وحي الطريف التاريخي"
        />

        <InfoItem 
          icon={<Info className="w-4 h-4" />}
          title="الوصف:"
        >
          <p className="text-sm text-muted-foreground">يشمل:</p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
            <li>الدخول إلى الطريف التاريخي</li>
            <li>الدخول إلى مطل البجيري</li>
            <li>يمكنك استرداد مبلغ تذكرة الدخول في جميع مطاعم ومقاهي مطل البجيري ما عدا دلتشي أند غاباني</li>
          </ul>
        </InfoItem>
      </div>
    </section>
  );
}

function InfoItem({ 
  icon, 
  title, 
  children 
}: { 
  icon: React.ReactNode; 
  title: string; 
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="text-primary mt-1">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold text-foreground text-sm">{title}</p>
        {children}
      </div>
    </div>
  );
}

function MapSection() {
  return (
    <section className="px-4 py-6" data-testid="section-map">
      <h3 className="text-lg font-bold text-foreground mb-4">الموقع</h3>
      <div className="rounded-lg overflow-hidden border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.1234567890123!2d46.5763!3d24.7336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f1b9c8d7e6f5a%3A0x1234567890abcdef!2sBujairi%20Terrace!5e0!3m2!1sen!2ssa!4v1234567890123"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="موقع مطل البجيري"
          data-testid="map-location"
        />
      </div>
    </section>
  );
}

function TermsSection() {
  return (
    <section className="px-4 py-6 border-t" data-testid="section-terms">
      <h3 className="text-lg font-bold text-foreground mb-4">الشروط والأحكام</h3>
      <div className="text-sm text-muted-foreground space-y-2">
        <p>• التذاكر غير قابلة للاسترداد</p>
        <p>• يجب الحضور في الموعد المحدد</p>
        <p>• الالتزام بقواعد السلامة والأمان</p>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="px-4 py-6 text-center border-t" data-testid="section-ticket-footer">
      <p className="text-xs text-muted-foreground mb-2">
        Copyright 2024 DGCL. All Rights Reserved
      </p>
      <p className="text-xs text-muted-foreground" dir="ltr">
        +966 92 002 1727
      </p>
    </footer>
  );
}

function BookNowButton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
      <Link href="/registration">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
          data-testid="button-book-now"
        >
          احجز الآن
        </Button>
      </Link>
    </div>
  );
}
