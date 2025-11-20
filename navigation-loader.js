/**
 * navigation-loader.js
 * Soft navigation router to enable pseudo-SPA behavior while preserving global audio state.
 */
(function() {
    'use strict';

    if (window.__MIA_NAVIGATION_LOADER__) {
        return;
    }
    window.__MIA_NAVIGATION_LOADER__ = true;

    const SOFT_NAV_HEADER = 'X-MIA-Soft-Navigation';
    const PERSIST_ATTR = 'data-router-preserve';
    const IGNORE_ATTR = 'data-router-ignore';
    const sameOrigin = window.location.origin;
    const escapeSelector = (value) => {
        if (!value) return value;
        if (window.CSS && typeof window.CSS.escape === 'function') {
            return window.CSS.escape(value);
        }
        return value.replace(/[\0-\x1F\x7F"'\\]/g, '\\$&');
    };

    let isTransitioning = false;
    let currentController = null;

    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('popstate', () => transitionTo(window.location.href, { history: 'pop' }));

    window.MIARouter = {
        transitionTo
    };

    function handleDocumentClick(event) {
        if (!shouldHandleEvent(event)) {
            return;
        }

        const candidate = findNavigationCandidate(event.target);
        if (!candidate) {
            return;
        }

        event.preventDefault();
        transitionTo(candidate.href, { history: 'push' });
    }

    function shouldHandleEvent(event) {
        if (event.defaultPrevented) return false;
        if (event.button !== 0) return false; // Left click only
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
        return true;
    }

    function findNavigationCandidate(target) {
        const anchor = target.closest('a[href]');
        if (anchor && !anchor.hasAttribute(IGNORE_ATTR)) {
            if (anchor.target && anchor.target.toLowerCase() !== '_self') return null;
            if (anchor.hasAttribute('download')) return null;
            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#')) return null;
            const url = toURL(href);
            if (!url || !isInternalUrl(url)) return null;
            return url;
        }

        const clickable = target.closest('[onclick]');
        if (clickable && !clickable.hasAttribute(IGNORE_ATTR)) {
            const extracted = extractUrlFromOnclick(clickable.getAttribute('onclick'));
            if (!extracted) return null;
            const url = toURL(extracted);
            if (!url || !isInternalUrl(url)) return null;
            return url;
        }

        return null;
    }

    function toURL(href) {
        try {
            return new URL(href, window.location.href);
        } catch (_) {
            return null;
        }
    }

    function isInternalUrl(url) {
        if (!url) return false;
        if (url.origin !== sameOrigin) return false;
        if (url.pathname === window.location.pathname && url.search === window.location.search && !url.hash) {
            return false;
        }
        return true;
    }

    function extractUrlFromOnclick(onclick) {
        if (!onclick) return null;
        if (!/location\.(href|assign|replace)/.test(onclick)) return null;
        const match = onclick.match(/location\.(?:href|assign|replace)\s*=\s*['"]([^'"]+)['"]/);
        if (match && match[1]) {
            return match[1].trim();
        }
        return null;
    }

    async function transitionTo(destination, options = {}) {
        const { history = 'push' } = options;
        const targetUrl = typeof destination === 'string' ? toURL(destination) : destination;

        if (!targetUrl) {
            return;
        }

        if (!isInternalUrl(targetUrl)) {
            window.location.href = targetUrl.href;
            return;
        }

        if (isTransitioning) {
            abortCurrentTransition();
        }

        if (history !== 'pop' && targetUrl.href === window.location.href) {
            return;
        }

        const controller = new AbortController();
        currentController = controller;
        isTransitioning = true;

        indicateTransitionStart(targetUrl.href);

        try {
            const response = await fetch(targetUrl.href, {
                signal: controller.signal,
                credentials: 'same-origin',
                headers: {
                    [SOFT_NAV_HEADER]: '1',
                    'X-Requested-With': 'soft-navigation'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to load ${targetUrl.href}: ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const newDocument = parser.parseFromString(html, 'text/html');

            if (!newDocument || !newDocument.body) {
                throw new Error('Unable to parse document body');
            }

            applyNewBody(newDocument.body);
            updateDocumentTitle(newDocument);

            if (history === 'push') {
                window.history.pushState({}, '', targetUrl.href);
            } else if (history === 'replace') {
                window.history.replaceState({}, '', targetUrl.href);
            }

            if (typeof window.scrollTo === 'function') {
                try {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                } catch (_) {
                    window.scrollTo(0, 0);
                }
            }

            indicateTransitionEnd(true, targetUrl.href);
        } catch (error) {
            if (error.name === 'AbortError') {
                return;
            }

            console.error('[navigation-loader] falling back to hard navigation', error);
            indicateTransitionEnd(false);
            window.location.href = targetUrl.href;
        } finally {
            if (currentController === controller) {
                currentController = null;
                isTransitioning = false;
            }
            resetTransitionIndicator();
        }
    }

    function abortCurrentTransition() {
        if (currentController) {
            currentController.abort();
            currentController = null;
        }
        isTransitioning = false;
    }

    function applyNewBody(newBody) {
        const currentBody = document.body;
        const preservedNodes = collectPreservedNodes(currentBody);

        copyBodyAttributes(currentBody, newBody);
        replaceBodyChildren(currentBody, newBody);
        restorePreservedNodes(preservedNodes, currentBody);
        rehydrateScripts(currentBody, preservedNodes);
    }

    function collectPreservedNodes(container) {
        const preserved = new Map();
        container.querySelectorAll(`[${PERSIST_ATTR}]`).forEach(node => {
            const key = node.getAttribute(PERSIST_ATTR);
            if (!key || preserved.has(key)) {
                return;
            }
            preserved.set(key, node);
        });
        return preserved;
    }

    function copyBodyAttributes(targetBody, sourceBody) {
        Array.from(targetBody.attributes).forEach(attr => {
            targetBody.removeAttribute(attr.name);
        });
        Array.from(sourceBody.attributes).forEach(attr => {
            targetBody.setAttribute(attr.name, attr.value);
        });
    }

    function replaceBodyChildren(targetBody, sourceBody) {
        targetBody.innerHTML = '';
        while (sourceBody.firstChild) {
            targetBody.appendChild(sourceBody.firstChild);
        }
    }

    function restorePreservedNodes(preservedNodes, container) {
        preservedNodes.forEach((node, key) => {
            const placeholder = container.querySelector(`[${PERSIST_ATTR}="${escapeSelector(key)}"]`);
            if (placeholder) {
                placeholder.replaceWith(node);
            } else {
                container.appendChild(node);
            }
        });
    }

    function rehydrateScripts(container, preservedNodes) {
        const scripts = Array.from(container.querySelectorAll('script'));
        scripts.forEach(script => {
            const key = script.getAttribute(PERSIST_ATTR);
            if (key && preservedNodes.has(key)) {
                return;
            }
            if (script.type && script.type !== 'module' && script.type !== 'text/javascript' && script.type !== '') {
                return;
            }
            const executable = document.createElement('script');
            Array.from(script.attributes).forEach(attr => {
                executable.setAttribute(attr.name, attr.value);
            });
            executable.text = script.textContent || '';
            script.replaceWith(executable);
        });
    }

    function updateDocumentTitle(newDocument) {
        if (newDocument.title) {
            document.title = newDocument.title;
        }
    }

    function indicateTransitionStart(url) {
        document.dispatchEvent(new CustomEvent('soft-navigation:start', { detail: { url } }));
        document.body.style.opacity = '0.6';
    }

    function indicateTransitionEnd(success, url) {
        document.dispatchEvent(new CustomEvent('soft-navigation:end', { detail: { success, url } }));
    }

    function resetTransitionIndicator() {
        document.body.style.opacity = '1';
    }

})();
