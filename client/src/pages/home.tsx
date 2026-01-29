import { Menu, MapPin, Calendar, Clock, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import eventImage1 from "@assets/image(15).webp";
import eventImage2 from "@assets/image(17)image(19).webp";
import destinationImage1 from "@assets/455c3dc333504d44bfe63f8258282e15.webp";
import destinationImage2 from "@assets/image(18).webp";
import experienceImage from "@assets/a49e06e53a5946eca35727c91bc458c8.webp";
import experienceAvatar from "@assets/image(5).webp";
import historyImage from "@assets/image(8).webp";
import historyCard1 from "@assets/image(2).webp";
import historyCard2 from "@assets/c39ffb7ab18e440ba076c03243ccdaa1.webp";
import newsImage from "@assets/image(16).webp";

export default function Home() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main>
        <HeroSection />
        <QuickLinks />
        <EventsSection />
        <ExperienceSection />
        <DestinationsSection />
        <HistorySection />
        <NewsSection />
        <Footer />
      </main>
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: "الرئيسية", href: "/" },
    { label: "شراء التذاكر", href: "/tickets" },
    { label: "الفعاليات", href: "/tickets" },
    { label: "الوجهات", href: "/tickets" },
    { label: "التجارب", href: "/tickets" },
    { label: "الأخبار", href: "/tickets" },
  ];

  return (
    <>
      <header className="absolute top-0 z-50 backdrop-blur-sm left-0 right-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 h-14">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white"
                onClick={() => setMenuOpen(true)}
                data-testid="button-menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 flex justify-center">
              <img
                src="/logo-white.svg"
                alt="الدرعية"
                className="h-14 my-2"
                data-testid="img-logo"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white text-xs"
                data-testid="button-lang"
              >
                EN
              </Button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[100]" data-testid="menu-overlay">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-[#3d3428] text-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <img src="/logo-white.svg" alt="الدرعية" className="h-10" />
              <Button
                size="icon"
                variant="ghost"
                className="text-white"
                onClick={() => setMenuOpen(false)}
                data-testid="button-close-menu"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href}>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-full text-right py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                        data-testid={`menu-item-${index}`}
                      >
                        {item.label}
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        document.addEventListener('touchstart', () => {
          video.play();
        }, { once: true });
      });
    }
  }, []);

  return (
    <section
      className="relative h-[calc(100vh)] min-h-[500px] overflow-hidden"
      data-testid="section-hero"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        className="absolute inset-0 w-full h-full object-cover"
        data-testid="video-hero"
      >
        <source
          src="https://assets.diriyah.me/videos/About+Page+DSA.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16">
        <div className="text-white text-center mb-8">
          <p className="text-sm mb-2 opacity-90">فعاليات الدرعية</p>
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            data-testid="text-hero-title"
          >
            موسم قلب الدفء بدوي...
          </h2>
          <p className="text-sm opacity-80 mb-4">٢٠ نوفمبر - ٢٨ فبراير</p>
          <Link href="/tickets">
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-8"
              data-testid="button-buy-tickets"
            >
              احجز تذكرة الدخول
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  const links = [
    { label: "اكتشف الدرعية", icon: MapPin },
    { label: "الفعاليات", icon: Calendar },
    { label: "المطاعم", icon: Clock },
  ];

  return (
    <section
      className="py-6 px-4 bg-background"
      data-testid="section-quicklinks"
    >
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-3 pb-2">
          {links.map((link, i) => (
            <Link key={i} href="/tickets">
              <Button
                variant="outline"
                className="gap-2 bg-card border-border rounded-full px-5"
                data-testid={`button-quicklink-${i}`}
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm">{link.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventsSection() {
  return (
    <section className="py-8 px-4 bg-background" data-testid="section-events">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <h2
            className="text-lg font-bold text-foreground"
            data-testid="text-events-title"
          >
            فعاليات قادمة
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary gap-1"
            data-testid="button-view-all-events"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <EventCard
            title="معرض قلى الكُتاب ومؤ..."
            date="٢٨ يناير - ٨ فبراير"
            image={eventImage1}
            testId="event-1"
          />
          <EventCard
            title="اكتشف تجارب لا تنسى"
            date="متاح الآن"
            image={eventImage2}
            testId="event-2"
          />
        </div>
      </div>
    </section>
  );
}

function EventCard({
  title,
  date,
  image,
  testId,
}: {
  title: string;
  date: string;
  image: string;
  testId: string;
}) {
  return (
    <Link href="/tickets">
      <Card
        className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
        data-testid={`card-${testId}`}
      >
        <div className="flex gap-4 p-3">
          <div className="w-24 h-20 rounded-md overflow-hidden flex-shrink-0">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-foreground mb-1 truncate"
              data-testid={`text-${testId}-title`}
            >
              {title}
            </h3>
            <p
              className="text-sm text-muted-foreground"
              data-testid={`text-${testId}-date`}
            >
              {date}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ExperienceSection() {
  return (
    <section className="py-8 bg-[#f5f0e8]" data-testid="section-experience">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#8B7355] flex-shrink-0">
            <img
              src={experienceAvatar}
              alt="باب سمحان"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">الوجهة</p>
            <h3
              className="font-bold text-foreground"
              data-testid="text-destination-name"
            >
              باب سمحان
            </h3>
          </div>
        </div>

        <Link href="/tickets">
          <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer" data-testid="card-experience">
            <div className="relative h-48">
              <img
                src={experienceImage}
                alt="تجربة الدرعية"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 right-4 left-4 text-right">
                <h3
                  className="text-white font-bold text-lg"
                  data-testid="text-experience-title"
                >
                  الوجهة التاريخية والثقافية
                </h3>
              </div>
            </div>
            <div className="p-4">
              <p
                className="text-sm text-muted-foreground leading-relaxed text-right"
                data-testid="text-experience-desc"
              >
                الدرعية أيقونة تاريخية والثقافة ووجهة سياحية تقدم تجارب لا تُنسى
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </section>
  );
}

function DestinationsSection() {
  return (
    <section
      className="py-8 px-4 bg-background"
      data-testid="section-destinations"
    >
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <h2
            className="text-lg font-bold text-foreground"
            data-testid="text-destinations-title"
          >
            اكتشف وجهات الدرعية
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary gap-1"
            data-testid="button-view-all-destinations"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DestinationCard
            title="منطقة البجيري"
            image={destinationImage1}
            testId="dest-1"
          />
          <DestinationCard
            title="حي الطريف"
            image={destinationImage2}
            testId="dest-2"
          />
        </div>
      </div>
    </section>
  );
}

function DestinationCard({
  title,
  image,
  testId,
}: {
  title: string;
  image: string;
  testId: string;
}) {
  return (
    <Link href="/tickets">
      <Card
        className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
        data-testid={`card-${testId}`}
      >
        <div className="relative aspect-[3/4]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3 left-3 text-right">
            <h3
              className="text-white font-semibold text-sm"
              data-testid={`text-${testId}-title`}
            >
              {title}
            </h3>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function HistorySection() {
  return (
    <section className="py-8 bg-[#e8dfd3]" data-testid="section-history">
      <div className="container mx-auto px-4">
        <Link href="/tickets">
          <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer" data-testid="card-history">
            <div className="relative h-56">
              <img
                src={historyImage}
                alt="تاريخ الدرعية"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-4 right-4 left-4 text-right">
                <p className="text-white/80 text-xs mb-2">اكتشف</p>
                <h3
                  className="text-white font-bold text-xl mb-2"
                  data-testid="text-history-title"
                >
                  تاريخ في جمال المملكة العربية
                </h3>
                <p className="text-white/80 text-sm">الطبيعة والتاريخ</p>
              </div>
            </div>
          </Card>
        </Link>

        <div className="mt-6 space-y-4">
          <HistoryCard
            title="التراث الدرعي التاريخي"
            description="جذور موحدة يتجلى فيها عبق التاريخ وروعة الثقافة"
            image={historyCard1}
            testId="history-1"
          />
          <HistoryCard
            title="إطلالة موحدة على التاريخ"
            description="نموذج حي يوثق تاريخ المملكة العربية السعودية"
            image={historyCard2}
            testId="history-2"
          />
        </div>
      </div>
    </section>
  );
}

function HistoryCard({
  title,
  description,
  image,
  testId,
}: {
  title: string;
  description: string;
  image: string;
  testId: string;
}) {
  return (
    <Link href="/tickets">
      <Card
        className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
        data-testid={`card-${testId}`}
      >
        <div className="flex gap-4 p-3">
          <div className="w-28 h-20 rounded-md overflow-hidden flex-shrink-0">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0 text-right">
            <h3
              className="font-semibold text-foreground mb-1 text-sm"
              data-testid={`text-${testId}-title`}
            >
              {title}
            </h3>
            <p
              className="text-xs text-muted-foreground line-clamp-2"
              data-testid={`text-${testId}-desc`}
            >
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function NewsSection() {
  return (
    <section className="py-8 px-4 bg-background" data-testid="section-news">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <h2
            className="text-lg font-bold text-foreground"
            data-testid="text-news-title"
          >
            آخر الأخبار
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary gap-1"
            data-testid="button-view-all-news"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <NewsCard
            title="تشهد الدرعية مهرجانات تراثية متعددة خلال موسم الرياض"
            date="٢٤ يناير ٢٠٢٥"
            image={newsImage}
            testId="news-1"
          />
        </div>
      </div>
    </section>
  );
}

function NewsCard({
  title,
  date,
  image,
  testId,
}: {
  title: string;
  date: string;
  image: string;
  testId: string;
}) {
  return (
    <Link href="/tickets">
      <Card
        className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
        data-testid={`card-${testId}`}
      >
        <div className="relative h-44">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 right-4 left-4 text-right">
            <p className="text-white/70 text-xs mb-1">{date}</p>
            <h3
              className="text-white font-semibold text-sm"
              data-testid={`text-${testId}-title`}
            >
              {title}
            </h3>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function Footer() {
  return (
    <footer
      className="bg-[#3d3428] text-white py-8 px-4"
      data-testid="section-footer"
    >
      <div className="container mx-auto">
        <div className="text-center mb-6 flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="الدرعية"
            className="h-16 mb-3"
            data-testid="img-footer-logo"
          />
          <p className="text-white/70 text-sm">مهد المملكة العربية السعودية</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-right">
          <div className="space-y-2">
            <a href="#" className="block text-white/80 hover:text-white">
              عن الدرعية
            </a>
            <a href="#" className="block text-white/80 hover:text-white">
              الوجهات
            </a>
            <a href="#" className="block text-white/80 hover:text-white">
              الفعاليات
            </a>
          </div>
          <div className="space-y-2">
            <a href="#" className="block text-white/80 hover:text-white">
              المطاعم
            </a>
            <a href="#" className="block text-white/80 hover:text-white">
              التسوق
            </a>
            <a href="#" className="block text-white/80 hover:text-white">
              تواصل معنا
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 text-center">
          <p className="text-xs text-white/60" data-testid="text-copyright">
            © ٢٠٢٥ هيئة تطوير بوابة الدرعية
          </p>
        </div>
      </div>
    </footer>
  );
}
