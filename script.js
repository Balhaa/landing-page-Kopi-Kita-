// ==========================================================================
// KOPI KITA ASMARA — MODERN INTERACTION & ANIMATION CONTROLLER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Reveal Elements on Scroll
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => scrollObserver.observe(el));

    // 2. Sticky Header with Scroll Effect
    const header = document.getElementById('main-header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 3. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('is-open');
            mobileToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('is-open');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // 4. Counter Animation for Stats
    const statValues = document.querySelectorAll('.stat-value');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target || 0, 10);
                const duration = 1800; // ms
                const start = 0;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutQuart
                    const ease = 1 - Math.pow(1 - progress, 4);
                    const currentVal = Math.floor(start + (target - start) * ease);

                    el.textContent = currentVal.toLocaleString('id-ID');

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        el.textContent = target.toLocaleString('id-ID');
                    }
                };

                requestAnimationFrame(updateCount);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.4 });

    statValues.forEach(val => statObserver.observe(val));

    // 5. Menu Category Filter Tabs
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.dataset.filter;

            menuItems.forEach(item => {
                const category = item.dataset.category;
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('is-hidden');
                    item.style.animation = 'fadeUp 0.4s ease-out forwards';
                } else {
                    item.classList.add('is-hidden');
                }
            });
        });
    });

    // 6. Quick Order Notification Simulation
    const orderButtons = document.querySelectorAll('.btn-order-quick');
    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemName = btn.dataset.item;
            showToast(`✓ Ditambahkan ke catatan: ${itemName}`);
        });
    });

    function showToast(message) {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Styling via JS for isolation
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '90px',
            right: '30px',
            backgroundColor: '#1b1915',
            color: '#e5b369',
            padding: '12px 22px',
            borderRadius: '999px',
            border: '1px solid rgba(229, 179, 105, 0.4)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            fontSize: '0.88rem',
            fontWeight: '600',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateY(15px)',
            transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
        });

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 50);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 7. Testimonials Carousel / Slider
    const reviewsSlider = document.getElementById('reviews-slider');
    if (reviewsSlider) {
        const reviewCards = reviewsSlider.querySelectorAll('.review-card');
        const dots = document.querySelectorAll('#slider-dots .dot');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');
        let currentSlide = 0;
        let slideTimer;

        const showSlide = (index) => {
            currentSlide = (index + reviewCards.length) % reviewCards.length;
            reviewCards.forEach((card, idx) => {
                card.classList.toggle('is-active', idx === currentSlide);
            });
            dots.forEach((dot, idx) => {
                dot.classList.toggle('is-active', idx === currentSlide);
            });
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        const startAutoPlay = () => {
            slideTimer = setInterval(nextSlide, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(slideTimer);
        };

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoPlay(); startAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoPlay(); startAutoPlay(); });

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                stopAutoPlay();
                startAutoPlay();
            });
        });

        startAutoPlay();
    }

    // 8. Newsletter Subscription Feedback
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterFeedback = document.getElementById('newsletter-feedback');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            if (emailInput.value) {
                newsletterFeedback.textContent = `Terima kasih! Kami telah mengirimkan voucher selamat datang ke ${emailInput.value}`;
                emailInput.value = '';
                setTimeout(() => {
                    newsletterFeedback.textContent = '';
                }, 5000);
            }
        });
    }

    // 9. Booking Form Submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name').value;
            const submitBtn = bookingForm.querySelector('.submit-btn');
            
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Memproses...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Kirim Reservasi';
                alert(`Terima kasih Bapak/Ibu ${nameInput}, permintaan reservasi Anda telah kami terima! Tim Kopi Kita Asmara akan menghubungi Anda segera melalui WhatsApp/Email.`);
                bookingForm.reset();
            }, 1200);
        });
    }

    // 10. Subtle 3D Card Hover Tilt
    const tiltCards = document.querySelectorAll('.interactive-tilt');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            card.style.transform = `perspective(1000px) rotateX(${-deltaY * 5}deg) rotateY(${deltaX * 5}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

});