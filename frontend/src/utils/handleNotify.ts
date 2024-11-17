import { Notify } from "quasar"

type NotifyType = 'positive' | 'negative'
export function handleNotify (message: string, type: NotifyType): void {
    Notify.create({
        message,
        color: type === 'positive' ? 'green' : 'red',
        position: 'top',
        timeout: 2000,
    })
}