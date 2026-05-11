/**
 * main.js — 幻灯片控制器完整模板
 * 使用前替换所有 N / xxx 占位符
 */
class SlideController {
  constructor() {
    this.totalSlides = N; // ← 替换为实际总页数

    // ← 按实际页面填充，0 位为占位
    this.slideNames = [
      '',
      '00-cover',
      '01-xxx',
      '02-xxx',
      // ... 每页一条
      'NN-end',
    ];

    // ← 每页在 TOC 面板中显示的标题
    this.slideTitles = [
      '',
      '演示标题',
      '章节一标题',
      '章节二标题',
      // ...
      '谢谢大家 · Q & A',
    ];

    this.currentSlide = 1;
    this.isAnimating = false;
    this.init();
  }

  init() {
    this.buildTOC();
    this.bindKeyboard();
    this.bindNavigation();
    this.bindTouch();
    this.keepFocus();
    this.updateUI();
  }

  buildTOC() {
    const panel = document.getElementById('thumb-panel');
    if (!panel) return;
    for (let i = 1; i <= this.totalSlides; i++) {
      const item = document.createElement('div');
      item.className = 'thumb-item' + (i === 1 ? ' active' : '');
      item.dataset.idx = i;
      item.innerHTML = `<span class="thumb-num">${String(i).padStart(2,'0')}</span>${this.slideTitles[i]}`;
      item.addEventListener('click', () => {
        document.getElementById('thumb-panel').classList.remove('open');
        this.goToSlide(i);
      });
      panel.appendChild(item);
    }
  }

  updateUI() {
    const counter  = document.getElementById('slide-counter');
    const titleBar = document.getElementById('slide-title-bar');
    const prev = document.getElementById('btn-prev');
    const next = document.getElementById('btn-next');

    if (counter)  counter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
    if (titleBar) titleBar.textContent = this.slideTitles[this.currentSlide] || '';
    if (prev) prev.disabled = this.currentSlide === 1;
    if (next) next.disabled = this.currentSlide === this.totalSlides;

    document.querySelectorAll('.thumb-item').forEach(el => {
      el.classList.toggle('active', Number(el.dataset.idx) === this.currentSlide);
    });
    document.querySelector('.thumb-item.active')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      const hint = document.getElementById('hint');
      if (e.key === '?') { hint?.classList.toggle('show'); return; }
      if (hint?.classList.contains('show')) hint.classList.remove('show');

      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
          e.preventDefault(); this.nextSlide(); break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
          e.preventDefault(); this.prevSlide(); break;
        case 'Home': e.preventDefault(); this.goToSlide(1); break;
        case 'End':  e.preventDefault(); this.goToSlide(this.totalSlides); break;
        case 't': case 'T':
          e.preventDefault();
          document.getElementById('thumb-panel')?.classList.toggle('open'); break;
        case 'f': case 'F':
          e.preventDefault(); this.toggleFullscreen(); break;
      }
    });
  }

  bindNavigation() {
    document.getElementById('btn-prev')?.addEventListener('click', () => this.prevSlide());
    document.getElementById('btn-next')?.addEventListener('click', () => this.nextSlide());
    document.getElementById('btn-fullscreen')?.addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('btn-thumb')?.addEventListener('click', () => {
      document.getElementById('thumb-panel')?.classList.toggle('open');
    });

    // 点击 iframe 左半翻上页，右半翻下页
    const viewer = document.getElementById('viewer');
    if (viewer) {
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:absolute;inset:0;z-index:10;cursor:pointer;';
      viewer.style.position = 'relative';
      viewer.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        e.clientX > window.innerWidth / 2 ? this.nextSlide() : this.prevSlide();
      });
    }
  }

  bindTouch() {
    let startX = 0;
    document.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) diff > 0 ? this.nextSlide() : this.prevSlide();
    }, { passive: true });
  }

  keepFocus() {
    window.addEventListener('blur', () => setTimeout(() => window.focus(), 50));
    document.getElementById('slideFrame')?.addEventListener('load', () => window.focus());
  }

  nextSlide() {
    if (!this.isAnimating && this.currentSlide < this.totalSlides) this.goToSlide(this.currentSlide + 1);
  }
  prevSlide() {
    if (!this.isAnimating && this.currentSlide > 1) this.goToSlide(this.currentSlide - 1);
  }

  goToSlide(num) {
    if (num < 1 || num > this.totalSlides || num === this.currentSlide) return;
    this.isAnimating = true;
    const iframe = document.getElementById('slideFrame');
    const direction = num > this.currentSlide ? 1 : -1;

    iframe.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
    iframe.style.opacity = '0';
    iframe.style.transform = `translateX(${direction * 20}px)`;

    setTimeout(() => {
      iframe.style.transition = 'none';
      iframe.style.transform = `translateX(${direction * -20}px)`;
      const onLoaded = () => {
        iframe.removeEventListener('load', onLoaded);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          iframe.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
          iframe.style.opacity = '1';
          iframe.style.transform = 'translateX(0)';
          this.isAnimating = false;
        }));
      };
      iframe.addEventListener('load', onLoaded);
      iframe.src = `slides/${this.slideNames[num]}.html`;
      this.currentSlide = num;
      this.updateUI();
    }, 200);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
}

document.addEventListener('DOMContentLoaded', () => { window.ctrl = new SlideController(); });
