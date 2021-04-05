export class Notification {
  id: string;
  plug: string;
  action: string;
  code: string;
  message: string;
  timestamp: Date;

  constructor() {
    this.id = "";
    this.plug = "";
    this.action = "";
    this.code = "";
    this.message = "";
    this.timestamp = new Date();
  }
}

export class NotificationsState {
  notifications: Notification[];
  error: boolean;

  constructor() {
    this.notifications = [];
    this.error = false;
  }
}
