import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Package,
  ImageIcon,
  MessageCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext.jsx";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import Header from "@/components/Header.jsx";
import axios from "axios";

const API = "https://bonus-system-tau.vercel.app/api/products";
const WHATSAPP_NUMBER = "201009012719";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
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

  const openWhatsApp = (product) => {
    const message = `أهلاً نسر البرية، محتاج أستفسر عن سعر وتفاصيل منتج: ${product.name}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>منتجاتنا - نسر البرية</title>
        <meta name="description" content="تصفح منتجات نسر البرية" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                منتجاتنا 🛍️
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                تصفح المنتجات واضغط على أي منتج للتفاصيل
              </p>
            </div>
          </motion.div>

          {/* Loading & Grid */}
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Package className="w-20 h-20 text-muted-foreground mx-auto mb-5 opacity-20" />
              <p className="text-2xl font-bold text-foreground">مفيش منتجات حالياً</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-card/60 backdrop-blur-md hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-muted-foreground opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-sm sm:text-lg text-foreground line-clamp-1">{product.name}</h3>
                    <p className="text-[11px] sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                      {product.description || "اضغط للتفاصيل"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        {/* شلنا الـ Close الأصلي بتاع Shadcn عن طريق استهداف الكلاس بتاعه في CSS أو استبدال المحتوى */}
        <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-fit [&>button]:hidden">
          <DialogTitle className="sr-only">{selectedProduct?.name}</DialogTitle>
          
          <AnimatePresence>
            {selectedProduct && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-[90vw] max-w-[350px] rounded-[2.5rem] overflow-hidden bg-[#0f0f0f] border border-white/10 shadow-2xl mx-auto"
              >
                {/* زرار القفل - واحد بس وشكله شيك */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center text-white/80 hover:text-white border border-white/10 transition-all active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* الصورة */}
                <div className="w-full h-[260px] bg-[#1a1a1a] flex items-center justify-center p-4">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-muted-foreground opacity-20" />
                  )}
                </div>

                {/* المحتوى */}
                <div className="p-6 pt-2">
                  <h2 className="text-xl font-bold text-white mb-3 text-center">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-400 text-center line-clamp-4 px-2">
                    {selectedProduct.description || "لا يوجد وصف متاح لهذا المنتج حالياً."}
                  </p>

                  <Button
                    onClick={() => openWhatsApp(selectedProduct)}
                    className="w-full mt-6 h-12 rounded-2xl text-base font-bold bg-[#25D366] hover:bg-[#1ebe5b] text-white shadow-lg shadow-[#25D366]/20 transition-transform active:scale-[0.98]"
                  >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    اطلب الآن عبر واتساب
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}