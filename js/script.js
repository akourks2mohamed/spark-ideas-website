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
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// تهيئة الوضع المظفحسب التفضيلات المحفوظة
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// إضافة زر تبديل الوضع المظلم إذا لم يكن موجوداً
if (!themeToggle) {
    const header = document.querySelector('header');
    if (header) {
        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.id = 'theme-toggle';
        themeToggleBtn.className = 'theme-toggle';
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggleBtn.onclick = toggleDarkMode;
        header.insertBefore(themeToggleBtn, header.firstChild);
    }
} else {
    themeToggle.onclick = toggleDarkMode;
}

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

// معالجة نموذج الاتصال
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // الحصول على قيم الحقول
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // هنا يمكنك إضافة كود إرسال النموذج إلى الخادم
        // في هذا المثال، سنقوم فقط بعرض رسالة تأكيد
        alert(`شكراً لك ${name}، تم استلام رسالتك بنجاح! سوف نتواصل معك قريباً على ${email}`);
        
        // إعادة تعيين النموذج
        contactForm.reset();
    });
}

// تحديث أيقونة الوضع المظلم عند التبديل
document.addEventListener('DOMContentLoaded', function() {
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
    }
});

// تحديث أيقونة الوضع المظلم عند النقر
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        const themeIcon = this.querySelector('i');
        if (themeIcon) {
            themeIcon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
}