import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://bonus-system-tau.vercel.app/api/push";

// تحويل VAPID key من base64 لـ Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications(phone) {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [isSubscribed, setIsSubscribed] = useState(false);

  // تسجيل الـ Service Worker لما الـ hook يتحمل
  useEffect(() => {
    if (!phone || !("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const existing = await reg.pushManager.getSubscription();
        if (existing) setIsSubscribed(true);
      } catch (err) {
        console.error("SW registration failed:", err);
      }
    };
    register();
  }, [phone]);

  const requestPermission = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return false;

    try {
      // نجيب الـ VAPID public key من السيرفر
      const { data } = await axios.get(`${API}/vapid-public-key`);
      if (!data.publicKey) return false;

      // نطلب إذن الإشعارات
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return false;

      // نسجل الـ subscription
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });

      // نبعت الـ subscription للسيرفر ونربطها بالعميل
      await axios.post(`${API}/subscribe/${phone}`, { subscription });
      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error("Push subscription failed:", err);
      return false;
    }
  };

  return { permission, isSubscribed, requestPermission };
}