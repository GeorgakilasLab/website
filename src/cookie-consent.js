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

    // Build Banner DOM
    function initBannerUI() {
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
