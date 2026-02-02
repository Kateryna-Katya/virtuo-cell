/**
 * VIRTUO-CELL CORE SCRIPT
 * Vanilla JS Only
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Хедер: изменение при скролле
    const header = document.querySelector('#header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 2. Инициализация канваса Hero (Интерактивная сеть)
    const initHeroCanvas = () => {
        const canvas = document.getElementById('hero-interactive-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        const mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', e => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = 2;
                this.density = (Math.random() * 30) + 1;
            }
            draw() {
                ctx.fillStyle = '#6366f1';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * this.density;
                    this.y -= (dy / dist) * force * this.density;
                } else {
                    if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 15;
                    if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 15;
                }
            }
        }

        const init = () => {
            particles = [];
            for(let i=0; i<80; i++) particles.push(new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            // Линии
            for(let a=0; a<particles.length; a++) {
                for(let b=a; b<particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 150) {
                        ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist/150})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };
        init();
        animate();
    };

    // 3. Анимация появления Hero текста
    const animateHero = () => {
        const words = document.querySelectorAll('.hero__title .word');
        words.forEach((w, i) => setTimeout(() => w.classList.add('visible'), i * 150));
        setTimeout(() => document.querySelector('.hero__subtitle').classList.add('visible'), 600);
        setTimeout(() => document.querySelector('.hero__actions').classList.add('visible'), 800);
    };

    // 4. Vanilla Tilt Effect (Эффект наклона карточек)
    const initTilt = () => {
        const cards = document.querySelectorAll('[data-tilt]');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const dx = x - xc;
                const dy = y - yc;
                card.style.transform = `rotateY(${dx / 10}deg) rotateX(${-dy / 10}deg) translateY(-10px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `rotateY(0deg) rotateX(0deg) translateY(0)`;
            });
        });
    };

    // 5. Счётчики статистики (Intersection Observer)
    const initCounters = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const num = entry.target;
                    const target = +num.getAttribute('data-target');
                    let count = 0;
                    const speed = target / 50;
                    const update = () => {
                        count += speed;
                        if (count < target) {
                            num.innerText = Math.floor(count);
                            setTimeout(update, 20);
                        } else {
                            num.innerText = target;
                        }
                    };
                    update();
                    observer.unobserve(num);
                }
            });
        }, { threshold: 1 });

        document.querySelectorAll('.stat-num').forEach(n => observer.observe(n));
    };

    // Запуск всех модулей
    initHeroCanvas();
    animateHero();
    initTilt();
    initCounters();
});