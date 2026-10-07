/* ==========================================================================
   YuqiEngine · Theme Manager (主题管理器)
   --------------------------------------------------------------------------
   - 支持 'light' (默认/极简浅色钛白) 与 'dark' (深空黑曜石)
   - 默认浅色 (Default: light)
   - 跨视图持久化 (localStorage)
   - 实时同步标题栏按钮与设置页切换控件
   ========================================================================== */
(function() {
    'use strict';

    const STORAGE_KEY = 'yuqi_theme_preference';
    const DEFAULT_THEME = 'light';

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
        } catch (e) {
            return DEFAULT_THEME;
        }
    }

    function applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('theme-dark');
            root.classList.remove('theme-light');
        } else {
            root.setAttribute('data-theme', 'light');
            root.classList.add('theme-light');
            root.classList.remove('theme-dark');
        }

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {}

        updateUiControls(theme);

        document.dispatchEvent(new CustomEvent('yuqi-theme-changed', {
            detail: { theme }
        }));
    }

    function updateUiControls(theme) {
        // 更新标题栏图标
        const titleBar = document.querySelector('title-bar');
        if (titleBar) {
            const moonIcon = titleBar.querySelector('.theme-icon-moon');
            const sunIcon = titleBar.querySelector('.theme-icon-sun');
            if (moonIcon && sunIcon) {
                if (theme === 'dark') {
                    moonIcon.style.display = 'none';
                    sunIcon.style.display = 'inline-block';
                } else {
                    moonIcon.style.display = 'inline-block';
                    sunIcon.style.display = 'none';
                }
            }
        }

        // 更新设置页按钮状态
        const setBtns = document.querySelectorAll('.set-theme-btn');
        setBtns.forEach(btn => {
            const val = btn.getAttribute('data-value');
            const isActive = val === theme;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });
    }

    // 暴露全局 API
    window.getYuqiTheme = getStoredTheme;
    window.setYuqiTheme = applyTheme;
    window.toggleYuqiTheme = function() {
        const curr = getStoredTheme();
        const next = curr === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        return next;
    };

    // 尽早执行应用主题，避免闪屏
    applyTheme(getStoredTheme());

    // DOM 加载就绪后更新 UI 状态
    document.addEventListener('DOMContentLoaded', () => {
        updateUiControls(getStoredTheme());
    });

    // 监听视图切换以在渲染设置页时同步状态
    document.addEventListener('view-changed', () => {
        setTimeout(() => updateUiControls(getStoredTheme()), 30);
    });
})();
