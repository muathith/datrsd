import { Link } from "wouter";
import { ArrowRight, MapPin, Clock, Star, Users, Phone, Calendar, Check } from "lucide-react";
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
    description: "تجربة طعام سعودية أصيلة مع إطلالة خلابة على حي الطريف التاريخي",
    cuisine: "مأكولات سعودية",
    rating: 4.8,
    priceRange: "ر.س 150 - 300",
    location: "منطقة البجيري",
    hours: "12:00 م - 11:00 م",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    features: ["إطلالة بانورامية", "قسم عائلات", "موقف سيارات"],
  },
  {
    id: 2,
    name: "مقهى الطريف",
    description: "مقهى تراثي يقدم أفضل أنواع القهوة العربية والحلويات التقليدية",
    cuisine: "مقهى وحلويات",
    rating: 4.6,
    priceRange: "ر.س 50 - 120",
    location: "حي الطريف",
    hours: "8:00 ص - 10:00 م",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
    features: ["قهوة عربية", "جلسات خارجية", "واي فاي"],
  },
  {
    id: 3,
    name: "مطعم الدرعية الفاخر",
    description: "مطعم راقي يقدم مزيجاً من المأكولات العالمية والمحلية",
    cuisine: "مأكولات عالمية",
    rating: 4.9,
    priceRange: "ر.س 200 - 500",
    location: "منطقة البجيري",
    hours: "1:00 م - 12:00 ص",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    features: ["قائمة تذوق", "طاهي خاص", "حجز مسبق"],
  },
  {
    id: 4,
    name: "مطبخ التراث",
    description: "أطباق نجدية تقليدية معدة بوصفات عائلية موروثة",
    cuisine: "مأكولات نجدية",
    rating: 4.7,
    priceRange: "ر.س 80 - 180",
    location: "وسط الدرعية",
    hours: "11:00 ص - 11:00 م",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&h=600&fit=crop",
    features: ["أطباق تقليدية", "خبز طازج", "أجواء عائلية"],
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
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="bg-[#3d3428] text-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/booking">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="button-back">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">مطاعم الدرعية</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-title">اكتشف مطاعم الدرعية</h2>
          <p className="text-muted-foreground">اختر من بين أفضل المطاعم واحجز طاولتك</p>
        </div>

        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-0 shadow-md"
              data-testid={`card-restaurant-${restaurant.id}`}
            >
              <div className="relative h-48">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-white gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {restaurant.rating}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 left-3">
                  <h3 className="text-white font-bold text-xl mb-1" data-testid={`text-restaurant-name-${restaurant.id}`}>
                    {restaurant.name}
                  </h3>
                  <p className="text-white/80 text-sm">{restaurant.cuisine}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {restaurant.description}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{restaurant.hours}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">{restaurant.priceRange}</span>
                  <Button
                    onClick={() => handleReserve(restaurant)}
                    className="bg-primary hover:bg-primary/90"
                    data-testid={`button-reserve-${restaurant.id}`}
                  >
                    احجز طاولة
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/booking">
            <Button variant="outline" className="px-8" data-testid="button-back-to-booking">
              العودة لحجز التذاكر
            </Button>
          </Link>
        </div>
      </main>

      <Dialog open={showReservation} onOpenChange={setShowReservation}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">حجز طاولة - {selectedRestaurant?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div>
              <Label className="text-sm mb-2 block">التاريخ *</Label>
              <Input
                type="date"
                value={reservationData.date}
                onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                className="text-left"
                dir="ltr"
                data-testid="input-date"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">الوقت *</Label>
              <Select
                value={reservationData.time}
                onValueChange={(value) => setReservationData({ ...reservationData, time: value })}
              >
                <SelectTrigger data-testid="select-time">
                  <SelectValue placeholder="اختر الوقت" />
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

            <div>
              <Label className="text-sm mb-2 block">عدد الأشخاص *</Label>
              <Select
                value={reservationData.guests}
                onValueChange={(value) => setReservationData({ ...reservationData, guests: value })}
              >
                <SelectTrigger data-testid="select-guests">
                  <SelectValue placeholder="اختر العدد" />
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
              <Label className="text-sm mb-2 block">الاسم *</Label>
              <Input
                type="text"
                value={reservationData.name}
                onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
                placeholder="أدخل اسمك"
                className="text-right"
                data-testid="input-reservation-name"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">رقم الجوال *</Label>
              <Input
                type="tel"
                value={reservationData.phone}
                onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                placeholder="05XXXXXXXX"
                className="text-left"
                dir="ltr"
                data-testid="input-reservation-phone"
              />
            </div>

            <Button
              onClick={handleSubmitReservation}
              className="w-full bg-primary hover:bg-primary/90 py-6"
              disabled={!reservationData.date || !reservationData.time || !reservationData.guests || !reservationData.name || !reservationData.phone}
              data-testid="button-confirm-reservation"
            >
              تأكيد الحجز
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-sm text-center" dir="rtl">
          <div className="py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">تم الحجز بنجاح!</h3>
            <p className="text-muted-foreground mb-4">
              تم تأكيد حجزك في {selectedRestaurant?.name}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              سيتم التواصل معك قريباً لتأكيد التفاصيل
            </p>
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-primary hover:bg-primary/90"
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
