import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 border-t border-white/5 text-center bg-background/50 backdrop-blur-sm">
      <p className="text-sm text-muted-foreground">
        تم التطوير بواسطة 
        <span className="text-primary font-bold mx-1">م/ أنطونيوس سامح</span> 
        | للتواصل: 
        <a href="tel:01223307593" className="hover:text-primary transition-colors"> 01223307593</a>
      </p>
    </footer>
  );
}