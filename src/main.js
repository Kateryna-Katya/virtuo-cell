/**
 * VIRTUO-CELL CORE SCRIPT
 * Safe Version for all pages (Home + Policy pages)
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ БЕЗОПАСНОГО ЗАПУСКА ---
    // Если элемента нет на странице, функция просто не будет выполняться и не выдаст ошибку
    const safeInit = (elementId, initFunction) => {
        const element = document.getElementById(elementId);
        if (element) {
            initFunction(element);
        }
    };

    // 1. Хедер: изменение при скролле (Работает везде)
    const header = document.querySelector('#header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // 2. Инициализация канваса Hero (Интерактивная сеть)
    const initHeroCanvas = (canvas) => {
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

    // 3. Анимация появления Hero текста (Только если есть заголовок)
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        const words = document.querySelectorAll('.hero__title .word');
        words.forEach((w, i) => setTimeout(() => w.classList.add('visible'), i * 150));
        setTimeout(() => {
            const subtitle = document.querySelector('.hero__subtitle');
            if (subtitle) subtitle.classList.add('visible');
        }, 600);
        setTimeout(() => {
            const actions = document.querySelector('.hero__actions');
            if (actions) actions.classList.add('visible');
        }, 800);
    }

    // 4. Vanilla Tilt Effect (Эффект наклона карточек)
    const cards = document.querySelectorAll('[data-tilt]');
    if (cards.length > 0) {
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
    }

    // 5. Счётчики статистики
    const statNums = document.querySelectorAll('.stat-num');
    if (statNums.length > 0) {
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
        statNums.forEach(n => observer.observe(n));
    }

    // 6. Benefits Path Canvas
    const initBenefitsCanvas = (bCanvas) => {
        const bCtx = bCanvas.getContext('2d');
        const bCards = document.querySelectorAll('.benefit-card');
        
        const resizeB = () => {
            bCanvas.width = bCanvas.parentElement.offsetWidth;
            bCanvas.height = bCanvas.parentElement.offsetHeight;
        };
        window.addEventListener('resize', resizeB);
        resizeB();

        function drawLines() {
            bCtx.clearRect(0, 0, bCanvas.width, bCanvas.height);
            bCtx.beginPath();
            bCtx.setLineDash([5, 15]);
            bCtx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
            const points = [];
            bCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const parentRect = bCanvas.getBoundingClientRect();
                points.push({
                    x: rect.left - parentRect.left + rect.width / 2,
                    y: rect.top - parentRect.top + rect.height / 2
                });
            });
            if (points.length > 1) {
                bCtx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    bCtx.lineTo(points[i].x, points[i].y);
                }
            }
            bCtx.stroke();
            requestAnimationFrame(drawLines);
        }
        drawLines();
    };

    // 7. Scroll Reveal
    const revealItems = document.querySelectorAll('.benefit-card, .section-title, .section-desc');
    if (revealItems.length > 0) {
        const reveal = () => {
            revealItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.85) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }
            });
        };
        revealItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        window.addEventListener('scroll', reveal);
        reveal();
    }

    // 8. Innovation Radar Logic
    const initRadar = (canvas) => {
        const ctx = canvas.getContext('2d');
        const pointsContainer = document.getElementById('radar-points');
        const detailTitle = document.getElementById('inno-title');
        const detailText = document.getElementById('inno-text');

        const techData = [
            { x: 70, y: 30, title: "Neural Core", text: "Ядро на базе AI." },
            { x: 30, y: 40, title: "Cloud Sync", text: "Облачная синхронизация." },
            { x: 55, y: 75, title: "Smart Contracts", text: "Автоматизация выплат." },
            { x: 80, y: 60, title: "Predictive Analytics", text: "Оценка перспектив." }
        ];

        const resizeRadar = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.width;
        };
        window.addEventListener('resize', resizeRadar);
        resizeRadar();

        let angle = 0;
        techData.forEach(tech => {
            const node = document.createElement('div');
            node.className = 'radar-node';
            node.style.left = tech.x + '%';
            node.style.top = tech.y + '%';
            node.addEventListener('mouseenter', () => {
                if(detailTitle) detailTitle.innerText = tech.title;
                if(detailText) detailText.innerText = tech.text;
            });
            if(pointsContainer) pointsContainer.appendChild(node);
        });

        const drawRadar = () => {
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const radius = canvas.width * 0.45;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
            for(let i = 1; i <= 3; i++) {
                ctx.beginPath();
                ctx.arc(cx, cy, (radius / 3) * i, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, -0.2, 0);
            ctx.lineTo(0, 0);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
            ctx.fill();
            ctx.restore();
            angle += 0.02;
            requestAnimationFrame(drawRadar);
        };
        drawRadar();
    };

    // 9. Academy Draggable Slider
    const slider = document.getElementById('academy-slider');
    if (slider) {
        const wrapper = slider.parentElement;
        let isDown = false; let startX; let scrollLeft;
        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - slider.offsetLeft;
            slider.style.transition = 'none';
        });
        wrapper.addEventListener('mouseleave', () => isDown = false);
        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.style.transform = `translateX(${walk}px)`;
        });
    }

    // 10. Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const phoneInput = document.getElementById('userPhone');
        const captchaLabel = document.getElementById('captcha-task');
        const formMessage = document.getElementById('formMessage');
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const correctAnswer = a + b;
        if(captchaLabel) captchaLabel.innerText = `${a} + ${b}`;

        if(phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^\d+]/g, '');
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userCaptcha = document.getElementById('captchaInput').value;
            if (parseInt(userCaptcha) !== correctAnswer) {
                formMessage.innerText = "Ошибка капчи.";
                formMessage.className = "form-message error";
                return;
            }
            const submitBtn = contactForm.querySelector('button');
            submitBtn.innerText = "Отправка...";
            submitBtn.disabled = true;
            await new Promise(resolve => setTimeout(resolve, 1500));
            contactForm.reset();
            formMessage.innerText = "Успешно отправлено!";
            formMessage.className = "form-message success";
            submitBtn.innerText = "Отправлено";
        });
    }

    // 11. Mobile Menu Toggle (Работает всегда)
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    if (burger && menu) {
        const toggleMenu = () => {
            burger.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        };
        burger.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }

    // 12. Cookie Popup
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');
    if (cookiePopup && acceptBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => cookiePopup.classList.add('active'), 2000);
        }
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiePopup.classList.remove('active');
        });
    }

    // ЗАПУСК СЛОЖНЫХ КАНВАСОВ ЧЕРЕЗ ПРОВЕРКУ
    safeInit('hero-interactive-canvas', initHeroCanvas);
    safeInit('benefits-path-canvas', initBenefitsCanvas);
    safeInit('radar-canvas', initRadar);

});