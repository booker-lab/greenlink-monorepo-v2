/**
 * 푸시 알림 유틸리티 (PWA Web Push API)
 *
 * MVP: 브라우저 내부 알림만 지원
 * 추후: VAPID 키 + 서버 연동으로 실제 푸시 발송
 */

/** 알림 권한 요청 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.log('[Push] 이 브라우저는 알림을 지원하지 않습니다.');
        return false;
    }

    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    const result = await Notification.requestPermission();
    return result === 'granted';
}

/** 로컬 알림 발송 */
export function showLocalNotification(title: string, body: string, options?: {
    tag?: string;
    url?: string;
    vibrate?: number[];
}) {
    if (!('serviceWorker' in navigator)) {
        // SW 없으면 Notification API 직접 사용
        if (Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/icons/icon-192.png' });
        }
        return;
    }

    navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
            body,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            tag: options?.tag || 'default',
            data: { url: options?.url || '/delivery' },
        } as NotificationOptions);
    });
}

/** 새 배송 알림 */
export function notifyNewDelivery(recipientName: string, address: string) {
    showLocalNotification(
        '🚚 새 배송 도착!',
        `${recipientName} · ${address}`,
        { tag: 'new-delivery', vibrate: [200, 100, 200, 100, 200] }
    );
}

/** 상태 변경 알림 */
export function notifyStatusChange(status: string, recipientName: string) {
    const messages: Record<string, string> = {
        PICKED_UP: `📦 ${recipientName}님 상품 픽업 완료`,
        IN_TRANSIT: `🚚 ${recipientName}님 상품 배송 출발`,
        DELIVERED: `✅ ${recipientName}님 배송 완료!`,
    };

    showLocalNotification(
        '배송 상태 변경',
        messages[status] || `${recipientName} 배송 상태 업데이트`,
        { tag: `status-${status}` }
    );
}
