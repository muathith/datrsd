import {
  Menu,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header
        className={`fixed top-0 z-50 left-0 right-0 transition-all duration-500 ${scrolled ? "bg-[#2a2318]/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 h-16">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10"
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
                className={`transition-all duration-300 ${scrolled ? "h-10" : "h-14"} my-2`}
                data-testid="img-logo"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white text-xs font-medium hover:bg-white/10"
                data-testid="button-lang"
              >
                EN
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        data-testid="menu-overlay"
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 bottom-0 w-80 bg-gradient-to-b from-[#3d3428] to-[#2a2318] text-white shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <img src="/logo-white.svg" alt="الدرعية" className="h-12" />
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
              data-testid="button-close-menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-right py-4 px-5 rounded-xl hover:bg-white/10 transition-all duration-200 text-lg font-medium"
                      data-testid={`menu-item-${index}`}
                    >
                      {item.label}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="absolute bottom-8 left-5 right-5">
            <Link href="/tickets">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-xl">
                احجز تذكرتك الآن
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        document.addEventListener(
          "touchstart",
          () => {
            video.play();
          },
          { once: true },
        );
      });
    }
    setTimeout(() => setLoaded(true), 300);
  }, []);

  return (
    <section
      className="relative h-screen min-h-[600px] overflow-hidden"
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
        className="absolute inset-0 w-full h-full object-cover scale-105"
        data-testid="video-hero"
      >
        <source
          src="https://assets.diriyah.me/videos/About+Page+DSA.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      <div
        className={`relative h-full container mx-auto px-4 flex flex-col justify-end pb-24 transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="text-white text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">فعاليات الدرعية</span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            data-testid="text-hero-title"
          >
            موسم قلب الدفء بدوي...
          </h1>
          <p className="text-lg opacity-80 mb-8 font-light">
            ٢٠ نوفمبر - ٢٨ فبراير
          </p>
          <Link href="/tickets">
            <Button
              className="m-1 bg-primary/50 hover:bg-primary/90 text-white px-5 py-3 textmd  text-md font-semibold rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
              data-testid="button-buy-tickets"
            >
              احجز تذكرة الدخول
            </Button>
          </Link>

          <Link href="/restaurants">
            <Button
              variant={"outline"}
              className="bg-white/50 hover:bg-primary/90 text-primary px-5 py-3 textmd font-semibold rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
              data-testid="button-buy-tickets"
            >
              تصفح المطاعم واحجز طاولة
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
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
      className="py-8 px-4 bg-gradient-to-b from-[#1a1510] to-background"
      data-testid="section-quicklinks"
    >
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {links.map((link, i) => (
            <Link key={i} href="/tickets">
              <Button
                variant="outline"
                className="gap-3 bg-card/80 backdrop-blur-sm border-border/50 rounded-full px-6 py-5 hover:bg-card hover:border-primary/30 transition-all duration-300"
                data-testid={`button-quicklink-${i}`}
              >
                <link.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{link.label}</span>
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
    <section className="py-12 px-4 bg-background" data-testid="section-events">
      <div className="container mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
          <h2
            className="text-2xl font-bold text-foreground"
            data-testid="text-events-title"
          >
            فعاليات قادمة
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary gap-2 font-medium"
            data-testid="button-view-all-events"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <EventCard
            title="معرض قلى الكُتاب ومؤلفاتهم"
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
        className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 group"
        data-testid={`card-${testId}`}
      >
        <div className="flex gap-4 p-4">
          <div className="w-28 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3
              className="font-bold text-foreground mb-2 text-base leading-tight"
              data-testid={`text-${testId}-title`}
            >
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <p
                className="text-sm text-muted-foreground"
                data-testid={`text-${testId}-date`}
              >
                {date}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ExperienceSection() {
  return (
    <section
      className="py-12 bg-gradient-to-b from-[#f5f0e8] to-[#ebe3d5]"
      data-testid="section-experience"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex flex-wrap items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg flex-shrink-0">
            <img
              src={experienceAvatar}
              alt="باب سمحان"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              الوجهة المميزة
            </p>
            <h3
              className="font-bold text-foreground text-xl"
              data-testid="text-destination-name"
            >
              باب سمحان
            </h3>
          </div>
        </div>

        <Link href="/tickets">
          <Card
            className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-0 shadow-xl group"
            data-testid="card-experience"
          >
            <div className="relative h-56">
              <img
                src={experienceImage}
                alt="تجربة الدرعية"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-5 right-5 left-5 text-right">
                <h3
                  className="text-white font-bold text-xl leading-tight"
                  data-testid="text-experience-title"
                >
                  الوجهة التاريخية والثقافية
                </h3>
              </div>
            </div>
            <div className="p-5 bg-white">
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
      className="py-12 px-4 bg-background"
      data-testid="section-destinations"
    >
      <div className="container mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
          <h2
            className="text-2xl font-bold text-foreground"
            data-testid="text-destinations-title"
          >
            اكتشف وجهات الدرعية
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary gap-2 font-medium"
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
        className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-0 shadow-lg group"
        data-testid={`card-${testId}`}
      >
        <div className="relative aspect-[3/4]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 right-4 left-4 text-right">
            <h3
              className="text-white font-bold text-base drop-shadow-lg"
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
    <section
      className="py-12 bg-gradient-to-b from-[#e8dfd3] to-[#ddd2c3]"
      data-testid="section-history"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/tickets">
          <Card
            className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-0 shadow-xl group"
            data-testid="card-history"
          >
            <div className="relative h-64">
              <img
                src={historyImage}
                alt="تاريخ الدرعية"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-5 right-5 left-5 text-right">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full mb-3">
                  اكتشف
                </span>
                <h3
                  className="text-white font-bold text-2xl mb-2 leading-tight"
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
        className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-0 shadow-md bg-white group"
        data-testid={`card-${testId}`}
      >
        <div className="flex gap-4 p-4">
          <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0 text-right flex flex-col justify-center">
            <h3
              className="font-bold text-foreground mb-2 text-base"
              data-testid={`text-${testId}-title`}
            >
              {title}
            </h3>
            <p
              className="text-xs text-muted-foreground line-clamp-2 leading-relaxed"
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
    <section className="py-12 px-4 bg-background" data-testid="section-news">
      <div className="container mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
          <h2
            className="text-2xl font-bold text-foreground"
            data-testid="text-news-title"
          >
            آخر الأخبار
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary gap-2 font-medium"
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
        className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-0 shadow-lg group"
        data-testid={`card-${testId}`}
      >
        <div className="relative h-52">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-5 right-5 left-5 text-right">
            <span className="inline-block bg-primary/90 text-white text-xs px-3 py-1.5 rounded-full mb-3">
              {date}
            </span>
            <h3
              className="text-white font-bold text-base leading-tight"
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
      className="bg-gradient-to-b from-[#3d3428] to-[#2a2318] text-white py-12 px-4"
      data-testid="section-footer"
    >
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src="/logo-white.svg"
            alt="الدرعية"
            className="h-20 mb-4"
            data-testid="img-footer-logo"
          />
          <p className="text-white/60 text-sm font-light">
            مهد المملكة العربية السعودية
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 text-sm text-right">
          <div className="space-y-3">
            <a
              href="#"
              className="block text-white/70 hover:text-white transition-colors"
            >
              عن الدرعية
            </a>
            <a
              href="#"
              className="block text-white/70 hover:text-white transition-colors"
            >
              الوجهات
            </a>
            <a
              href="#"
              className="block text-white/70 hover:text-white transition-colors"
            >
              الفعاليات
            </a>
          </div>
          <div className="space-y-3">
            <a
              href="#"
              className="block text-white/70 hover:text-white transition-colors"
            >
              المطاعم
            </a>
            <a
              href="#"
              className="block text-white/70 hover:text-white transition-colors"
            >
              التسوق
            </a>
            <a
              href="#"
              className="block text-white/70 hover:text-white transition-colors"
            >
              تواصل معنا
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40" data-testid="text-copyright">
            © ٢٠٢٥ هيئة تطوير بوابة الدرعية
          </p>
        </div>
      </div>
    </footer>
  );
}
