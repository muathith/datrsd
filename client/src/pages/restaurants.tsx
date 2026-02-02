import { Link } from "wouter";
import { ArrowRight, MapPin, Clock, Star, Phone, Check, Sparkles, Heart, ChefHat, Coffee, Utensils } from "lucide-react";
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
    nameEn: "Al Bujairi Restaurant",
    description: "تجربة طعام سعودية أصيلة مع إطلالة خلابة على حي الطريف التاريخي",
    cuisine: "مأكولات سعودية",
    rating: 4.8,
    reviews: 324,
    priceRange: "ر.س 150 - 300",
    location: "منطقة البجيري",
    hours: "12:00 م - 11:00 م",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    features: ["إطلالة بانورامية", "قسم عائلات", "موقف سيارات"],
    icon: Utensils,
    gradient: "from-amber-600 to-orange-700",
  },
  {
    id: 2,
    name: "مقهى الطريف",
    nameEn: "Al Turaif Café",
    description: "مقهى تراثي يقدم أفضل أنواع القهوة العربية والحلويات التقليدية",
    cuisine: "مقهى وحلويات",
    rating: 4.6,
    reviews: 189,
    priceRange: "ر.س 50 - 120",
    location: "حي الطريف",
    hours: "8:00 ص - 10:00 م",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
    features: ["قهوة عربية", "جلسات خارجية", "واي فاي"],
    icon: Coffee,
    gradient: "from-amber-700 to-yellow-800",
  },
  {
    id: 3,
    name: "مطعم الدرعية الفاخر",
    nameEn: "Diriyah Fine Dining",
    description: "مطعم راقي يقدم مزيجاً من المأكولات العالمية والمحلية",
    cuisine: "مأكولات عالمية",
    rating: 4.9,
    reviews: 412,
    priceRange: "ر.س 200 - 500",
    location: "منطقة البجيري",
    hours: "1:00 م - 12:00 ص",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    features: ["قائمة تذوق", "طاهي خاص", "حجز مسبق"],
    icon: ChefHat,
    gradient: "from-stone-700 to-stone-800",
  },
  {
    id: 4,
    name: "مطبخ التراث",
    nameEn: "Heritage Kitchen",
    description: "أطباق نجدية تقليدية معدة بوصفات عائلية موروثة",
    cuisine: "مأكولات نجدية",
    rating: 4.7,
    reviews: 256,
    priceRange: "ر.س 80 - 180",
    location: "وسط الدرعية",
    hours: "11:00 ص - 11:00 م",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&h=600&fit=crop",
    features: ["أطباق تقليدية", "خبز طازج", "أجواء عائلية"],
    icon: Heart,
    gradient: "from-rose-700 to-red-800",
  },
];

export default function RestaurantsPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: "",
    name: "",
    phone: "",
  });

  const handleReserve = (restaurant: typeof restaurants[0]) => {
    setSelectedRestaurant(restaurant);
    setShowReservation(true);
  };

  const handleSubmitReservation = () => {
    setShowReservation(false);
    setShowSuccess(true);
    setReservationData({ date: "", time: "", guests: "", name: "", phone: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f0e8] to-[#ebe3d5]" dir="rtl">
      <header className="bg-gradient-to-r from-[#3d3428] to-[#5c4a3d] text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/booking">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" data-testid="button-back">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold">مطاعم الدرعية</h1>
              <p className="text-xs text-white/70">Diriyah Restaurants</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden bg-gradient-to-br from-[#3d3428] via-[#5c4a3d] to-[#3d3428] text-white py-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">تجارب طعام استثنائية</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-title">
            اكتشف مطاعم الدرعية
          </h2>
          <p className="text-white/80 text-lg max-w-md mx-auto">
            استمتع بأشهى المأكولات في أجواء تاريخية فريدة
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <span className="text-sm text-muted-foreground">{restaurants.length} مطاعم متاحة</span>
          </div>
        </div>

        <div className="space-y-6">
          {restaurants.map((restaurant, index) => {
            const IconComponent = restaurant.icon;
            return (
              <Card
                key={restaurant.id}
                className="overflow-hidden border-0 shadow-xl bg-white group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`card-restaurant-${restaurant.id}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`bg-gradient-to-r ${restaurant.gradient} text-white gap-1.5 px-3 py-1.5 shadow-lg`}>
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{restaurant.rating}</span>
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${restaurant.gradient} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 right-0 left-0 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-white font-bold text-2xl mb-1" data-testid={`text-restaurant-name-${restaurant.id}`}>
                          {restaurant.name}
                        </h3>
                        <p className="text-white/60 text-xs mb-2">{restaurant.nameEn}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            {restaurant.cuisine}
                          </Badge>
                          <span className="text-white/70 text-xs">({restaurant.reviews} تقييم)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-foreground/80 text-sm mb-4 leading-relaxed">
                    {restaurant.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground/80 truncate">{restaurant.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                      <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground/80 truncate">{restaurant.hours}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {restaurant.features.map((feature, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">متوسط السعر</p>
                      <span className="text-lg font-bold text-primary">{restaurant.priceRange}</span>
                    </div>
                    <Button
                      onClick={() => handleReserve(restaurant)}
                      className={`bg-gradient-to-r ${restaurant.gradient} hover:opacity-90 text-white px-6 py-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl`}
                      data-testid={`button-reserve-${restaurant.id}`}
                    >
                      <span className="font-semibold">احجز طاولة</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/booking">
            <Button 
              variant="outline" 
              className="px-10 py-6 rounded-xl border-2 border-primary/30 hover:bg-primary/5 gap-2"
              data-testid="button-back-to-booking"
            >
              <ArrowRight className="w-4 h-4" />
              العودة لحجز التذاكر
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#3d3428] to-[#5c4a3d] text-white py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <img src="/logo-white.svg" alt="الدرعية" className="h-12 mx-auto mb-3 opacity-80" />
          <p className="text-white/50 text-sm">جميع الحقوق محفوظة - الدرعية 2024</p>
        </div>
      </footer>

      <Dialog open={showReservation} onOpenChange={setShowReservation}>
        <DialogContent className="max-w-md border-0 shadow-2xl" dir="rtl">
          <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${selectedRestaurant?.gradient || 'from-primary to-primary'} rounded-t-lg`} />
          <DialogHeader className="pt-4">
            <DialogTitle className="text-right text-xl">حجز طاولة</DialogTitle>
            <p className="text-muted-foreground text-sm text-right">{selectedRestaurant?.name}</p>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm mb-2 block font-medium">التاريخ *</Label>
                <Input
                  type="date"
                  value={reservationData.date}
                  onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                  className="text-left rounded-xl"
                  dir="ltr"
                  data-testid="input-date"
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block font-medium">الوقت *</Label>
                <Select
                  value={reservationData.time}
                  onValueChange={(value) => setReservationData({ ...reservationData, time: value })}
                >
                  <SelectTrigger className="rounded-xl" data-testid="select-time">
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
              <Label className="text-sm mb-2 block font-medium">عدد الأشخاص *</Label>
              <Select
                value={reservationData.guests}
                onValueChange={(value) => setReservationData({ ...reservationData, guests: value })}
              >
                <SelectTrigger className="rounded-xl" data-testid="select-guests">
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
              <Label className="text-sm mb-2 block font-medium">الاسم *</Label>
              <Input
                type="text"
                value={reservationData.name}
                onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
                placeholder="أدخل اسمك الكامل"
                className="text-right rounded-xl"
                data-testid="input-reservation-name"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block font-medium">رقم الجوال *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  value={reservationData.phone}
                  onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                  placeholder="05XXXXXXXX"
                  className="text-left pl-10 rounded-xl"
                  dir="ltr"
                  data-testid="input-reservation-phone"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmitReservation}
              className={`w-full bg-gradient-to-r ${selectedRestaurant?.gradient || 'from-primary to-primary'} hover:opacity-90 py-6 rounded-xl shadow-lg text-white font-semibold`}
              disabled={!reservationData.date || !reservationData.time || !reservationData.guests || !reservationData.name || !reservationData.phone}
              data-testid="button-confirm-reservation"
            >
              تأكيد الحجز
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-sm text-center border-0 shadow-2xl" dir="rtl">
          <div className="py-8">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">تم الحجز بنجاح!</h3>
            <p className="text-muted-foreground mb-2">
              تم تأكيد حجزك في
            </p>
            <p className="text-lg font-semibold text-primary mb-6">
              {selectedRestaurant?.name}
            </p>
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                سيتم التواصل معك قريباً عبر الجوال لتأكيد التفاصيل
              </p>
            </div>
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 py-6 rounded-xl shadow-lg text-white font-semibold"
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
