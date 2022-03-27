/// <reference types="react" />
interface INotificationsContext {
    addTxNotification: (tx: any, type: string, explorerUrl: string) => void;
}
declare const NotificationsProvider: React.FC;
declare const useNotifications: () => INotificationsContext | null;
export { NotificationsProvider, useNotifications };
//# sourceMappingURL=Notifications.d.ts.map