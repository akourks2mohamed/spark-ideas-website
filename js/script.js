// كود JavaScript لموقع شرارة الأفكار

// تهيئة المتغيرات
const themeToggle = document.getElementById('theme-toggle');
const backToTopBtn = document.getElementById('back-to-top');
const currentYearSpan = document.getElementById('current-year');
const contactForm = document.getElementById('contactForm');

// تحديث السنة الحالية تلقائياً
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// تبديل الوضع المظلم
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    if (themeToggle) {
        themeToggle.querySelector('i').className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// تهيئة الوضع المظلم حسب التفضيلات المحفوظة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }
    } else {
        if (themeToggle) {
            themeToggle.querySelector('i').className = 'fas fa-moon';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
});


// زر العودة للأعلى
window.onscroll = function() {
    if (backToTopBtn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
};

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// معالجة نموذج الاتصال (في صفحة contact.html)
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        alert(`شكراً لك ${name}، تم استلام رسالتك بنجاح! سوف نتواصل معك قريباً على ${email}`);
        
        contactForm.reset();
    });
}