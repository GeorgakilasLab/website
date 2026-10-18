/**
 * GeorgakilasLab - Cookie Consent Manager (GDPR / ePrivacy Directive compliant with Google Consent Mode v2)
 */
(function () {
    const STORAGE_KEY = 'georgakilas_cookie_consent';

    // 1. Initialize dataLayer and gtag before any Google tags execute
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    // Check stored user preference
    const savedConsent = localStorage.getItem(STORAGE_KEY);

    // 2. Set default Google Consent Mode v2 states
    // If user previously accepted, grant analytics_storage; otherwise default to denied
    gtag('consent', 'default', {
        'analytics_storage': savedConsent === 'granted' ? 'granted' : 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });

    // Helper to delete Google Analytics cookies (_ga, _ga_*, _gid, _gat)
    function clearAnalyticsCookies() {
        const cookies = document.cookie.split(';');
        const hostname = window.location.hostname;
        const domainParts = hostname.split('.');

        for (let i = 0; i < cookies.length; i++) {
            const cookieName = cookies[i].split('=')[0].trim();
            if (cookieName.startsWith('_ga') || cookieName === '_gid' || cookieName === '_gat') {
                document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = cookieName + '=; Path=/; Domain=' + hostname + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                if (domainParts.length > 1) {
                    const rootDomain = '.' + domainParts.slice(-2).join('.');
                    document.cookie = cookieName + '=; Path=/; Domain=' + rootDomain + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
            }
        }
    }

    // Apply consent decision
    function applyConsent(status) {
        localStorage.setItem(STORAGE_KEY, status);

        if (status === 'granted') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        } else {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
            clearAnalyticsCookies();
        }

        hideBanner();
    }

    // Ensure banner styles are self-contained and immune to external CSS caching
    function injectStyles() {
        if (document.getElementById('cookie-consent-styles')) return;

        const style = document.createElement('style');
        style.id = 'cookie-consent-styles';
        style.textContent = `
            .cookie-consent-banner {
                position: fixed !important;
                bottom: 55px !important;
                right: 20px !important;
                max-width: 440px !important;
                width: calc(100% - 40px) !important;
                z-index: 100000 !important;
                font-family: "Courier New", Courier, monospace !important;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
            }
            .cookie-consent-banner.cookie-banner-visible {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(0) !important;
            }
            .cookie-banner-card {
                background: #18181b !important;
                color: #f4f4f5 !important;
                border: 1px solid #3f3f46 !important;
                border-radius: 12px !important;
                padding: 22px !important;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45) !important;
                box-sizing: border-box !important;
            }
            .cookie-banner-header {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                margin-bottom: 10px !important;
            }
            .cookie-banner-icon {
                font-size: 24px !important;
            }
            .cookie-banner-title {
                margin: 0 !important;
                font-size: 18px !important;
                font-weight: bold !important;
                color: rgb(255, 255, 0) !important;
                letter-spacing: -0.5px !important;
            }
            .cookie-banner-text {
                font-size: 13px !important;
                line-height: 1.5 !important;
                color: #d4d4d8 !important;
                margin: 0 0 16px 0 !important;
                text-align: left !important;
            }
            .cookie-categories {
                background: #27272a !important;
                border: 1px solid #3f3f46 !important;
                border-radius: 8px !important;
                padding: 12px 14px !important;
                margin-bottom: 18px !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 12px !important;
            }
            .cookie-category-item {
                position: relative !important;
            }
            .cookie-checkbox-label {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                cursor: pointer !important;
                font-weight: bold !important;
                font-size: 14px !important;
                color: #ffffff !important;
            }
            .cookie-checkbox-label input[type="checkbox"] {
                accent-color: rgb(255, 255, 0) !important;
                width: 16px !important;
                height: 16px !important;
                cursor: pointer !important;
            }
            .cookie-checkbox-label input[type="checkbox"]:disabled {
                cursor: not-allowed !important;
                opacity: 0.7 !important;
            }
            .cookie-always-active {
                position: absolute !important;
                right: 0 !important;
                top: 0 !important;
                font-size: 11px !important;
                background: rgba(255, 255, 255, 0.15) !important;
                color: #a1a1aa !important;
                padding: 2px 6px !important;
                border-radius: 4px !important;
                text-transform: uppercase !important;
            }
            .cookie-category-desc {
                font-size: 11px !important;
                line-height: 1.4 !important;
                color: #a1a1aa !important;
                margin: 4px 0 0 24px !important;
                text-align: left !important;
            }
            .cookie-banner-actions {
                display: flex !important;
                flex-wrap: wrap !important;
                align-items: center !important;
                gap: 8px !important;
            }
            .cookie-btn {
                font-family: inherit !important;
                font-size: 13px !important;
                font-weight: bold !important;
                padding: 9px 14px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                border: none !important;
                outline: none !important;
            }
            .cookie-btn-primary {
                background-color: rgb(255, 255, 0) !important;
                color: #000000 !important;
                flex: 1 1 auto !important;
            }
            .cookie-btn-primary:hover {
                background-color: #ffd700 !important;
                transform: translateY(-1px) !important;
            }
            .cookie-btn-secondary {
                background-color: #3f3f46 !important;
                color: #ffffff !important;
                border: 1px solid #52525b !important;
            }
            .cookie-btn-secondary:hover {
                background-color: #52525b !important;
                color: rgb(255, 255, 0) !important;
            }
            .cookie-btn-link {
                background: transparent !important;
                color: #a1a1aa !important;
                padding: 6px 10px !important;
                font-size: 12px !important;
                text-decoration: underline !important;
                width: 100% !important;
                text-align: center !important;
                margin-top: 4px !important;
            }
            .cookie-btn-link:hover {
                color: #ffffff !important;
            }
            .cookie-footer-link {
                color: rgb(255, 255, 0) !important;
                text-decoration: underline !important;
                cursor: pointer !important;
                font-size: inherit !important;
                font-family: inherit !important;
                margin-left: 4px !important;
                transition: color 0.2s ease !important;
            }
            .cookie-footer-link:hover {
                color: #ffffff !important;
            }
            @media (max-width: 600px) {
                .cookie-consent-banner {
                    right: 10px !important;
                    left: 10px !important;
                    bottom: 55px !important;
                    width: auto !important;
                    max-width: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Build Banner DOM
    function initBannerUI() {
        injectStyles();
        if (document.getElementById('cookie-consent-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'true');
        banner.setAttribute('aria-label', 'Cookie Preferences');

        banner.innerHTML = `
            <div class="cookie-banner-card">
                <div class="cookie-banner-header">
                    <span class="cookie-banner-icon">🍪</span>
                    <h3 class="cookie-banner-title">Cookie & Privacy Preferences</h3>
                </div>
                <p class="cookie-banner-text">
                    We use cookies to analyze web traffic and improve your browsing experience. 
                    You can accept all cookies, save your preferences, or decline non-essential cookies.
                </p>

                <div class="cookie-categories">
                    <div class="cookie-category-item">
                        <label class="cookie-checkbox-label">
                            <input type="checkbox" checked disabled>
                            <span class="cookie-category-name">Strictly Necessary</span>
                        </label>
                        <span class="cookie-always-active">Always Active</span>
                        <p class="cookie-category-desc">Essential for the website's basic functionality and navigation.</p>
                    </div>

                    <div class="cookie-category-item">
                        <label class="cookie-checkbox-label" for="cookie-analytics-check">
                            <!-- Pre-selected as requested -->
                            <input type="checkbox" id="cookie-analytics-check" checked>
                            <span class="cookie-category-name">Analytics & Performance</span>
                        </label>
                        <p class="cookie-category-desc">Collects anonymized traffic data via Google Analytics to help us improve the lab's website.</p>
                    </div>
                </div>

                <div class="cookie-banner-actions">
                    <button type="button" id="cookie-accept-all" class="cookie-btn cookie-btn-primary">Accept All</button>
                    <button type="button" id="cookie-save-prefs" class="cookie-btn cookie-btn-secondary">Save Selection</button>
                    <button type="button" id="cookie-reject-all" class="cookie-btn cookie-btn-link">Reject Non-Essential</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        const analyticsCheckbox = document.getElementById('cookie-analytics-check');
        const currentChoice = localStorage.getItem(STORAGE_KEY);

        // If previously explicitly rejected, uncheck analytics; otherwise pre-select it
        if (currentChoice === 'denied') {
            analyticsCheckbox.checked = false;
        } else {
            analyticsCheckbox.checked = true; // Pre-selected
        }

        document.getElementById('cookie-accept-all').addEventListener('click', function () {
            analyticsCheckbox.checked = true;
            applyConsent('granted');
        });

        document.getElementById('cookie-save-prefs').addEventListener('click', function () {
            if (analyticsCheckbox.checked) {
                applyConsent('granted');
            } else {
                applyConsent('denied');
            }
        });

        document.getElementById('cookie-reject-all').addEventListener('click', function () {
            analyticsCheckbox.checked = false;
            applyConsent('denied');
        });

        // If no preference stored yet, display banner
        if (!savedConsent) {
            showBanner();
        }

        // Attach "Cookie Settings" trigger to footer
        attachFooterSettingsTrigger();
    }

    function showBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('cookie-banner-visible');
        }
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('cookie-banner-visible');
        }
    }

    function attachFooterSettingsTrigger() {
        const footer = document.querySelector('footer');
        if (footer && !document.getElementById('cookie-settings-trigger')) {
            const separator = document.createTextNode(' · ');
            const trigger = document.createElement('a');
            trigger.id = 'cookie-settings-trigger';
            trigger.href = '#';
            trigger.className = 'cookie-footer-link';
            trigger.textContent = 'Cookie Settings';
            trigger.title = 'Manage cookie preferences';
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                showBanner();
            });
            footer.appendChild(separator);
            footer.appendChild(trigger);
        }
    }

    // Ensure DOM is ready before injecting UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBannerUI);
    } else {
        initBannerUI();
    }
})();
