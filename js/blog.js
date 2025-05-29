// هذا الملف سيعالج منطق عرض المقالات
// سيستخدم مكتبة Marked.js لتحويل Markdown إلى HTML

// تكوين Marked.js
marked.setOptions({
    breaks: true,
    gfm: true,
    langPrefix: 'language-',
    highlight: function(code, lang) {
        if (window.hljs) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
        return code;
    }
});

// قائمة بجميع المقالات
let allPosts = [];
let currentPostIndex = -1;

// دالة لجلب جميع ملفات المقالات
async function fetchAllPosts() {
    try {
        // محاولة جلب قائمة المقالات من ملف index.json
        const response = await fetch('../posts/index.json');
        if (!response.ok) {
            throw new Error('فشل في جلب قائمة المقالات');
        }
        allPosts = await response.json();
        return allPosts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        // في حالة الفشل، نستخدم البيانات الافتراضية
        return [
            {
                id: 'نصائح-للمبتدئين-في-البرمجة',
                title: 'نصائح ذهبية للمبتدئين في عالم البرمجة',
                date: '2025-05-29',
                author: 'فريق شرارة الأفكار',
                excerpt: 'انطلق في رحلتك البرمجية بهذه النصائح الأساسية التي ستساعدك على تعلم البرمجة بشكل فعال.',
                tags: ['برمجة', 'نصائح', 'مبتدئين'],
                readTime: 5,
                image: '../images/blog/programming-tips.jpg'
            },
            {
                id: 'my-first-spark',
                title: 'أول شرارة لي في عالم البرمجة!',
                date: '2025-05-28',
                author: 'فريق شرارة الأفكار',
                excerpt: 'مقدمة سريعة حول رحلتنا في تعلم البرمجة وبناء هذا الموقع الرائع.',
                tags: ['تجربة شخصية', 'تعلم'],
                readTime: 3,
                image: '../images/blog/first-spark.jpg'
            }
        ];
    }
}

// وظيفة لعرض قائمة المقالات في صفحة blog.html
async function displayBlogPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return; // تأكد أننا في صفحة blog.html

    postsContainer.innerHTML = `
        <div class="loading-content" style="text-align: center; padding: 2rem;">
            <div class="skeleton-line" style="width: 60%; height: 2rem; margin: 0 auto 1.5rem; border-radius: 4px;"></div>
            <div class="skeleton-line" style="width: 80%; height: 1.25rem; margin: 0 auto 0.5rem; border-radius: 4px;"></div>
            <div class="skeleton-line" style="width: 70%; height: 1.25rem; margin: 0 auto 2rem; border-radius: 4px;"></div>
            <div class="skeleton-line" style="width: 30%; height: 3rem; margin: 0 auto; border-radius: 4px;"></div>
        </div>
    `;

    try {
        const posts = await fetchAllPosts();
        
        if (posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-posts" style="text-align: center; padding: 3rem 1rem;">
                    <i class="fas fa-newspaper" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <h3>لا توجد مقالات متاحة حاليًا</h3>
                    <p>نعمل على إضافة محتوى جديد قريبًا. نرجو متابعتنا لمعرفة آخر التحديثات.</p>
                </div>
            `;
            return;
        }


        // ترتيب المقالات من الأحدث إلى الأقدم
        const sortedPosts = [...posts].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        // تعيين المقال الأول كمميز
        if (sortedPosts.length > 0) {
            sortedPosts[0].featured = true;
        }


        let postsHTML = '';
        
        sortedPosts.forEach((post, index) => {
            const postDate = new Date(post.date).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                numberingSystem: 'latn' // استخدام الأرقام اللاتينية
            });
            
            // تنسيق الوقت المقدر للقراءة
            const readTimeText = post.readTime ? `⏱️ ${post.readTime} دقيقة` : 'قراءة سريعة';
            
            // إنشاء علامات المقال
            let tagsHTML = '';
            if (post.tags && post.tags.length > 0) {
                tagsHTML = post.tags.slice(0, 3).map(tag => 
                    `<span class="post-card-tag">${tag}</span>`
                ).join('');
            }
            
            // إنشاء بطاقة المقال
            const postCard = `
                <article class="post-card ${post.featured ? 'featured' : ''}" data-aos="fade-up" data-aos-delay="${(index % 5) * 100}">
                    ${post.image ? `
                    <div class="post-card-image">
                        <img src="${post.image}" alt="${post.title}" loading="lazy">
                    </div>` : ''}
                    <div class="post-card-content">
                        <div class="post-card-header">
                            <h2 class="post-card-title">
                                <a href="post.html?id=${post.id}">${post.title}</a>
                            </h2>
                            <div class="post-card-meta">
                                <span class="post-date" title="تاريخ النشر">
                                    <i class="far fa-calendar-alt"></i> ${postDate}
                                </span>
                                <span class="post-author" title="الكاتب">
                                    <i class="far fa-user"></i> ${post.author}
                                </span>
                                <span class="post-read-time" title="وقت القراءة">
                                    <i class="far fa-clock"></i> ${readTimeText}
                                </span>
                            </div>
                        </div>
                        <p class="post-card-excerpt">${post.excerpt}</p>
                        <div class="post-card-footer">
                            <div class="post-card-tags">
                                ${tagsHTML}
                            </div>
                            <a href="post.html?id=${post.id}" class="post-card-read-more">
                                اقرأ المقال <i class="fas fa-arrow-left arrow"></i>
                            </a>
                        </div>
                    </div>
                </article>
            `;
            
            postsHTML += postCard;
        });
        
        // إضافة زر تحميل المزيد إذا كان هناك أكثر من 6 مقالات
        if (sortedPosts.length > 6) {
            postsHTML += `
                <div class="load-more-container" style="text-align: center; margin-top: 2rem;">
                    <button id="load-more-posts" class="btn btn-primary">
                        <i class="fas fa-spinner fa-spin d-none"></i>
                        <span>تحميل المزيد من المقالات</span>
                    </button>
                </div>
            `;
        }
        
        postsContainer.innerHTML = postsHTML;
        
        // إضافة مستمع حدث لزر تحميل المزيد
        const loadMoreBtn = document.getElementById('load-more-posts');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                // سيتم تنفيذ وظيفة التحميل الإضافي هنا
                loadMoreBtn.disabled = true;
                loadMoreBtn.querySelector('span').textContent = 'جاري التحميل...';
                loadMoreBtn.querySelector('.fa-spinner').classList.remove('d-none');
                
                // محاكاة تحميل إضافي (يمكن استبدالها بطلب AJAX)
                setTimeout(() => {
                    loadMoreBtn.outerHTML = '<p style="color: #666; font-style: italic;">لا توجد المزيد من المقالات للعرض</p>';
                }, 1500);
            });
        }
    } catch (error) {
        console.error('Failed to load blog posts:', error);
        postsContainer.innerHTML = `
            <div class="error-message">
                <p>عذراً، حدث خطأ أثناء تحميل المقالات.</p>
                <button onclick="window.location.reload()" class="retry-button">إعادة المحاولة</button>
            </div>
        `;
    }
}

// وظيفة لعرض مقال فردي في صفحة post.html
async function displaySinglePost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id'); // الحصول على معرّف المقال من عنوان URL
    const articleBody = document.getElementById('article-body');
    const articleTitle = document.getElementById('article-title');
    const postHeader = document.querySelector('.post-header');
    const postDate = document.getElementById('date-text');
    const postAuthor = document.getElementById('author-text');
    const readTime = document.querySelector('#read-time span:last-child');
    const postTags = document.getElementById('post-tags');
    const prevPostLink = document.getElementById('prev-post');
    const nextPostLink = document.getElementById('next-post');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    const postDescription = document.getElementById('post-description');
    const featuredImage = document.querySelector('.featured-image');
    const breadcrumb = document.querySelector('.breadcrumb');
    const readingProgress = document.getElementById('reading-progress');
    const tableOfContents = document.getElementById('table-of-contents');

    if (!postId) {
        articleBody.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 4rem 1rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                <h2>لم يتم العثور على المقال المطلوب</h2>
                <p>عذراً، يبدو أن الرابط غير صحيح أو أن المقال غير متوفر حالياً.</p>
                <a href="blog.html" class="btn btn-primary" style="margin-top: 1.5rem;">
                    <i class="fas fa-arrow-right" style="margin-left: 0.5rem;"></i> العودة للمدونة
                </a>
            </div>
        `;
        return;
    }

    try {
        // إظهار حالة التحميل
        articleBody.innerHTML = `
            <div class="loading-content" style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
                <div class="skeleton-line" style="width: 80%; height: 3rem; margin: 0 auto 2rem; border-radius: 4px;"></div>
                <div class="skeleton-line" style="width: 60%; height: 1.5rem; margin: 0 auto 1rem; border-radius: 4px;"></div>
                <div class="skeleton-line" style="width: 40%; height: 1.5rem; margin: 0 auto 3rem; border-radius: 4px;"></div>
                
                <div class="skeleton-line" style="width: 100%; height: 2rem; margin-bottom: 1.5rem; border-radius: 4px;"></div>
                <div class="skeleton-line" style="width: 100%; height: 1.5rem; margin-bottom: 1rem; border-radius: 4px;"></div>
                <div class="skeleton-line" style="width: 90%; height: 1.5rem; margin-bottom: 1rem; border-radius: 4px;"></div>
                <div class="skeleton-line" style="width: 95%; height: 1.5rem; margin-bottom: 2rem; border-radius: 4px;"></div>
                
                <div class="skeleton-line" style="width: 100%; height: 20rem; margin: 2rem 0; border-radius: 8px;"></div>
                
                <div class="skeleton-line" style="width: 100%; height: 1.5rem; margin-bottom: 1rem; border-radius: 4px;"></div>
                <div class="skeleton-line" style="width: 80%; height: 1.5rem; margin-bottom: 1rem; border-radius: 4px;"></div>
                <div class="skeleton-line" style="width: 90%; height: 1.5rem; margin-bottom: 1rem; border-radius: 4px;"></div>
            </div>
        `;
        
        // إظهار شريط التقدم
        if (readingProgress) {
            readingProgress.style.width = '0%';
        }


        // جلب قائمة المقالات أولاً
        const posts = await fetchAllPosts();
        const currentPostIndex = posts.findIndex(post => post.id === postId);
        
        if (currentPostIndex === -1) {
            throw new Error('المقال غير موجود');
        }

        const post = posts[currentPostIndex];
        
        // تحديث عناصر التنقل بين المقالات
        if (currentPostIndex > 0) {
            const prevPost = posts[currentPostIndex - 1];
            prevPostLink.href = `post.html?id=${prevPost.id}`;
            prevPostLink.querySelector('.nav-title').textContent = prevPost.title;
            prevPostLink.classList.remove('disabled');
        } else {
            prevLink.parentNode.remove();
        }

        if (currentPostIndex < posts.length - 1) {
            const nextPost = posts[currentPostIndex + 1];
            nextPostLink.href = `post.html?id=${nextPost.id}`;
            nextPostLink.querySelector('.nav-title').textContent = nextPost.title;
            nextPostLink.classList.remove('disabled');
        } else {
            nextPostLink.parentNode.remove();
        }
        
        // إضافة زر العودة للمدونة إذا لم يكن موجودًا
        if (!document.querySelector('.back-to-blog')) {
            const backButton = document.createElement('a');
            backButton.href = 'blog.html';
            backButton.className = 'back-to-blog';
            backButton.innerHTML = '<i class="fas fa-arrow-right"></i> العودة للمدونة';
            articleBody.parentNode.insertBefore(backButton, articleBody.nextSibling);
        }

        // جلب محتوى المقال
        const response = await fetch(`../posts/${postId}.md`);
        if (!response.ok) {
            throw new Error(`تعذر تحميل المقال: ${response.statusText}`);
        }
        const markdown = await response.text();

        // استخراج البيانات الوصفية والمحتوى
        const parts = markdown.split('---');
        const metaData = parts[1] || '';
        const content = parts.slice(2).join('---'); // باقي الأجزاء هي المحتوى

        // تحديث وسم العنوان للصفحة
        document.title = `${post.title} | مدونة شرارة الأفكار`;
        
        // تحديث البيانات الوصفية لوسائل التواصل الاجتماعي
        if (ogTitle) ogTitle.content = post.title;
        if (ogDescription) ogDescription.content = post.excerpt || post.title;
        if (ogUrl) ogUrl.content = window.location.href;
        if (ogImage && post.image) ogImage.content = new URL(post.image, window.location.origin).href;
        
        // تحديث بيانات تويتر
        if (twitterCard) twitterCard.content = 'summary_large_image';
        if (twitterTitle) twitterTitle.content = post.title;
        if (twitterDescription) twitterDescription.content = post.excerpt || post.title;
        if (twitterImage && post.image) twitterImage.content = new URL(post.image, window.location.origin).href;
        
        // تحديث صورة المقال البارزة
        if (featuredImage && post.image) {
            featuredImage.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="img-fluid" loading="lazy">
                <div class="image-overlay"></div>
            `;
        } else if (featuredImage) {
            featuredImage.remove();
        }
        
        // تحديث مسار التصفح (Breadcrumb)
        if (breadcrumb) {
            breadcrumb.innerHTML = `
                <a href="../index.html">الرئيسية</a>
                <span class="separator">/</span>
                <a href="blog.html">المدونة</a>
                <span class="separator">/</span>
                <span class="current">${post.title}</span>
            `;
        }

        // تحليل البيانات الوصفية من محتوى الملف
        const metadataObj = {};
        const postContent = content.split('---');
        const postMetaData = postContent[1] || '';
        const postBody = postContent.slice(2).join('---');
        
        if (postMetaData) {
            postMetaData.split('\n').forEach(line => {
                const separatorIndex = line.indexOf(':');
                if (separatorIndex > 0) {
                    const key = line.substring(0, separatorIndex).trim();
                    let value = line.substring(separatorIndex + 1).trim();
                    
                    // إزالة علامات الاقتباس إذا وجدت
                    if ((value.startsWith('"') && value.endsWith('"')) || 
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.substring(1, value.length - 1);
                    }
                    
                    // معالجة المصفوفات (مثل العلامات tags)
                    if (key === 'tags' && value) {
                        value = value.split(',').map(tag => tag.trim());
                    }
                    
                    metadataObj[key] = value;
                }
            });
        }

        // تحديث معلومات المقال
        const title = metadataObj.title || post.title || 'مقال غير معروف';
        const date = metadataObj.date ? new Date(metadataObj.date) : new Date(post.date);
        const author = metadataObj.author || post.author || 'فريق شرارة الأفكار';
        const readTimeValue = metadataObj.readTime || post.readTime || 5;
        const tags = metadataObj.tags ? metadataObj.tags.split(',').map(tag => tag.trim()) : (post.tags || []);
        const excerpt = metadataObj.excerpt || post.excerpt || '';
        const image = post.image || '../images/blog/default.jpg';

        // تنسيق التاريخ
        const formattedDate = date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });

        // تحديث عناصر الصفحة
        document.title = `${title} - شرارة الأفكار`;
        articleTitle.textContent = title;
        postDate.textContent = formattedDate;
        postAuthor.textContent = author;
        readTime.textContent = `${readTimeValue} دقائق قراءة`;
        
        // إضافة الوسوم
        postTags.innerHTML = tags.map(tag => 
            `<a href="blog.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`
        ).join('');

        // تحويل Markdown إلى HTML وعرضه
        articleBody.innerHTML = marked.parse(content);
        
        // إضافة فئات للعناوين والجداول
        document.querySelectorAll('h2, h3, h4, h5, h6').forEach(heading => {
            heading.classList.add('post-heading');
        });

        document.querySelectorAll('table').forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });

        // تحسين عرض الأكواد البرمجية
        if (window.hljs) {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        }


        // تحديث بيانات Open Graph للمشاركة
        if (ogTitle) ogTitle.content = title;
        if (ogDescription) ogDescription.content = excerpt;
        if (ogUrl) ogUrl.content = window.location.href;
        if (ogImage) ogImage.content = new URL(image, window.location.origin).href;
        if (postDescription) postDescription.content = excerpt;

    } catch (error) {
        console.error('فشل تحميل المقال:', error);
        articleBody.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>عذراً، لم يتم العثور على هذا المقال أو حدث خطأ في تحميله.</p>
                <a href="blog.html" class="button">العودة إلى المدونة</a>
            </div>
        `;
    }
}

// تحديث وظيفة تحميل أحدث المقالات للصفحة الرئيسية
async function updateLatestPosts() {
    const latestPostsContainer = document.getElementById('latest-posts');
    if (!latestPostsContainer) return;

    try {
        const posts = await fetchAllPosts();
        const latestPosts = posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3); // عرض آخر 3 مقالات فقط

        if (latestPosts.length === 0) {
            latestPostsContainer.innerHTML = '<p class="no-posts">لا توجد مقالات متاحة حاليًا.</p>';
            return;
        }

        let postsHTML = '';
        latestPosts.forEach(post => {
            const postDate = new Date(post.date).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            postsHTML += `
                <article class="post-card featured-post">
                    <div class="post-card-content">
                        <h3 class="post-title">
                            <a href="blog/post.html?id=${post.id}">${post.title}</a>
                        </h3>
                        <div class="post-meta">
                            <span class="post-date">${postDate}</span>
                        </div>
                        <p class="post-excerpt">${post.excerpt}</p>
                        <a href="blog/post.html?id=${post.id}" class="read-more">
                            اقرأ المزيد <span class="arrow">→</span>
                        </a>
                    </div>
                </article>
            `;
        });

        latestPostsContainer.innerHTML = postsHTML;
    } catch (error) {
        console.error('Failed to load latest posts:', error);
        latestPostsContainer.innerHTML = '<p class="error">حدث خطأ أثناء تحميل أحدث المقالات.</p>';
    }
}

// دالة لحساب وقت القراءة التقريبي
function calculateReadTime(text) {
    // متوسط سرعة القراءة بالكلمات في الدقيقة (بالعربية أسرع قليلاً)
    const wordsPerMinute = 200;
    // حساب عدد الكلمات (تقريبي)
    const wordCount = text.trim().split(/\s+/).length;
    // حساب الدقائق وتقريبها لأقرب رقم صحيح
    return Math.ceil(wordCount / wordsPerMinute) || 1;
}

// دالة لتحميل وتطبيق أنماط Highlight.js
function loadHighlightJS() {
    if (document.querySelector('pre code')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css';
        document.head.appendChild(link);
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js';
        script.onload = () => {
            // تحميل اللغات الإضافية إذا لزم الأمر
            // hljs.registerLanguage('javascript', javascript);
            // hljs.registerLanguage('python', python);
        };
        document.body.appendChild(script);
    }
}

// دالة لإنشاء تأثيرات التفاعل مع الصور
function setupImageZoom() {
    document.querySelectorAll('.post-body img:not(.no-zoom)').forEach(img => {
        // إضافة زر تكبير الصورة
        const zoomButton = document.createElement('button');
        zoomButton.className = 'image-zoom-button';
        zoomButton.innerHTML = '<i class="fas fa-search-plus"></i>';
        zoomButton.setAttribute('aria-label', 'تكبير الصورة');
        
        // إضافة زر التحميل
        const downloadButton = document.createElement('a');
        downloadButton.className = 'image-download-button';
        downloadButton.href = img.src;
        downloadButton.download = '';
        downloadButton.innerHTML = '<i class="fas fa-download"></i>';
        downloadButton.setAttribute('aria-label', 'تحميل الصورة');
        
        // إنشاء غلاف للصورة والأزرار
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(zoomButton);
        wrapper.appendChild(downloadButton);
        
        // إضافة فئة للصورة للإشارة إلى إمكانية التكبير
        img.classList.add('zoomable');
        
        // إضافة حدث النقر للتكبير
        img.addEventListener('click', (e) => {
            if (e.target === img) {
                const modal = document.createElement('div');
                modal.className = 'image-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <img src="${img.src}" alt="${img.alt || ''}">
                        <button class="close-modal" aria-label="إغلاق">&times;</button>
                    </div>
                `;
                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';
                
                // إغلاق النافذة المنبثقة عند النقر خارج الصورة
                modal.addEventListener('click', (e) => {
                    if (e.target === modal || e.target.classList.contains('close-modal')) {
                        document.body.removeChild(modal);
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    });
}

// تهيئة متابعة التمرير لشريط التقدم
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    document.body.prepend(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
    });
}

// تحديد أي وظيفة يجب تشغيلها عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة متابعة التمرير لشريط التقدم
    if (document.querySelector('article.post-content')) {
        initReadingProgress();
    }
    
    // إذا كان المسار يشير إلى صفحة المدونة الرئيسية (blog.html)
    if (window.location.pathname.includes('/blog/blog.html') || 
        window.location.pathname.endsWith('/blog/') ||
        window.location.pathname.includes('/blog/index.html')) {
        displayBlogPosts();
    } 
    // إذا كان المسار يشير إلى صفحة المقال الفردي (post.html)
    else if (window.location.pathname.includes('/blog/post.html')) {
        displaySinglePost();
    }
    // تحديث أحدث المقالات في الصفحة الرئيسية
    else if (window.location.pathname.endsWith('index.html') || 
             window.location.pathname.endsWith('/')) {
        updateLatestPosts();
    }
});
