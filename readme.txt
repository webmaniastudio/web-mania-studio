# README

- Brand: Web Mania
- Phone: +989055145596
- Instagram: https://www.instagram.com/webmania.studio?igsh=MTZ2eHJtZmk1aW1tZw==
- Telegram: https://t.me/Webmania_admin
- Rubika: https://rubika.ir/Webmania_admin
- GitHub: https://github.com/webmania-studio (change if needed)

How to use:
1) Open index.html in a modern browser. No backend required.
2) Language toggle (فا/En) switches all UI text and direction; persists in localStorage (wm_lang).
3) Accent color picker updates theme accents; persists (wm_accent).
4) Hero background uses three.js when available and motion is allowed. Use the toggle to disable/enable; persists (wm_effects).
5) Mobile menu: tap the hamburger; body scroll locks during open.
6) Portfolio filters show/hide cards by category.
7) Templates: click “پیشنمایش / Live Demo” to open a modal with a live srcdoc preview. Click “انتخاب قالب / Use This Template” to prefill the order form.
8) Services & Pricing: all prices are in Toman (تومان).
9) Order form:
   - Validates Iranian mobile numbers: +98xxxxxxxxxx or 09xxxxxxxxx.
   - On submit, the request is saved in localStorage (wm_orders) and quick-send buttons appear for Telegram/Instagram/Rubika/Phone. A mailto link is also provided.
10) Chat widget: bottom-right bubble. Simulated assistant collects name, email, phone and offers social/email options. Keyboard-accessible (Esc closes; Tab cycle).
11) Accessibility: semantic HTML, labels, ARIA roles, focus management for modal and chat, strong color contrast.
12) Performance: fonts preconnected; 3D throttled and disabled by prefers-reduced-motion; images and iframes lazy-loaded.

Replace placeholders if needed:
- Update links in footer/header.
- Replace assets/logo.svg with your own.
- Edit texts in /i18n/fa.json and /i18n/en.json.

Build notes:
- No external APIs. All data stored locally in browser.
- Tested on latest Chrome/Firefox/Safari mobile/desktop.