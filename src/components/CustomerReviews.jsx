import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronRight, ChevronLeft } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    initial: "م",
    label: "عميل منتظم",
    date: "منذ أسبوع",
    rating: 5,
    text: "محل محترم جداً والبضاعة أصلية 100%، اشتريت شاحن وسماعة وكل حاجة بضمان. نظام النقاط ده حلو برضو، كسبت نقاط وصرفتهم في شراية جديدة 👍",
  },
  {
    id: 2,
    initial: "أ",
    label: "عميل جديد",
    date: "منذ أسبوعين",
    rating: 5,
    text: "يا عم يوسف، والله أنا من غير أي حاجة أنا حاجتك أنا متأكد منها، وباجي آخد من عندك أنت بس، بس يعني السماعة كل حاجة فيها تمام وزي الفل وبطاريتها بصراحة تحفة. يعني قد الدنيا الدنيا مش قدك يا عم يوسف، السماعة طرش الطرش، بطاريتها كويسة، المايك بتاعها كويس خالص، الصوت بتاعها واضح جدا، يعني زي الفل. بقالها حوالي ساعتين أو أكتر شغالة لحد دلوقتي حوالي 88% أو 85% يعني.. زي الفل يا عم يوسف.,"
  },
  {
    id: 3,
    initial: "س",
    label: "عميل دائم",
    date: "منذ 3 أسابيع",
    rating: 5,
    text: "عندي كارت نقاط من زمان وكل ما أجي أشتري بكسب نقاط. اتفاجأت لما لقيت إن نقاطي وصلت لحد إني قدرت أشتري كفر موبايل بيها. شكراً!",
  },
  {
    id: 4,
    initial: "ع",
    label: "عميل منتظم",
    date: "منذ شهر",
    rating: 5,
    text: "شغلك كويس جداً للامانه وانت راجل امين ❤️",
  },
  {
    id: 5,
    initial: "ح",
    label: "عميل دائم",
    date: "منذ شهر",
    rating: 5,
    text:"الموبايل كان بيشحن ف اكتر من ساعتين وشويه دلوقتي مبيكملش الساعه الله يباركلك ي صحبي ومكنش فيه وصله بتعمر معايا دي بقالها فتره ..حاجه نضيفه الله يباركلك 😍",
  },
  {
    id: 6,
    initial: "ف",
    label: "عميل منتظم",
    date: "منذ شهرين",
    rating: 5,
    text: "النظام الجديد بتاع النقاط ده فكرة ذكية! حاسس إني بوفر فلوس كل ما أتسوق. المحل دايم فيه أحدث الموديلات وده اللي بيخليني أرجعله.",
  },
  {
    id: 7,
    initial: "م",
    label: "عميل منتظم",
    date: "منذ شهرين",
    rating: 5,
    text: "شاحن جامد بصراحه مفرقش حاجه عن الاصلي شكرا استاذ يوسف عل اهتمامك ❤️",
  },
];

const COLORS = ["#fbbf24", "#a78bfa", "#34d399", "#60a5fa", "#f87171", "#fb923c"];

function StarRow({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="w-3.5 h-3.5"
          style={{ color: i <= count ? "#fbbf24" : "rgba(255,255,255,0.12)", fill: i <= count ? "#fbbf24" : "transparent" }} />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const color = COLORS[(review.id - 1) % COLORS.length];
  return (
    <div className="relative rounded-2xl p-4 flex flex-col gap-3 w-full h-full"
      style={{ background: "hsl(24 7% 11%)", border: "1px solid rgba(255,255,255,0.07)" }}>

      {/* علامة اقتباس */}
      <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-lg opacity-35"
        style={{ background: `${color}22` }}>
        <Quote className="w-3 h-3" style={{ color }} />
      </div>

      <StarRow count={review.rating} />

      <p className="text-sm leading-relaxed flex-1" style={{ color: "hsl(40 15% 76%)" }}>
        {review.text}
      </p>

      <div className="flex items-center justify-between pt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}28`, color }}>
            {review.initial}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-foreground/65">{review.label}</p>
            <p className="text-[10px] text-muted-foreground/45">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold"
          style={{ background: "#fbbf2410", border: "1px solid #fbbf2420", color: "#fbbf24" }}>
          <Star className="w-2.5 h-2.5 fill-current" />Google
        </div>
      </div>
    </div>
  );
}

export default function CustomerReviews() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const total = REVIEWS.length;

  const next = useCallback(() => setIdx(i => (i + 1) % total), [total]);
  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total]);

  // Auto-play
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4000);
  }, [next]);

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, [startTimer]);

  const stopAuto = () => clearInterval(timerRef.current);

  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);

  return (
    <section className="w-full">
      {/* هيدر */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
            style={{ color: "hsl(43 85% 58%)" }}>آراء عملاءنا</p>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-black text-foreground">ماذا يقولون عنا؟</h2>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold"
              style={{ background: "#fbbf2410", border: "1px solid #fbbf2420", color: "#fbbf24" }}>
              <Star className="w-2.5 h-2.5 fill-current" />{avg} / 5
            </div>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button onClick={() => { prev(); stopAuto(); }}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "hsl(40 10% 55%)" }}>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => { next(); stopAuto(); }}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "hsl(40 10% 55%)" }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* الكروت — موبايل: كارت واحد، sm+: اتنين */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={idx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <ReviewCard review={REVIEWS[idx]} />
            {/* الكارت التاني — بس على sm+ */}
            <div className="hidden sm:block">
              <ReviewCard review={REVIEWS[(idx + 1) % total]} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {REVIEWS.map((_, i) => (
          <button key={i}
            onClick={() => { setIdx(i); stopAuto(); }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === idx ? "18px" : "6px",
              height: "6px",
              background: i === idx ? "hsl(43 85% 58%)" : "rgba(255,255,255,0.15)"
            }} />
        ))}
      </div>

      
    </section>
  );
}