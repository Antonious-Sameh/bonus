import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ArrowRight, Package, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext.jsx";
import Header from "@/components/Header.jsx";
import axios from "axios";

const API = "https://bonus-system-tau.vercel.app/api/products";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API);
        setProducts(res.data);
      } catch {
        // هندل الخطأ بشكل صامت
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBack = () => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate(`/customer/${user?.phone}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>منتجاتنا - نسر البرية</title>
        <meta name="description" content="تصفح منتجات نسر البرية" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* رأس الصفحة */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold text-foreground">
                منتجاتنا 🛍️
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                تصفح كل منتجاتنا المتاحة
              </p>
            </div>
          </motion.div>

          {/* المحتوى */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Package className="w-20 h-20 text-muted-foreground mx-auto mb-5 opacity-30" />
              <p className="text-2xl font-bold text-foreground">
                مفيش منتجات دلوقتي
              </p>
              <p className="text-muted-foreground mt-2">
                هنضيف منتجات قريباً، ابقى اتابع!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(57,255,20,0.08)] transition-all duration-300 group"
                >
                  {/* صورة المنتج */}
                  <div className="h-52 bg-white/5 relative overflow-hidden">
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
                      className="w-full h-full items-center justify-center bg-white/5"
                      style={{ display: product.imageUrl ? "none" : "flex" }}
                    >
                      <ImageIcon className="w-14 h-14 text-muted-foreground opacity-25" />
                    </div>

                    {/* شريط الـ glow في الأسفل */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
                  </div>

                  {/* بيانات المنتج */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    )}
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