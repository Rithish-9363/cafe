# ☕ Brew & Bliss — Coffee Shop Website

> **"Slow Mornings. Beautifully Brewed."**

A modern, responsive, and fully functional coffee shop web application built with vanilla HTML5, CSS3, and JavaScript.

![Brew & Bliss Preview](https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80&auto=format&fit=crop)

---

## ✨ Features

- **Responsive Single-Page Layout**: Seamless experience across mobile, tablet, laptop, and ultra-wide desktop screens.
- **Brand Aesthetic & Identity**: 
  - Palette: Soft Cream (`#F8F5EF`), Coffee Brown (`#76563E`), Dark Cocoa (`#302820`), Muted Sage (`#89917D`), Warm Beige (`#EEE8DE`).
  - Typography: *Playfair Display* (headings) & *DM Sans* (body).
- **Interactive Coffee Menu**:
  - Filter drinks by category: *All*, *Hot Coffee*, *Cold Coffee*, *Special Drinks*.
  - Real-time search by drink name or description.
  - Badges: *Best Seller*, *Staff Pick*, *Seasonal*, *Signature*.
- **Shopping Cart Drawer**:
  - Add to cart with visual confirmation and toast alerts.
  - Increment/decrement quantities and item removal.
  - Real-time price breakdown: Subtotal, 5% estimated tax, and Grand Total.
  - Persistent state saved to `localStorage` (cart persists across browser refreshes).
- **Smooth Navigation**:
  - Sticky glassmorphic navbar with active section scroll spying.
  - Mobile slide-out hamburger navigation.
  - Header search bar with smooth slide-down animation.
- **Forms & Validation**:
  - Contact form with inline error messaging and simulated submission state.
  - Newsletter subscription form with RFC-5322 email validation.
- **Visuals & Atmosphere**:
  - Micro-interactions, hover card elevations, image zoom effects, and masonry coffee gallery.
  - Embedded Google Maps location and cafe hours.

---

## 📁 Project Structure

```text
├── index.html              # Main HTML5 entrypoint with all 10 sections
├── css/
│   ├── styles.css          # Design tokens, CSS variables, typography & base resets
│   ├── components.css      # Buttons, cards, navbar, cart drawer, toast & form styles
│   ├── sections.css        # Specific layout rules for hero, menu, about, gallery, footer
│   └── responsive.css      # Tablet & mobile media queries
├── js/
│   ├── cart.js             # Cart state management, drawer UI, calculations & localStorage
│   ├── menu.js             # Product catalog, category filters & live search
│   ├── forms.js            # Contact & newsletter form validation
│   └── main.js             # Sticky header, mobile menu, scroll reveal animations
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

No build tools or package managers required. Simply open `index.html` or run a local server:

### Option 1: Direct in Browser
Double-click `index.html` or open it with your preferred browser.

### Option 2: Using Node.js
```bash
node -e "const http=require('http'),fs=require('fs'),path=require('path');const mime={'html':'text/html','css':'text/css','js':'application/javascript','png':'image/png','jpg':'image/jpeg','svg':'image/svg+xml'};http.createServer((req,res)=>{let p=req.url.split('?')[0]||'/';if(p==='/')p='/index.html';const fp=path.join(__dirname,p);if(!fs.existsSync(fp)){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',mime[path.extname(fp).slice(1)]||'text/plain');fs.createReadStream(fp).pipe(res);}).listen(3000,()=>console.log('Running at http://localhost:3000'));"
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
