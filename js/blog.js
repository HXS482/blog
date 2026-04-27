    // ── Blog Engine ──────────────────────────────────
    const BLOG = {
        title: '~/blog',
        tagline: 'A retro digital garden.',
        posts: [],
        currentRoute: '',
    };

    const $ = id => document.getElementById(id);
    const typewriterEl = $('typewriter');
    const cursorEl = $('typing-cursor');
    const windowTitle = $('window-title');
    const crtContentArea = $('crt-content-area');
    const contentBody = $('content-body');
    const postList = $('post-list');
    const postCount = $('post-count');
    const postsNav = $('posts-nav');
    const ctaBtn = $('cta-btn');
    const statusBar = $('status-bar');
    let typewriterTimer = null;

    // ── Router ───────────────────────────────────────
    function route() {
        const hash = location.hash.replace('#', '') || 'home';
        BLOG.currentRoute = hash;

        // Update nav active states
        document.querySelectorAll('.icon-list button[data-nav]').forEach(el => {
            const nav = el.getAttribute('data-nav');
            el.classList.toggle('nav-active', hash.startsWith(nav) || (hash === 'home' && nav === 'home'));
        });

        if (hash === 'home') renderHome();
        else if (hash === 'about') renderAbout();
        else if (hash === 'posts') renderPostList();
        else if (hash.startsWith('post/')) renderPost(hash.replace('post/', ''));
        else if (hash === 'archive') renderArchive();
        else renderHome();
    }

    window.addEventListener('hashchange', route);

    // ── Navigation handlers ──────────────────────────
    document.querySelectorAll('.icon-list button[data-nav]').forEach(el => {
        el.addEventListener('click', () => {
            const nav = el.getAttribute('data-nav');
            if (nav === 'home') location.hash = '';
            else if (nav === 'posts') location.hash = 'posts';
            else if (nav === 'about') location.hash = 'about';
            else if (nav === 'archive') location.hash = 'archive';
            else if (nav === 'rss') location.hash = 'posts';
        });
    });

    // ── Typewriter ───────────────────────────────────
    function typeText(text, callback) {
        if (typewriterTimer) clearTimeout(typewriterTimer);
        typewriterEl.textContent = '';
        cursorEl.style.display = 'inline-block';
        let i = 0;
        function tick() {
            if (i < text.length) {
                typewriterEl.textContent += text.charAt(i);
                i++;
                typewriterTimer = setTimeout(tick, 80 + Math.random() * 60);
            } else {
                cursorEl.style.display = 'none';
                if (callback) callback();
            }
        }
        tick();
    }

    // ── Content renderers ────────────────────────────
    function renderCrtContent(html) {
        crtContentArea.innerHTML = `<div class="crt-content">${html}</div>`;
    }

    function renderPageContent(html, meta) {
        document.body.classList.add('detail-mode');
        let metaHtml = '';
        if (meta && meta.date) {
            metaHtml = `<div class="post-meta">${meta.date}</div>`;
        }
        contentBody.innerHTML = `<a class="back-link" href="#">← Back to Home</a>${metaHtml}${html}`;
        contentBody.classList.add('visible');
        postsNav.style.display = 'none';
    }

    function showHomeLayout() {
        document.body.classList.remove('detail-mode');
        contentBody.classList.remove('visible');
        contentBody.innerHTML = '';
        postsNav.style.display = '';
    }

    async function loadMd(path) {
        try {
            const resp = await fetch(path);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return await resp.text();
        } catch (e) {
            return `# Error\n\nCould not load \`${path}\`: ${e.message}`;
        }
    }

    function mdToHtml(md) {
        // Strip YAML frontmatter if present
        let content = md;
        if (content.startsWith('---')) {
            const end = content.indexOf('---', 3);
            if (end !== -1) content = content.slice(end + 3);
        }
        return marked.parse(content.trim());
    }

    async function renderHome() {
        showHomeLayout();
        ctaBtn.textContent = 'About Me';
        ctaBtn.href = '#about';
        if (BLOG.posts.length === 0) {
            renderCrtContent('<p>No posts yet. Start writing!</p>');
            windowTitle.textContent = 'welcome.txt';
            typeText('Welcome to the blog.', null);
            return;
        }
        const latest = BLOG.posts[0];
        windowTitle.textContent = latest.slug + '.md';
        statusBar.textContent = 'BlogOS v1.0 — Home';

        const md = await loadMd('posts/' + latest.slug + '.md');
        renderCrtContent(mdToHtml(md));
        typeText(latest.title, null);
    }

    async function renderPost(slug) {
        const post = BLOG.posts.find(p => p.slug === slug);
        if (!post) {
            renderCrtContent('<p>Post not found.</p>');
            return;
        }
        windowTitle.textContent = slug + '.md';
        ctaBtn.textContent = 'Back Home';
        ctaBtn.href = '#';
        statusBar.textContent = 'BlogOS v1.0 — Reading: ' + post.title;

        const md = await loadMd('posts/' + slug + '.md');
        const html = mdToHtml(md);
        renderCrtContent(html);
        renderPageContent(html, { date: post.date });
        typeText(post.title, null);

        // Update left column active state
        document.querySelectorAll('.post-item').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-slug') === slug);
        });
    }

    async function renderAbout() {
        windowTitle.textContent = 'about.md';
        ctaBtn.textContent = 'Back Home';
        ctaBtn.href = '#';
        statusBar.textContent = 'BlogOS v1.0 — About';
        document.querySelectorAll('.post-item').forEach(el => el.classList.remove('active'));

        const md = await loadMd('about.md');
        const html = mdToHtml(md);
        renderCrtContent(html);
        renderPageContent(html, null);
        typeText('About Me', null);
    }

    async function renderPostList() {
        showHomeLayout();
        windowTitle.textContent = 'posts.idx';
        ctaBtn.textContent = 'Back Home';
        ctaBtn.href = '#';
        statusBar.textContent = 'BlogOS v1.0 — All Posts';
        document.querySelectorAll('.post-item').forEach(el => el.classList.remove('active'));

        if (BLOG.posts.length === 0) {
            renderCrtContent('<p>No posts yet.</p>');
            typeText('No posts found.', null);
            return;
        }

        const items = BLOG.posts.map(p =>
            `<div style="margin-bottom:3px;">` +
            `<a href="#post/${p.slug}" style="color:#74b9ff;">▸ ${p.title}</a>` +
            `<span style="color:#666;font-size:9px;margin-left:6px;">${p.date}</span>` +
            `</div>`
        ).join('');

        renderCrtContent(items);
        typeText('All Posts (' + BLOG.posts.length + ' total)', null);
    }

    async function renderArchive() {
        showHomeLayout();
        windowTitle.textContent = 'archive.idx';
        ctaBtn.textContent = 'Back Home';
        ctaBtn.href = '#';
        statusBar.textContent = 'BlogOS v1.0 — Archive';
        document.querySelectorAll('.post-item').forEach(el => el.classList.remove('active'));

        if (BLOG.posts.length === 0) {
            renderCrtContent('<p>Archive is empty.</p>');
            typeText('Archive empty.', null);
            return;
        }

        const grouped = {};
        BLOG.posts.forEach(p => {
            const yr = p.date.slice(0, 4);
            if (!grouped[yr]) grouped[yr] = [];
            grouped[yr].push(p);
        });

        let html = '';
        for (const yr of Object.keys(grouped).sort().reverse()) {
            html += `<h2>${yr}</h2><ul>`;
            grouped[yr].forEach(p => {
                html += `<li><a href="#post/${p.slug}" style="color:#74b9ff;">${p.title}</a> <span style="color:#666;font-size:9px;">${p.date}</span></li>`;
            });
            html += `</ul>`;
        }

        renderCrtContent(html);
        typeText('Archive', null);
    }

    function renderPostListNav() {
        if (BLOG.posts.length === 0) {
            postList.innerHTML = '<div class="post-empty">No posts yet.</div>';
            return;
        }
        postList.innerHTML = BLOG.posts.map(p =>
            `<a class="post-item" data-slug="${p.slug}" href="#post/${p.slug}">` +
            `<span class="post-date">${p.date}</span>${p.title}` +
            `</a>`
        ).join('');
    }

    // ── Boot ─────────────────────────────────────────
    async function boot() {
        try {
            const resp = await fetch('posts.json');
            if (resp.ok) {
                BLOG.posts = await resp.json();
            }
        } catch (e) {
            BLOG.posts = [];
        }

        postCount.textContent = BLOG.posts.length + (BLOG.posts.length === 1 ? ' post' : ' posts');
        renderPostListNav();
        route();
    }

    boot();
