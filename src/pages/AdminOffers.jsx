import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Trash2, Tag, ImageIcon, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Header from "@/components/Header.jsx";
import axios from "axios";

const API = "https://bonus-system-tau.vercel.app/api/offers";

function getRemainingDays(expiresAt) {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AdminOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [durationDays, setDurationDays] = useState("");

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      setOffers(res.data);
    } catch {
      toast.error("فشل في تحميل العروض");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleAdd = async () => {
    if (!title.trim()) { toast.error("عنوان العرض مطلوب"); return; }
    setIsAdding(true);
    try {
      await axios.post(API, { title, description, imageUrl, durationDays });
      toast.success(`✅ تم إضافة عرض "${title}" بنجاح`);
      setTitle(""); setDescription(""); setImageUrl(""); setDurationDays("");
      setAddOpen(false);
      fetchOffers();
    } catch {
      toast.error("فشل في إضافة العرض");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id, offerTitle) => {
    if (!window.confirm(`هل أنت متأكد إنك عاوز تمسح "${offerTitle}"؟`)) return;
    try {
      await axios.delete(`${API}/${id}`);
      toast.success("تم حذف العرض بنجاح");
      fetchOffers();
    } catch {
      toast.error("فشل في حذف العرض");
    }
  };

  const activeOffers = offers.filter(o => !o.expiresAt || new Date(o.expiresAt) > new Date());
  const expiredOffers = offers.filter(o => o.expiresAt && new Date(o.expiresAt) <= new Date());

  return (
    <>
      <Helmet><title>إدارة العروض - نسر البرية</title></Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* رأس الصفحة */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}
                className="text-muted-foreground hover:text-foreground">
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-extrabold text-foreground">إدارة العروض 🏷️</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {activeOffers.length} عرض نشط — {expiredOffers.length} منتهي
                </p>
              </div>
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all">
                  <Plus className="w-5 h-5 ml-2" />إضافة عرض
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 bg-[#0a0a0a] text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">عرض جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>عنوان العرض *</Label>
                    <Input value={title} onChange={e => setTitle(e.target.value)}
                      placeholder="مثلاً: خصم 20% على كل الشواحن"
                      className="h-12 bg-background/50 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>وصف العرض</Label>
                    <Input value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="تفاصيل العرض..."
                      className="h-12 bg-background/50 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>رابط الصورة (URL)</Label>
                    <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://..." dir="ltr"
                      className="h-12 bg-background/50 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      مدة العرض (أيام) — اختياري
                    </Label>
                    <Input value={durationDays} onChange={e => setDurationDays(e.target.value)}
                      type="number" min="1" placeholder="مثلاً: 7 (اتركه فاضي لو دايم)"
                      className="h-12 bg-background/50 border-white/10 text-white" />
                  </div>
                  {imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 h-36">
                      <img src={imageUrl} alt="preview" className="w-full h-full object-cover"
                        onError={e => e.target.style.display = "none"} />
                    </div>
                  )}
                  <Button onClick={handleAdd} disabled={isAdding}
                    className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground mt-2">
                    {isAdding ? "جاري الإضافة..." : "إضافة العرض"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
            </div>
          ) : offers.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-xl text-foreground font-bold">مفيش عروض لحد دلوقتي</p>
              <p className="text-muted-foreground mt-1">ابدأ بإضافة أول عرض 👆</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* العروض النشطة */}
              {activeOffers.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    العروض النشطة ({activeOffers.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {activeOffers.map((offer, index) => (
                      <OfferCard key={offer._id} offer={offer} index={index} onDelete={handleDelete} isExpired={false} />
                    ))}
                  </div>
                </div>
              )}

              {/* العروض المنتهية */}
              {expiredOffers.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-muted-foreground mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    العروض المنتهية ({expiredOffers.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
                    {expiredOffers.map((offer, index) => (
                      <OfferCard key={offer._id} offer={offer} index={index} onDelete={handleDelete} isExpired={true} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function OfferCard({ offer, index, onDelete, isExpired }) {
  const remaining = getRemainingDays(offer.expiresAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 group
        ${isExpired ? "border-red-500/20" : "border-white/10 hover:border-primary/30"}`}
    >
      <div className="h-44 bg-white/5 relative overflow-hidden">
        {offer.imageUrl ? (
          <img src={offer.imageUrl} alt={offer.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
        ) : null}
        <div className="w-full h-full items-center justify-center"
          style={{ display: offer.imageUrl ? "none" : "flex" }}>
          <Tag className="w-12 h-12 text-muted-foreground opacity-30" />
        </div>

        {/* شارة المدة */}
        {offer.expiresAt && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1
            ${isExpired ? "bg-red-500/80 text-white" : remaining <= 2 ? "bg-orange-500/80 text-white" : "bg-primary/80 text-primary-foreground"}`}>
            <Clock className="w-3 h-3" />
            {isExpired ? "منتهي" : `${remaining} يوم متبقي`}
          </div>
        )}
        {!offer.expiresAt && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold bg-blue-500/80 text-white">
            دايم
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{offer.title}</h3>
        {offer.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{offer.description}</p>
        )}
        <Button variant="ghost" size="sm" onClick={() => onDelete(offer._id, offer.title)}
          className="text-red-400 hover:text-red-500 hover:bg-red-500/10 w-full mt-1">
          <Trash2 className="w-4 h-4 ml-2" />حذف العرض
        </Button>
      </div>
    </motion.div>
  );
}