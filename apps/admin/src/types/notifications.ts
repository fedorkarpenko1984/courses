type TNotificationType = 'success' | 'error'

export type TNotification = {
  id?: string,
  message: string,
  type: TNotificationType,
}