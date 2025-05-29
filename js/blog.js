// تهيئة متغيرات المدونة
const postsContainer = document.getElementById('posts-container');
const recentPostsContainer = document.getElementById('recent-posts');
const categoriesList = document.getElementById('categories-list');
const popularTags = document.getElementById('popular-tags');

// دالة لتحميل المقالات
async function loadPosts() {
    try {
        // في الواقع، سيتم استبدال هذا بطلب AJAX لجلب المقالات من الخادم
        const response = await fetch('/posts/index.json');
        const posts = await response.json();
        
        if (postsContainer) {
            displayPosts(posts);
        }
        
        if (recentPostsContainer) {
            displayRecentPosts(posts.slice(0, 5)); // عرض آخر 5 مقالات
        }
        
        // تحميل التصنيفات والوسوم
        loadCategoriesAndTags(posts);
        
    } catch (error) {
        console.error('حدث خطأ أثناء تحميل المقالات:', error);
        if (postsContainer) {
            postsContainer.innerHTML = '<p class="error">عذراً، حدث خطأ أثناء تحميل المقالات. يرجى تحديث الصفحة والمحاولة مرة أخرى.</p>';
        }
    }
}

// دالة لعرض المقالات
function displayPosts(posts) {
    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = '<p>لا توجد مقالات متاحة حاليًا.</p>';
        return;
    }
    
    let postsHTML = '';
    
    posts.forEach(post => {
        const postDate = new Date(post.date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        postsHTML += `
            <article class="post-card">
                <a href="post.html?slug=${post.slug}" class="post-thumbnail">
                    <img src="${post.image || '../assets/images/blog/default.jpg'}" alt="${post.title}">
                </a>
                <div class="post-card-content">
                    <span class="post-tag">${post.category || 'عام'}</span>
                    <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
                    <p>${post.excerpt || 'لا يوجد ملخص متاح'}</p>
                    <div class="post-meta">
                        <span><i class="far fa-calendar-alt"></i> ${postDate}</span>
                        <span><i class="far fa-eye"></i> ${post.views || 0} مشاهدة</span>
                    </div>
                </div>
            </article>
        `;
    });
    
    postsContainer.innerHTML = postsHTML;
}

// دالة لعرض أحدث المقالات
function displayRecentPosts(posts) {
    if (!recentPostsContainer) return;
    
    if (!posts || posts.length === 0) {
        recentPostsContainer.innerHTML = '<p>لا توجد مقالات حديثة.</p>';
        return;
    }
    
    let html = '';
    
    posts.forEach(post => {
        const postDate = new Date(post.date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        html += `
            <div class="recent-post-item">
                <a href="post.html?slug=${post.slug}" class="post-thumbnail">
                    <img src="${post.thumbnail || '../assets/images/blog/thumb-default.jpg'}" alt="${post.title}">
                </a>
                <div class="post-info">
                    <h4 class="post-title">
                        <a href="post.html?slug=${post.slug}">${post.title}</a>
                    </h4>
                    <span class="post-date">${postDate}</span>
                </div>
            </div>
        `;
    });
    
    recentPostsContainer.innerHTML = html;
}

// دالة لتحميل التصنيفات والوسوم
function loadCategoriesAndTags(posts) {
    if (!posts || posts.length === 0) return;
    
    // استخراج التصنيفات
    const categories = new Set();
    const tags = new Set();
    
    posts.forEach(post => {
        if (post.category) {
            categories.add(post.category);
        }
        
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => tags.add(tag));
        }
    });
    
    // عرض التصنيفات
    if (categoriesList && categories.size > 0) {
        let categoriesHTML = '';
        categories.forEach(category => {
            categoriesHTML += `<li><a href="blog.html?category=${encodeURIComponent(category)}">${category}</a></li>`;
        });
        categoriesList.innerHTML = categoriesHTML;
    }
    
    // عرض الوسوم
    if (popularTags && tags.size > 0) {
        let tagsHTML = '';
        tags.forEach(tag => {
            tagsHTML += `<a href="blog.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`;
        });
        popularTags.innerHTML = tagsHTML;
    }
}

// دالة لتحميل مقال محدد
async function loadPost(slug) {
    try {
        // في الواقع، سيتم استبدال هذا بطلب AJAX لجلب المقال من الخادم
        const response = await fetch(`/posts/${slug}.json`);
        const post = await response.json();
        
        if (!post) {
            window.location.href = 'blog.html';
            return;
        }
        
        displayPost(post);
        
    } catch (error) {
        console.error('حدث خطأ أثناء تحميل المقال:', error);
        window.location.href = 'blog.html';
    }
}

// دالة لعرض مقال محدد
function displayPost(post) {
    // تحديث عنوان الصفحة والوصف
    document.title = `${post.title} | شرارة الأفكار`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt || post.title);
    }
    
    // تحديث Open Graph
    updateMetaTag('og:title', post.title);
    updateMetaTag('og:description', post.excerpt || post.title);
    updateMetaTag('og:image', post.image || '../assets/images/blog/default.jpg');
    updateMetaTag('og:url', window.location.href);
    
    // تحديث Twitter Card
    updateMetaTag('twitter:title', post.title);
    updateMetaTag('twitter:description', post.excerpt || post.title);
    updateMetaTag('twitter:image', post.image || '../assets/images/blog/default.jpg');
    
    // تحديث Schema.org
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (schemaScript) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt || post.title,
            "image": post.image || '../assets/images/blog/default.jpg',
            "author": {
                "@type": "Person",
                "name": post.author || 'فريق شرارة الأفكار',
                "url": window.location.origin + '/about.html'
            },
            "publisher": {
                "@type": "Organization",
                "name": "شرارة الأفكار",
                "logo": {
                    "@type": "ImageObject",
                    "url": window.location.origin + '/logo.png'
                }
            },
            "datePublished": post.date,
            "dateModified": post.updated || post.date
        };
        
        schemaScript.textContent = JSON.stringify(schema, null, 2);
    }
    
    // تحديث محتوى المقال
    document.getElementById('article-title').textContent = post.title;
    
    const featuredImage = document.getElementById('featured-image');
    if (featuredImage && post.image) {
        featuredImage.innerHTML = `<img src="${post.image}" alt="${post.title}" class="featured-image">`;
    }
    
    const articleMeta = document.getElementById('article-meta');
    if (articleMeta) {
        const postDate = new Date(post.date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        articleMeta.innerHTML = `
            <div class="post-meta">
                <div class="author">
                    <div class="author-avatar">
                        <img src="${post.authorImage || '../assets/images/authors/default.jpg'}" alt="${post.author || 'فريق شرارة الأفكار'}">
                    </div>
                    <div class="author-info">
                        <h4>${post.author || 'فريق شرارة الأفكار'}</h4>
                        <span class="post-date">${postDate}</span>
                    </div>
                </div>
                <div class="post-share">
                    <span class="share-label">مشاركة:</span>
                    <div class="share-buttons">
                        <a href="#" class="share-btn twitter" aria-label="مشاركة على تويتر" data-platform="twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="share-btn facebook" aria-label="مشاركة على فيسبوك" data-platform="facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="share-btn linkedin" aria-label="مشاركة على لينكد إن" data-platform="linkedin">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" class="share-btn whatsapp" aria-label="مشاركة على واتساب" data-platform="whatsapp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    // تحويل محتوى Markdown إلى HTML
    const contentElement = document.querySelector('.post-content-inner');
    if (contentElement) {
        // استخدام Marked.js لتحويل Markdown إلى HTML
        contentElement.innerHTML = DOMPurify.sanitize(marked.parse(post.content || 'لا يوجد محتوى متاح.'));
        
        // تمييز الشفرات البرمجية باستخدام Highlight.js
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
        
        // إضافة فئات للجداول
        document.querySelectorAll('table').forEach(table => {
            table.classList.add('table', 'table-bordered', 'table-striped');
        });
        
        // إضافة فئات للصور
        document.querySelectorAll('img').forEach(img => {
            img.classList.add('img-fluid', 'rounded');
            img.setAttribute('loading', 'lazy');
        });
    }
    
    // تحديث التصنيفات والوسوم
    const postTags = document.getElementById('post-tags');
    if (postTags && post.tags && post.tags.length > 0) {
        let tagsHTML = '<span>الوسوم: </span>';
        post.tags.forEach((tag, index) => {
            tagsHTML += `<a href="blog.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`;
            if (index < post.tags.length - 1) {
                tagsHTML += '، ';
            }
        });
        postTags.innerHTML = tagsHTML;
    }
    
    // إعداد أزرار المشاركة
    setupShareButtons(post);
    
    // تحميل المقالات ذات الصلة
    loadRelatedPosts(post);
}

// دالة مساعدة لتحديث وسوم meta
function updateMetaTag(property, content) {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
}

// دالة لإعداد أزرار المشاركة
function setupShareButtons(post) {
    const shareButtons = document.querySelectorAll('.share-btn');
    if (!shareButtons.length) return;
    
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(post.title);
    const pageImage = encodeURIComponent(post.image || '');
    const pageDescription = encodeURIComponent(post.excerpt || '');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const platform = button.getAttribute('data-platform');
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${pageTitle}&body=${pageDescription}%0A%0A${pageUrl}`;
                    break;
                default:
                    return;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
    
    // نسخ الرابط
    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                const originalText = copyLinkBtn.innerHTML;
                copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> <span>تم النسخ!</span>';
                
                setTimeout(() => {
                    copyLinkBtn.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('فشل في نسخ الرابط: ', err);
            });
        });
    }
}

// دالة لتحميل المقالات ذات الصلة
async function loadRelatedPosts(post) {
    if (!post || !post.related || post.related.length === 0) return;
    
    try {
        const relatedContainer = document.createElement('div');
        relatedContainer.className = 'related-posts';
        relatedContainer.innerHTML = `
            <h3 class="section-title">
                <i class="fas fa-book-reader"></i>
                مقالات ذات صلة
            </h3>
            <div class="related-posts-grid"></div>
        `;
        
        const relatedGrid = relatedContainer.querySelector('.related-posts-grid');
        
        // في الواقع، سيتم استبدال هذا بطلب AJAX لجلب المقالات ذات الصلة من الخادم
        const response = await fetch('/posts/index.json');
        const allPosts = await response.json();
        
        // تصفية المقالات ذات الصلة
        const relatedPosts = allPosts.filter(p => 
            p.slug !== post.slug && 
            (p.category === post.category || 
             (post.tags && p.tags && p.tags.some(tag => post.tags.includes(tag))))
        ).slice(0, 3);
        
        if (relatedPosts.length === 0) return;
        
        let relatedHTML = '';
        
        relatedPosts.forEach(relatedPost => {
            relatedHTML += `
                <div class="related-post-card">
                    <a href="post.html?slug=${relatedPost.slug}" class="related-post-thumbnail">
                        <img src="${relatedPost.image || '../assets/images/blog/thumb-default.jpg'}" alt="${relatedPost.title}">
                    </a>
                    <div class="related-post-content">
                        <h4><a href="post.html?slug=${relatedPost.slug}">${relatedPost.title}</a></h4>
                        <span class="post-date">
                            ${new Date(relatedPost.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            `;
        });
        
        relatedGrid.innerHTML = relatedHTML;
        
        // إدراج المقالات ذات الصلة بعد نهاية المقال
        const article = document.querySelector('article.post-content');
        if (article) {
            article.insertAdjacentElement('afterend', relatedContainer);
        }
        
    } catch (error) {
        console.error('حدث خطأ أثناء تحميل المقالات ذات الصلة:', error);
    }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    // التحقق مما إذا كنا في صفحة المدونة أو صفحة مقال
    if (window.location.pathname.includes('blog.html') || window.location.pathname === '/blog/') {
        loadPosts();
    } else if (window.location.pathname.includes('post.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (slug) {
            loadPost(slug);
        } else {
            window.location.href = 'blog.html';
        }
    }
    
    // تحديث سنة حقوق النشر
    const yearElements = document.querySelectorAll('#current-year, .current-year');
    if (yearElements.length > 0) {
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }
    
    // تهيئة زر العودة للأعلى
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // تهيئة زر تبديل الوضع المظلم
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            
            // تحديث الأيقونة
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
        
        // تحميل تفضيلات الوضع المظلم
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-sun';
            }
        }
    }
});

// دالة مساعدة للبحث عن المعلمات في عنوان URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
