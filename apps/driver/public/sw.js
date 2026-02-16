const CACHE_NAME = 'greenlink-driver-v1';
const PRECACHE_URLS = [
    '/',
    '/login',
    '/delivery',
    '/manifest.json',
];

// 설치: 핵심 페이지 사전 캐시
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// 활성화: 이전 버전 캐시 정리
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// 페치: Network First → Cache Fallback
self.addEventListener('fetch', (event) => {
    // API 요청은 항상 네트워크 우선
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // 페이지/에셋: 네트워크 우선, 실패 시 캐시
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 성공 응답은 캐시에 저장
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

// 푸시 알림 수신
self.addEventListener('push', (event) => {
    let data = { title: '그린링크 드라이버', body: '새로운 알림이 있습니다.' };

    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        // fallback
    }

    const options = {
        body: data.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'default',
        data: {
            url: data.url || '/delivery',
        },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// 알림 클릭: 앱으로 이동
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/delivery';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // 이미 열린 창이 있으면 포커스
                for (const client of windowClients) {
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // 없으면 새 창
                if (self.clients.openWindow) {
                    return self.clients.openWindow(urlToOpen);
                }
            })
    );
});
