import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// عنوان السيرفر بتاعنا (تأكد إن السيرفر شغال على بورت 5000)
const API_URL = 'https://bonus-system-tau.vercel.app/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // أول ما الموقع يفتح، بنشوف هل فيه مستخدم مسجل دخول في المتصفح؟
  useEffect(() => {
    const storedUser = localStorage.getItem('loyaltyUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 1. تسجيل الدخول من الباك إيند
  const login = async (phone, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { phone, password });
      const userData = response.data.user;
      
      setUser(userData);
      localStorage.setItem('loyaltyUser', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'حصلت مشكلة في الاتصال بالسيرفر' 
      };
    }
  };

  // 2. تسجيل الخروج
  const logout = () => {
    setUser(null);
    localStorage.removeItem('loyaltyUser');
  };

  // 3. إضافة نقاط (بتكلم الـ Admin API)
  const addPoints = async (customerPhone, billAmount, note) => {
    try {
      const response = await axios.post(`${API_URL}/admin/add-points`, { 
        phone: customerPhone, 
        amount: billAmount,
        note: note // 💡 بنبعت الملاحظة للسيرفر هنا
      });
      return { 
        success: true, 
        message: response.data.message, 
        pointsAdded: Math.floor(billAmount / 10) 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'فشل إضافة النقاط' 
      };
    }
  };

  // 4. تسجيل زبون جديد في الداتابيز
  // 4. تسجيل زبون جديد في الداتابيز
  const registerCustomer = async (name, phone, password, customerCode) => {
    try {
      // ضفنا الـ customerCode هنا عشان يتبعت للسيرفر
      await axios.post(`${API_URL}/auth/register`, { 
        name, 
        phone, 
        password, 
        customerCode, 
        role: 'customer' 
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'فشل تسجيل الزبون' 
      };
    }
  };

  // 5. جلب بيانات زبون معين بالنقاط بتاعته
  const getCustomerData = async (phone) => {
    try {
      const response = await axios.get(`${API_URL}/admin/customer/${phone}`);
      return response.data; // هيرجع الـ user والـ history
    } catch (error) {
      console.error("Error fetching customer data", error);
      return null;
    }
  };

  const value = {
    user,
    login,
    logout,
    addPoints,
    registerCustomer,
    getCustomerData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}