import { Link } from "wouter";
import { ArrowRight, MapPin, Clock, Star, Phone, Check, Search, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export default function RestaurantsPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: "",
    name: "",
    phone: "",
  });

  const handleReserve = (restaurant: typeof restaurants[0] | typeof featuredRestaurant) => {
    setSelectedRestaurant(restaurant as typeof restaurants[0]);
    setShowReservation(true);
  };

  const handleSubmitReservation = () => {
    setShowReservation(false);
    setShowSuccess(true);
    setReservationData({ date: "", time: "", guests: "", name: "", phone: "" });
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
      <section className="relative h-[320px] overflow-hidden">
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
          <p className="text-white/80 text-sm max-w-md">
            حيث تلتقي الأصالة بالحداثة في تجربة طعام فريدة
          </p>
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

      <main className="container mx-auto px-4 py-6">
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

      {/* Reservation Dialog */}
      <Dialog open={showReservation} onOpenChange={setShowReservation}>
        <DialogContent className="max-w-md border-0 shadow-2xl bg-white" dir="rtl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-right text-xl text-[#3d3428]">حجز طاولة</DialogTitle>
            <p className="text-gray-500 text-sm text-right">{selectedRestaurant?.name}</p>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm mb-2 block text-gray-700">التاريخ *</Label>
                <Input
                  type="date"
                  value={reservationData.date}
                  onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                  className="text-left border-gray-200"
                  dir="ltr"
                  data-testid="input-date"
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block text-gray-700">الوقت *</Label>
                <Select
                  value={reservationData.time}
                  onValueChange={(value) => setReservationData({ ...reservationData, time: value })}
                >
                  <SelectTrigger className="border-gray-200" data-testid="select-time">
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
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2 block text-gray-700">عدد الأشخاص *</Label>
              <Select
                value={reservationData.guests}
                onValueChange={(value) => setReservationData({ ...reservationData, guests: value })}
              >
                <SelectTrigger className="border-gray-200" data-testid="select-guests">
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
            </div>

            <div>
              <Label className="text-sm mb-2 block text-gray-700">الاسم *</Label>
              <Input
                type="text"
                value={reservationData.name}
                onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
                placeholder="أدخل اسمك الكامل"
                className="text-right border-gray-200"
                data-testid="input-reservation-name"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block text-gray-700">رقم الجوال *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="tel"
                  value={reservationData.phone}
                  onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                  placeholder="05XXXXXXXX"
                  className="text-left pl-10 border-gray-200"
                  dir="ltr"
                  data-testid="input-reservation-phone"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmitReservation}
              className="w-full bg-[#c4a35a] hover:bg-[#b39349] py-6 text-white font-semibold"
              disabled={!reservationData.date || !reservationData.time || !reservationData.guests || !reservationData.name || !reservationData.phone}
              data-testid="button-confirm-reservation"
            >
              تأكيد الحجز
            </Button>
          </div>
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
