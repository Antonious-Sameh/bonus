import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Trash2, Package, ImageIcon } from "lucide-react";
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

const API = "https://bonus-system-tau.vercel.app/api/products";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch {
      toast.error("فشل في تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("اسم المنتج مطلوب");
      return;
    }
    setIsAdding(true);
    try {
      await axios.post(API, { name, description, imageUrl });
      toast.success(`✅ تم إضافة "${name}" بنجاح`);
      setName("");
      setDescription("");
      setImageUrl("");
      setAddOpen(false);
      fetchProducts();
    } catch {
      toast.error("فشل في إضافة المنتج");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id, productName) => {
    if (!window.confirm(`هل أنت متأكد إنك عاوز تمسح "${productName}"؟`)) return;
    try {
      await axios.delete(`${API}/${id}`);
      toast.success("تم حذف المنتج بنجاح");
      fetchProducts();
    } catch {
      toast.error("فشل في حذف المنتج");
    }
  };

  return (
    <>
      <Helmet>
        <title>إدارة المنتجات - نسر البرية</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* رأس الصفحة */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-extrabold text-foreground">
                  إدارة المنتجات
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {products.length} منتج مضاف حالياً
                </p>
              </div>
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all">
                  <Plus className="w-5 h-5 ml-2" />
                  إضافة منتج
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 bg-[#0a0a0a] text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    منتج جديد
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>اسم المنتج *</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثلاً: شاحن سامسونج 65W"
                      className="h-12 bg-background/50 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>وصف المنتج</Label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="وصف مختصر للمنتج"
                      className="h-12 bg-background/50 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>رابط الصورة (URL)</Label>
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="h-12 bg-background/50 border-white/10 text-white"
                      dir="ltr"
                    />
                  </div>
                  {imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 h-36">
                      <img
                        src={imageUrl}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleAdd}
                    disabled={isAdding}
                    className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground mt-2"
                  >
                    {isAdding ? "جاري الإضافة..." : "إضافة المنتج"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* قائمة المنتجات */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-xl text-foreground font-bold">مفيش منتجات لحد دلوقتي</p>
              <p className="text-muted-foreground mt-1">ابدأ بإضافة أول منتج 👆</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 group"
                >
                  {/* صورة المنتج */}
                  <div className="h-44 bg-white/5 relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full items-center justify-center"
                      style={{ display: product.imageUrl ? "none" : "flex" }}
                    >
                      <ImageIcon className="w-12 h-12 text-muted-foreground opacity-30" />
                    </div>
                  </div>

                  {/* بيانات المنتج */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product._id, product.name)}
                      className="text-red-400 hover:text-red-500 hover:bg-red-500/10 w-full mt-1"
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف المنتج
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}