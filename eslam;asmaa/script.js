/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('out');
  }, 2400);
});

/* ============================================================
   STAR FIELD (envelope background)
   ============================================================ */
const starField = document.getElementById('starField');
for(let i = 0; i < 60; i++){
  const s = document.createElement('div');
  s.className = 'env-star';
  const size = Math.random() * 3 + 1;
  s.style.cssText = `
    width:${size}px; height:${size}px;
    top:${Math.random()*100}%; left:${Math.random()*100}%;
    animation-duration:${2 + Math.random()*4}s;
    animation-delay:${Math.random()*3}s;
  `;
  starField.appendChild(s);
}

/* ============================================================
   NAMES LETTER STAGGER
   ============================================================ */
const namesTitle = document.getElementById('namesTitle');
namesTitle.innerHTML = `
  <span class="word" style="animation-delay:0.5s">إسلام</span>
  <span class="amp">و</span>
  <span class="word" style="animation-delay:1.1s">أسماء</span>
`;

/* ============================================================
   ENVELOPE OPEN
   ============================================================ */
const wrap = document.getElementById('envelopeWrap');
const envScreen = document.getElementById('envelope-screen');
const site = document.getElementById('site');
const musicBtn = document.getElementById('music-btn');

wrap.addEventListener('click', () => {
  if(wrap.classList.contains('open')) return;
  wrap.classList.add('open');
  
  // تشغيل الموسيقى تلقائياً عند الضغط على الظرف
  bgMusic.play().catch(()=>{});
  musicBtn.textContent = '⏸';
  musicBtn.classList.add('playing');
  musicPlaying = true;

  setTimeout(() => {
    envScreen.classList.add('hidden');
    site.classList.add('reveal');
    document.body.style.overflow = 'auto';
    musicBtn.classList.add('visible');
    launchConfetti();
    
    // سكرول بطيء سينمائي لآخر الصفحة
    setTimeout(() => {
      let isAutoScrolling = true;
      
      function autoScroll() {
        if (!isAutoScrolling) return;
        
        window.scrollBy(0, 0.8); // 0.8 = سرعة بطيئة جداً وانسيابية
        
        // لو وصلنا لآخر الصفحة نوقف
        if (Math.ceil(window.scrollY + window.innerHeight) >= document.body.scrollHeight) {
          isAutoScrolling = false;
        }
        
        if (isAutoScrolling) {
          requestAnimationFrame(autoScroll);
        }
      }
      
      requestAnimationFrame(autoScroll);
      
      // لو المستخدم لمس الشاشة أو حرك الماوس بنفسه، نوقف السكرول التلقائي عشان ياخد هو التحكم
      const stopScroll = () => { isAutoScrolling = false; };
      window.addEventListener('wheel', stopScroll, { passive: true });
      window.addEventListener('touchstart', stopScroll, { passive: true });
      window.addEventListener('mousedown', stopScroll, { passive: true });
    }, 3500); // يستنى 3.5 ثواني عشان الناس تقرأ الأسماء قبل ما يبدأ يتحرك
  }, 1100);
});

/* ============================================================
   CONFETTI
   ============================================================ */
function launchConfetti(){
  const colors = [
    '#C8A45C','#EDD49A','#F5E0A0',  // gold shades
    '#6E1E2B','#8C3140','#B05060',  // burgundy shades
    '#F7EEDD','#EDDBBD',            // cream shades
    '#fff','#fff4e0'
  ];
  const shapes = ['rect','circle'];
  const total = 120;

  for(let i = 0; i < total; i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random()*colors.length)];
    const shape = shapes[Math.floor(Math.random()*shapes.length)];
    const size = 6 + Math.random()*8;
    const left = Math.random()*100;
    const dur = 2.5 + Math.random()*3;
    const delay = Math.random()*1.8;
    const skew = (Math.random()-0.5)*40;
    el.style.cssText = `
      left:${left}vw;
      width:${shape==='circle'?size:size*0.6}px;
      height:${shape==='circle'?size:size*1.4}px;
      border-radius:${shape==='circle'?'50%':'2px'};
      background:${color};
      transform:skew(${skew}deg);
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      opacity:1;
    `;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),(dur+delay+0.5)*1000);
  }
}
document.body.style.overflow = 'hidden';

/* ============================================================
   MUSIC
   ============================================================ */
const bgMusic = document.getElementById('bg-music');
let musicPlaying = false;
musicBtn.addEventListener('click', () => {
  if(musicPlaying){
    bgMusic.pause();
    musicBtn.textContent = '♪';
    musicBtn.classList.remove('playing');
    musicPlaying = false;
  } else {
    bgMusic.play().catch(()=>{});
    musicBtn.textContent = '⏸';
    musicBtn.classList.add('playing');
    musicPlaying = true;
  }
});

/* ============================================================
   COUNTDOWN
   ============================================================ */
const weddingDate = new Date('2026-09-15T20:00:00');
function tick(){
  const now = new Date();
  let diff = weddingDate - now;
  if(diff < 0) diff = 0;
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff / (1000*60*60)) % 24);
  const m = Math.floor((diff / (1000*60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const pad = n => String(n).padStart(2,'0');
  
  const animate = (id, val) => {
    const el = document.getElementById(id);
    if(el && el.textContent !== pad(val)){
      el.style.transform = 'translateY(-10px)';
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = pad(val);
        el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
        setTimeout(() => el.style.transition = '', 350);
      }, 150);
    }
  };
  animate('cd-days', d);
  animate('cd-hours', h);
  animate('cd-mins', m);
  animate('cd-secs', s);
}
tick();
setInterval(tick, 1000);

/* ============================================================
   INTERSECTION OBSERVER — REVEAL
   ============================================================ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-el, .divider').forEach(el => io.observe(el));

/* story line */
const storyLineEl = document.getElementById('storyLine');
const storyIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('in');
      const items = e.target.querySelectorAll('.story-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('in'), i * 200);
      });
    }
  });
}, { threshold: 0.1 });
if(storyLineEl) storyIO.observe(storyLineEl);

/* ============================================================
   3D TILT PHOTO + PARTICLES
   ============================================================ */
const photo3d = document.getElementById('photo3d');
const photoShine = document.getElementById('photoShine');

// Gold particles around photo
const particlesContainer = document.getElementById('photoParticles');
if(particlesContainer){
  const positions = [
    {top:'10%',left:'5%'},{top:'30%',left:'-2%'},{top:'70%',left:'3%'},{top:'85%',left:'15%'},
    {top:'5%',right:'8%'},{top:'40%',right:'-2%'},{top:'65%',right:'4%'},{top:'90%',right:'20%'},
    {top:'50%',left:'50%'},{top:'15%',left:'50%'}
  ];
  positions.forEach((pos, i) => {
    const dot = document.createElement('div');
    dot.className = 'photo-particle';
    const size = 3 + Math.random() * 4;
    dot.style.cssText = `
      width:${size}px; height:${size}px;
      top:${pos.top}; ${pos.left ? 'left:'+pos.left : 'right:'+pos.right};
      animation-duration:${2.5 + Math.random()*3}s;
      animation-delay:${Math.random()*2}s;
    `;
    particlesContainer.appendChild(dot);
  });
}

if(photo3d && window.matchMedia('(pointer:fine)').matches){
  const tiltWrap = photo3d.parentElement;
  tiltWrap.addEventListener('mousemove', (e) => {
    const rect = tiltWrap.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width/2) / (rect.width/2);
    const y = (e.clientY - rect.top - rect.height/2) / (rect.height/2);
    const tiltX = -y * 16;
    const tiltY = x * 16;
    photo3d.style.animation = 'none';
    photo3d.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    if(photoShine){
      photoShine.style.background = `radial-gradient(circle at ${(x+1)*50}% ${(y+1)*50}%, rgba(255,255,255,0.22), transparent 60%)`;
    }
  });
  tiltWrap.addEventListener('mouseleave', () => {
    photo3d.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    photo3d.style.transform = 'rotateX(0deg) rotateY(0deg)';
    setTimeout(() => {
      photo3d.style.transition = '';
      photo3d.style.animation = '';
    }, 650);
    if(photoShine){
      photoShine.style.background = 'linear-gradient(135deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0.04) 40%,transparent 60%,rgba(200,164,92,0.07) 100%)';
    }
  });
}

/* ============================================================
   HERO MOUSE PARALLAX
   ============================================================ */
if(window.matchMedia('(pointer:fine)').matches){
  const circles = document.querySelectorAll('.geo-circle');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    circles.forEach((c, i) => {
      const factor = (i % 2 === 0) ? 1 : -0.6;
      c.style.transform = `translateX(calc(-50% + ${x*factor}px)) translateY(${y*factor}px)`;
    });
  });

  /* cursor gold sparkle */
  let lastSpark = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if(now - lastSpark < 55) return;
    lastSpark = now;
    const sp = document.createElement('div');
    sp.className = 'spark';
    sp.style.left = e.clientX + 'px';
    sp.style.top = e.clientY + 'px';
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 950);
  });
}

/* ============================================================
   AMBIENT CANVAS — particle field
   ============================================================ */
(function(){
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle(){
    this.reset = function(){
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 200;
    };
    this.reset();
  }

  for(let i = 0; i < 60; i++) particles.push(new Particle());

  function draw(){
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life++;
      const progress = p.life / p.maxLife;
      const alpha = p.alpha * Math.sin(progress * Math.PI);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,164,92,${alpha})`;
      ctx.fill();
      if(p.life >= p.maxLife) p.reset();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   FALLING PETALS
   ============================================================ */
(function(){
  const field = document.getElementById('petal-field');
  const colors = ['var(--burgundy-soft)', 'var(--gold)', 'var(--gold-light)', 'var(--cream-deep)'];

  function spawnPetal(){
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 5 + Math.random() * 9;
    const dur = 9 + Math.random() * 8;
    const swayDur = 2.5 + Math.random() * 2;
    p.style.cssText = `
      left:${Math.random()*105}vw;
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${dur}s, ${swayDur}s;
    `;
    field.appendChild(p);
    setTimeout(() => p.remove(), (dur + 0.5) * 1000);
  }
  setInterval(spawnPetal, 800);
  for(let i = 0; i < 5; i++) setTimeout(spawnPetal, i * 250);
})();
