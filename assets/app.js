/* Web Mania - Frontend v4 (mobile fix, home link, persistent panels, full i18n, socials icons, BG, logo fix) */
(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
  const html = document.documentElement, body = document.body;

  // Year
  const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());

  // Load Tabler Icons
  function ensureIcons() {
    if (!document.querySelector('link[data-icons="tabler"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css';
      link.setAttribute('data-icons', 'tabler');
      document.head.appendChild(link);
    }
  }
  ensureIcons();

  // Inject panels if missing
  function ensurePanels() {
    if (!$('#theme-panel')) {
      const el = document.createElement('div');
      el.id = 'theme-panel'; el.hidden = true;
      el.innerHTML = `
        <div class="panel-head">
          <strong>انتخاب تم</strong>
          <button class="panel-close" aria-label="بستن">×</button>
        </div>
        <div class="panel-body">
          <div class="row">
            <label><input type="radio" name="mode" value="dark"> تیره</label>
            <label><input type="radio" name="mode" value="light"> روشن</label>
          </div>
          <hr>
          <div class="swatches">
            <button class="swatch" data-accent="neongreen" style="--sw:#00ff95" title="سبز فوسفری"></button>
            <button class="swatch" data-accent="skyblue"   style="--sw:#6ecbff" title="آبی آسمانی"></button>
            <button class="swatch" data-accent="orange"    style="--sw:#ff6a00" title="نارنجی"></button>
            <button class="swatch" data-accent="purple"    style="--sw:#a06cd5" title="بنفش"></button>
            <button class="swatch" data-accent="magenta"   style="--sw:#ff2e88" title="سرخابی"></button>
          </div>
        </div>`;
      document.body.appendChild(el);
    }
    if (!$('#lang-panel')) {
      const el = document.createElement('div');
      el.id = 'lang-panel'; el.hidden = true;
      el.innerHTML = `
        <div class="panel-head">
          <strong>Language / زبان</strong>
          <button class="panel-close" aria-label="Close">×</button>
        </div>
        <div class="panel-body">
          <label><input type="radio" name="lang" value="fa"> فارسی</label>
          <label><input type="radio" name="lang" value="en"> English</label>
        </div>`;
      document.body.appendChild(el);
    }
  }
  ensurePanels();

  // Header active and HOME link
  const nav = $('.site-nav');
  function ensureHomeLink() {
    if (!nav) return;
    const hasHome = !!$$('a', nav).find(a => (a.getAttribute('href')||'').endsWith('index.html'));
    if (!hasHome) {
      const a = document.createElement('a');
      a.href = 'index.html';
      a.className = 'home-link';
      a.textContent = (html.lang === 'en') ? 'Home' : 'خانه';
      nav.insertBefore(a, nav.firstChild);
    }
  }
  ensureHomeLink();

  // Active nav by page
  const page = body.dataset.page || '';
  if (nav) $$('a', nav).forEach(a => {
    const href = a.getAttribute('href')||'';
    if (href && page && href.includes(page)) a.classList.add('active');
    if (page === 'home' && href.endsWith('index.html')) a.classList.add('active');
  });

  // Mobile menu
  const menuBtn = $('.menu-toggle');
  if (menuBtn) {
    menuBtn.innerHTML = '<i class="ti ti-menu-2"></i>';
    menuBtn.addEventListener('click', e => { e.stopPropagation(); body.classList.toggle('nav-open'); });
    window.addEventListener('resize', () => { if (innerWidth > 900) body.classList.remove('nav-open'); });
    document.addEventListener('click', () => body.classList.remove('nav-open'));
  }

  // State
  const THEME_KEY='wm.theme', ACCENT_KEY='wm.accent', LANG_KEY='wm.lang';
  const savedTheme = localStorage.getItem(THEME_KEY) || body.getAttribute('data-theme') || 'dark';
  const savedAccent = localStorage.getItem(ACCENT_KEY) || body.getAttribute('data-accent') || 'neongreen';
  const savedLang = localStorage.getItem(LANG_KEY) || (html.lang || 'fa');
  body.setAttribute('data-theme', savedTheme);
  body.setAttribute('data-accent', savedAccent);
  html.lang = savedLang; html.dir = (savedLang==='fa' || savedLang==='ar') ? 'rtl':'ltr';

  // Panels open/close (no premature close)
  const themeBtn = $('#themeBtn'), langBtn = $('#langBtn');
  const themePanel = $('#theme-panel'), langPanel = $('#lang-panel');
  if (themeBtn && !themeBtn.innerHTML.trim()) themeBtn.innerHTML = '<i class="ti ti-color-swatch"></i>';
  if (langBtn && !langBtn.innerHTML.trim())   langBtn.innerHTML   = '<i class="ti ti-language"></i>';

  function openPanel(panel, anchor) {
    panel.hidden = false;
    requestAnimationFrame(()=>panel.classList.add('open'));
    let openedAt = Date.now();
    function onEsc(e){ if (e.key==='Escape') closePanel(panel); }
    function onDoc(e){
      if (Date.now() - openedAt < 120) return; // ignore first click
      const t = e.target;
      if (panel.contains(t) || t === anchor) return;
      closePanel(panel);
    }
    panel.addEventListener('click', e => e.stopPropagation()); // clicks inside won't bubble
    document.addEventListener('keydown', onEsc);
    setTimeout(()=>document.addEventListener('click', onDoc), 0);
    panel._cleanup = ()=>{ document.removeEventListener('keydown', onEsc); document.removeEventListener('click', onDoc); };
  }
  function closePanel(panel) {
    if (!panel || panel.hidden) return;
    panel.classList.remove('open');
    panel.addEventListener('transitionend', ()=>{ panel.hidden = true; panel._cleanup && panel._cleanup(); }, { once:true });
  }
  if (themeBtn && themePanel) {
    themeBtn.addEventListener('click', e => { e.stopPropagation(); themePanel.hidden ? openPanel(themePanel, themeBtn) : closePanel(themePanel); });
    $('.panel-close', themePanel).addEventListener('click', ()=>closePanel(themePanel));
  }
  if (langBtn && langPanel) {
    langBtn.addEventListener('click', e => { e.stopPropagation(); langPanel.hidden ? openPanel(langPanel, langBtn) : closePanel(langPanel); });
    $('.panel-close', langPanel).addEventListener('click', ()=>closePanel(langPanel));
  }

  // Theme radios & Accent swatches
  $$('input[name="mode"]', themePanel).forEach(r => {
    r.checked = (r.value === savedTheme);
    r.addEventListener('change', ()=>{ body.setAttribute('data-theme', r.value); localStorage.setItem(THEME_KEY, r.value); });
  });
  $$('.swatch', themePanel).forEach(btn => btn.addEventListener('click', ()=>{
    body.setAttribute('data-accent', btn.dataset.accent);
    localStorage.setItem(ACCENT_KEY, btn.dataset.accent);
  }));

  // i18n dictionary (selectors-based so whole pages switch)
  const tr = {
    home: [
      { sel: '.hero .hero-text h1', en: 'Web Mania — World‑class Web Design & Development' },
      { sel: '.hero .subtitle', en: 'From discovery to deployment: fast, secure, SEO‑first and scalable websites with stunning design.' },
      { sel: '.cta-group .btn-primary', en: 'Start a Project' },
      { sel: '.cta-group .btn-ghost',   en: 'View Portfolio' },
      { sel: 'section .container h2', en: 'Everything your website needs — we deliver' }, // first section title
      { sel: 'section .container .section-sub', en: 'UI/UX, Full‑stack, eCommerce, SEO and launch' },
      { sel: '.section.alt h2', en: 'Packages' },
      { sel: '.section.cta h3', en: 'Need a free consultation?' },
      { sel: '.section.cta p',  en: 'Fill the quote form or message us on Telegram.' }
    ],
    about: [
      { sel: '.page-hero .container h1', en: 'About Web Mania' },
      { sel: '.page-hero .container p',  en: 'We blend creativity, engineering and an obsession for quality.' },
      { sel: '.about-text h2', en: 'Who we are' },
      { sel: '.about-text p',  en: 'Web Mania is a multi‑disciplinary team building modern websites end to end — from discovery and UX design to development, SEO, deployment and support.' },
      { sel: '.checks li:nth-child(1)', en: 'Standard and agile process' },
      { sel: '.checks li:nth-child(2)', en: 'Clean code and documentation' },
      { sel: '.checks li:nth-child(3)', en: 'Speed and SEO focus' },
      { sel: '.timeline .t-item:nth-child(1) .t-content h3', en: 'Kickoff' },
      { sel: '.timeline .t-item:nth-child(2) .t-content h3', en: 'Service expansion' },
      { sel: '.timeline .t-item:nth-child(3) .t-content h3', en: 'Scale' },
      { sel: '.values .value:nth-child(1) h3', en: 'Quality' },
      { sel: '.values .value:nth-child(2) h3', en: 'Speed' },
      { sel: '.values .value:nth-child(3) h3', en: 'Transparency' },
      { sel: '.section.cta h3', en: 'Let’s talk about your project' },
      { sel: '.section.cta p',  en: 'Book a free session and choose the best path.' }
    ],
    services: [
      { sel: '.page-hero .container h1', en: 'Our Services' },
      { sel: '.page-hero .container p',  en: 'Everything you need to launch and grow your website.' },
      { sel: '#design.card h3',      en: 'UI/UX Design' },
      { sel: '#development.card h3', en: 'Frontend & Backend Development' },
      { sel: '#ecommerce.card h3',   en: 'E‑commerce' },
      { sel: '#seo.card h3',         en: 'SEO & Performance' },
      { sel: '#support.card h3',     en: 'Support & Maintenance' },
      { sel: '#branding.card h3',    en: 'Branding & Content' },
      // Quote form labels/placeholders
    ],
    portfolio: [
      { sel: '.page-hero .container h1', en: 'Portfolio & Templates' },
      { sel: '.page-hero .container p',  en: 'Real projects plus an interactive template viewer.' },
      { sel: 'h2', en: 'Featured Projects' },
      { sel: 'h2 + .grid-3 + h2', en: 'Ready‑made Templates' }
    ],
    pricing: [
      { sel: '.page-hero .container h1', en: 'Packages' },
      { sel: '.page-hero .container p',  en: 'Upgradeable and customizable for your needs.' },
      { sel: '#startup h3',   en: 'Startup' },
      { sel: '#business h3',  en: 'Business' },
      { sel: '#enterprise h3',en: 'Enterprise' },
      { sel: '.note p', en: 'Prices vary based on scope. For an accurate estimate, please fill the quote form.' }
    ],
    faq: [
      { sel: '.page-hero .container h1', en: 'Frequently Asked Questions' },
      { sel: '.page-hero .container p',  en: 'Didn’t find your answer? Contact us.' },
      { sel: '.accordion details:nth-child(1) summary', en: 'How long does a project take?' },
      { sel: '.accordion details:nth-child(1) p',       en: 'Depending on scope, 10–30 days. Larger custom projects follow a dedicated plan.' },
      { sel: '.accordion details:nth-child(2) summary', en: 'Do you handle SEO?' },
      { sel: '.accordion details:nth-child(2) p',       en: 'Yes — technical SEO, content structure and performance optimization.' },
      { sel: '.accordion details:nth-child(3) summary', en: 'What about support after delivery?' },
      { sel: '.accordion details:nth-child(3) p',       en: 'We offer monthly support packages with SLA.' }
    ],
    contact: [
      { sel: '.page-hero .container h1', en: 'Contact & Consultation' },
      { sel: '.page-hero .container p',  en: 'Fastest ways: Telegram or the form below.' },
      { sel: '.contact-grid .card h3',   en: 'Consultation Form' },
      { sel: '.contact-grid .card + .card h3', en: 'Contact info' }
    ]
  };

  function setText(sel, en) {
    const el = document.querySelector(sel);
    if (!el) return;
    if (!el.dataset.txtFa) el.dataset.txtFa = el.textContent;
    el.textContent = (html.lang === 'en') ? en : el.dataset.txtFa;
  }
  function setBtnText(el, en) {
    if (!el) return;
    if (!el.dataset.txtFa) el.dataset.txtFa = el.textContent.trim();
    const label = (html.lang === 'en') ? en : el.dataset.txtFa;
    // keep icon if exists
    if (el.querySelector('i')) {
      const span = el.querySelector('span') || document.createElement('span');
      span.textContent = label;
      if (!span.parentNode) el.appendChild(span);
    } else {
      el.textContent = label;
    }
  }

  function translateForms(lang) {
    // Services quote form
    const q = $('#quoteForm');
    if (q) {
      const L = (fa, en) => (lang==='en' ? en : fa);
      const setLabByName = (name, en) => {
        const inp = q.querySelector(`[name="${name}"]`);
        if (!inp) return;
        const lab = inp.closest('div')?.querySelector('label');
        if (lab) { if (!lab.dataset.txtFa) lab.dataset.txtFa = lab.textContent; lab.textContent = L(lab.dataset.txtFa, en); }
      };
      const setPHByName = (name, en) => {
        const inp = q.querySelector(`[name="${name}"]`);
        if (inp) { if (!inp.dataset.phFa) inp.dataset.phFa = inp.placeholder; inp.placeholder = L(inp.dataset.phFa, en); }
      };
      setLabByName('firstName', 'First name');
      setLabByName('lastName',  'Last name');
      setLabByName('phone',     'Mobile phone');
      setLabByName('email',     'Email (optional)');
      setLabByName('budget',    'Approx. budget');
      setLabByName('timeline',  'Timeline');
      setLabByName('message',   'Project details');
      setPHByName('firstName',  'First name');
      setPHByName('lastName',   'Last name');
      setPHByName('phone',      '09xxxxxxxxx');
      setPHByName('email',      'you@example.com');
      const ta = q.querySelector('textarea[name="message"]');
      if (ta) { if (!ta.dataset.phFa) ta.dataset.phFa = ta.placeholder; ta.placeholder = L(ta.dataset.phFa, 'Tell us about your needs and goals...'); }

      const btnSubmit = q.querySelector('button[type="submit"]');
      setBtnText(btnSubmit, 'Send & get a quote');
      const tg = $('#sendTelegram'); setBtnText(tg, 'Send via Telegram');
      const sms = $('#sendSms'); if (sms) { if (!sms.dataset.txtFa) sms.dataset.txtFa = sms.textContent; sms.textContent = (lang==='en' ? 'Send SMS' : sms.dataset.txtFa); }
      const hint = q.querySelector('.hint');
      if (hint) { if (!hint.dataset.txtFa) hint.dataset.txtFa = hint.textContent; hint.textContent = L(hint.dataset.txtFa, 'No backend: data is processed locally. For Telegram we build a share link.'); }
      // Chips labels remain as-is unless needed
    }
    // Contact form
    const c = $('#contactForm');
    if (c) {
      const L = (fa, en) => (lang==='en' ? en : fa);
      const setLab = (name, en) => {
        const inp = c.querySelector(`[name="${name}"]`);
        const lab = inp?.closest('div')?.querySelector('label');
        if (lab) { if (!lab.dataset.txtFa) lab.dataset.txtFa = lab.textContent; lab.textContent = L(lab.dataset.txtFa, en); }
      };
      const setPH = (name, en) => {
        const inp = c.querySelector(`[name="${name}"]`);
        if (inp) { if (!inp.dataset.phFa) inp.dataset.phFa = inp.placeholder; inp.placeholder = L(inp.dataset.phFa, en); }
      };
      setLab('name', 'Name');
      setLab('phone', 'Mobile phone');
      setLab('subject', 'Subject');
      setLab('message', 'Message');
      setPH('name', 'Your name');
      setPH('phone', '09xxxxxxxxx');
      setPH('subject', 'What is it about?');
      const ta = c.querySelector('textarea[name="message"]');
      if (ta) { if (!ta.dataset.phFa) ta.dataset.phFa = ta.placeholder; ta.placeholder = L(ta.dataset.phFa, 'How can we help?'); }
      const submit = c.querySelector('button[type="submit"]'); setBtnText(submit, 'Send');
    }
  }

  function applyPageTranslations(lang) {
    const arr = tr[page] || tr.home;
    arr.forEach(item => setText(item.sel, item.en));
    translateForms(lang);
    // Update home-link text
    const homeLink = nav && nav.querySelector('a.home-link');
    if (homeLink) homeLink.textContent = (lang === 'en' ? 'Home' : 'خانه');
  }

  // Language radios
  $$('input[name="lang"]', langPanel).forEach(r => {
    r.checked = (r.value === savedLang);
    r.addEventListener('change', () => setLanguage(r.value));
  });

  function setLanguage(lang) {
    html.lang = lang; html.dir = (lang==='fa'||lang==='ar')?'rtl':'ltr';
    localStorage.setItem(LANG_KEY, lang);
    // Header nav text (static links)
    if (nav) {
      const map = (lang==='en')
        ? { 'services.html':'Services','portfolio.html':'Portfolio','pricing.html':'Pricing','about.html':'About','faq.html':'FAQ','contact.html':'Free Consultation' }
        : { 'services.html':'خدمات','portfolio.html':'نمونه‌کار','pricing.html':'پکیج‌ها','about.html':'درباره','faq.html':'سوالات','contact.html':'مشاوره رایگان' };
      $$('a', nav).forEach(a => {
        const href = a.getAttribute('href')||'';
        Object.keys(map).forEach(k => { if (href.endsWith(k)) a.textContent = map[k]; });
      });
      ensureHomeLink();
      const homeLink = nav.querySelector('.home-link');
      if (homeLink) homeLink.textContent = (lang==='en' ? 'Home' : 'خانه');
    }
    // Page-specific
    applyPageTranslations(lang);
  }
  setLanguage(savedLang);

  // Reveal
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }), {threshold:.15});
    revealEls.forEach(el=>io.observe(el));
  }

  // Counters
  const nums = $$('.num[data-to]');
  if (nums.length) {
    const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ animateNum(e.target, Number(e.target.dataset.to||0)); io.unobserve(e.target);} }), {threshold:.6});
    nums.forEach(n=>io.observe(n));
  }
  function animateNum(el, to){
    const dur=1200, start=performance.now(), from=0;
    const fmt=v=>Intl.NumberFormat(html.lang||'fa-IR').format(Math.floor(v));
    function tick(t){ const p=Math.min(1,(t-start)/dur), eased=1-Math.pow(1-p,3); el.textContent=fmt(from+(to-from)*eased); if(p<1) requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  }

  // Hero image fallback + avoid duplicate brand text
  const brandImg = $('.brand img'), brand = $('.brand');
  if (brandImg) {
    brandImg.addEventListener('error', () => {
      const hasSpan = !!(brand && brand.querySelector('span'));
      brandImg.remove();
      if (!hasSpan && brand) {
        const s = document.createElement('span'); s.textContent = 'Web Mania'; brand.appendChild(s);
      }
    }, { once:true });
  }

  // 3D BG per page
  initReactiveBG();
  function initReactiveBG(){
    let heroes = $$('.with-3d');
    if (!heroes.length) { const f=$('.page-hero, .hero'); if (f) { f.classList.add('with-3d'); heroes=[f]; } }
    if (!heroes.length) return;
    const presets = {
      home:{type:'lines',step:70,wave:2.0,speed:1.6,influence:180},
      about:{type:'dots', step:66,wave:5.0,speed:0.6,dot:2.2},
      services:{type:'lines',step:55,wave:3.0,speed:1.2,influence:150},
      portfolio:{type:'dots', step:60,wave:6.0,speed:0.8,dot:2.4},
      pricing:{type:'lines',step:80,wave:1.6,speed:0.9,influence:140},
      faq:{type:'dots', step:68,wave:4.0,speed:0.5,dot:1.8},
      contact:{type:'lines',step:60,wave:2.6,speed:1.3,influence:170},
      viewer:{type:'lines',step:72,wave:2.2,speed:1.0,influence:160}
    };
    const cfg = presets[page] || presets.home;
    heroes.forEach(sec=>{
      let c = $('.bg-canvas, #bg-canvas', sec);
      if (!c) { c=document.createElement('canvas'); c.className='bg-canvas'; sec.prepend(c); }
      createEngine(c, cfg);
    });
  }
  function createEngine(canvas, opt){
    const ctx = canvas.getContext('2d');
    let dpr=Math.min(2, window.devicePixelRatio||1), w=0,h=0,t=0;
    let points=[]; const M={x:-9999,y:-9999};
    function resize(){ const p=canvas.parentElement||document.body;
      w=p.clientWidth; h=p.clientHeight; dpr=Math.min(2,window.devicePixelRatio||1);
      canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
      canvas.style.width=w+'px'; canvas.style.height=h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0); build();
    }
    function build(){ points=[]; const step=Math.max(40,opt.step||70); const cols=Math.ceil(w/step)+1; const rows=Math.ceil(h/step)+1;
      for(let y=0;y<rows;y++){ const row=[]; for(let x=0;x<cols;x++){ row.push({x0:x*step,y0:y*step,x:x*step,y:y*step,n:Math.random()*1000}); } points.push(row); } }
    function color(a){ const acc=getComputedStyle(document.body).getPropertyValue('--accent').trim()||'#00ff95'; return hexToRgba(acc,a); }
    function drawLines(){ ctx.clearRect(0,0,w,h); t+=0.016*(opt.speed||1.0);
      const glow=color(0.28), stroke=color(0.85); ctx.lineWidth=1.1;
      for(let r=0;r<points.length;r++){ ctx.beginPath();
        for(let c=0;c<points[r].length;c++){ const p=points[r][c]; const dx=M.x-p.x0, dy=M.y-p.y0; const dist=Math.hypot(dx,dy)||1;
          const influence=Math.min(30,(opt.influence||160)/(dist+10)); const angle=Math.atan2(dy,dx);
          const wave=Math.sin(t*1.5+p.n+p.x0*0.01+p.y0*0.01)*(opt.wave||2);
          p.x=p.x0-Math.cos(angle)*influence+wave; p.y=p.y0-Math.sin(angle)*influence+wave;
          if(c===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
        }
        ctx.strokeStyle=glow; ctx.shadowColor=glow; ctx.shadowBlur=8; ctx.stroke();
        ctx.shadowBlur=0; ctx.strokeStyle=color(0.8); ctx.stroke();
      }
      requestAnimationFrame(drawLines);
    }
    function drawDots(){ ctx.clearRect(0,0,w,h); t+=0.016*(opt.speed||0.8);
      const glow=color(0.25), fill=color(0.85), size=(opt.dot||2.2);
      for(let r=0;r<points.length;r++){ for(let c=0;c<points[r].length;c++){ const p=points[r][c]; const dx=M.x-p.x0, dy=M.y-p.y0; const dist=Math.hypot(dx,dy)||1;
          const push=Math.min(18,140/(dist+10)); const angle=Math.atan2(dy,dx);
          const wave=Math.sin(t*1.4+p.n+p.x0*0.02+p.y0*0.02)*(opt.wave||5);
          p.x=p.x0-Math.cos(angle)*push+wave; p.y=p.y0-Math.sin(angle)*push+wave;
          ctx.beginPath(); ctx.fillStyle=glow; ctx.shadowColor=glow; ctx.shadowBlur=10; ctx.arc(p.x,p.y,size+0.6,0,Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.shadowBlur=0; ctx.fillStyle=fill; ctx.arc(p.x,p.y,size,0,Math.PI*2); ctx.fill();
      } }
      requestAnimationFrame(drawDots);
    }
    function onMove(e){ const r=canvas.getBoundingClientRect(); const t=e.touches&&e.touches[0]; const x=(t?t.clientX:e.clientX)-r.left; const y=(t?t.clientY:e.clientY)-r.top; M.x=x; M.y=y; }
    function onLeave(){ M.x=-9999; M.y=-9999; }
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('touchmove', onMove, {passive:true});
    canvas.addEventListener('touchend', onLeave);
    resize(); (opt.type==='dots'?drawDots:drawLines)();
  }
  function hexToRgba(hex,a=1){ let c=hex.replace('#','').trim(); if(c.length===3) c=c.split('').map(x=>x+x).join(''); const n=parseInt(c,16); const r=(n>>16)&255, g=(n>>8)&255, b=n&255; return `rgba(${r},${g},${b},${a})`; }

  // Social icons (icon-only with accessible text)
  function iconizeSocials() {
    const map = [
      { test: /instagram\.com/i, icon: 'ti-brand-instagram', labelFa: 'اینستاگرام', labelEn: 'Instagram' },
      { test: /t\.me|telegram\.me|telegram\.org/i, icon: 'ti-brand-telegram', labelFa: 'تلگرام', labelEn: 'Telegram' },
      { test: /github\.com/i, icon: 'ti-brand-github', labelFa: 'گیت‌هاب', labelEn: 'GitHub' },
      { test: /rubika\.ir/i, icon: 'ti-world', labelFa: 'روبیکا', labelEn: 'Rubika' }
    ];
    const anchors = [
      ...$$('.socials a'),
      ...$$('.contact-grid .card .list a')
    ];
    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      const m = map.find(x => x.test.test(href));
      if (!m) return;
      a.classList.add('social-icon');
      const label = (html.lang === 'en') ? m.labelEn : m.labelFa;
      a.setAttribute('aria-label', label);
      a.innerHTML = `<i class="ti ${m.icon}" aria-hidden="true"></i><span class="sr-only">${label}</span>`;
    });
  }
  iconizeSocials();

})();
// Open templates in viewer via data-view
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[data-view]');
  if (!a) return;
  e.preventDefault();
  const url = a.getAttribute('href');
  const title = a.getAttribute('data-title') || a.textContent.trim() || 'Template';
  location.href = 'template-viewer.html?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url);
});
// Normalizer: github.com -> github.io (Pages)
function normalizeTemplateUrl(u) {
  try {
    const url = new URL(u, location.href);
    if (url.hostname === 'github.com') {
      const [user, repo] = url.pathname.split('/').filter(Boolean);
      return `https://${user}.github.io/${repo}/`;
    }
    return url.href || u;
  } catch { return u; }
}

document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[data-view]');
  if (!a) return;
  e.preventDefault();
  const raw = a.getAttribute('href');
  const url = normalizeTemplateUrl(raw);
  const title = a.getAttribute('data-title') || a.textContent.trim() || 'Template';
  location.href = 'template-viewer.html?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url);
});
const status = document.getElementById('vStatus');
let loaded = false;
frame.addEventListener('load', () => { loaded = true; if (status) status.style.display = 'none'; });
setTimeout(() => {
  if (!loaded && status) status.style.display = 'block';
}, 2500);