// Функция отправки уведомления в Telegram
async function sendTelegramNotification(formData) {
    const message = `🔔 Новая заявка с ulyarepair.ru (Ульяновск)

👤 Имя: ${formData.name || 'Не указано'}
📞 Телефон: ${formData.phone}
📋 Тип заявки: ${formData.type || 'Ремонт холодильника'}
⏰ Время: ${new Date().toLocaleString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
})}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('Уведомление отправлено в Telegram');
            return true;
        } else {
            console.error('Ошибка отправки в Telegram:', result);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
        return false;
    }
}

// Модальное окно
function openModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Слайдер отзывов
let currentSlide = 0;
const slides = document.querySelectorAll('.review-slide');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Автопрокрутка слайдера
setInterval(() => {
    nextSlide();
}, 5000);

// Маска для телефона
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.substring(1);
                } else if (value[0] !== '7') {
                    value = '7' + value;
                }
            }
            
            let formattedValue = '';
            
            if (value.length > 0) {
                formattedValue = '+7';
                if (value.length > 1) {
                    formattedValue += ' ' + value.substring(1, 4);
                }
                if (value.length >= 4) {
                    formattedValue += ' ' + value.substring(4, 7);
                }
                if (value.length >= 7) {
                    formattedValue += ' ' + value.substring(7, 9);
                }
                if (value.length >= 9) {
                    formattedValue += ' ' + value.substring(9, 11);
                }
            }
            
            e.target.value = formattedValue;
        });
        
        input.addEventListener('focus', function(e) {
            if (!e.target.value) {
                e.target.value = '+7 ';
            }
        });
        
        input.addEventListener('blur', function(e) {
            if (e.target.value === '+7 ') {
                e.target.value = '';
            }
        });
    });
});

// Обработка формы скидки
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        phone: e.target.querySelector('input[type="tel"]').value,
        name: e.target.querySelector('input[name="name"]')?.value || 'Не указано',
        type: 'Заявка на скидку 15%'
    };
    
    // Отправка в Telegram
    if (typeof sendTelegramNotification === 'function') {
        await sendTelegramNotification(formData);
    }
    
    alert('Спасибо! Мы свяжемся с вами в ближайшее время!');
    e.target.reset();
}

// Обработка формы в модальном окне
async function handleModalSubmit(e) {
    e.preventDefault();
    
    const formData = {
        phone: e.target.querySelector('input[type="tel"]').value,
        name: e.target.querySelector('input[name="name"]')?.value || 'Не указано',
        type: 'Вызов мастера'
    };
    
    // Отправка в Telegram
    if (typeof sendTelegramNotification === 'function') {
        await sendTelegramNotification(formData);
    }
    
    alert('Заявка отправлена! Наш мастер свяжется с вами в течение 15 минут!');
    closeModal();
    e.target.reset();
}

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Анимация при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.price-card, .step-item, .team-member, .brand-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
