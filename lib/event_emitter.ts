export class EventEmitter<T> {
  private subscribers: SubscriptionCallback<T>[] = [];

  subscribe(callback: SubscriptionCallback<T>): void {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: SubscriptionCallback<T>) {
    this.subscribers = this.subscribers.filter((c) => c !== callback);
  }

  emit(event: T) {
    setTimeout(() => {
      this.subscribers.forEach((callback) => {
        callback(event);
      });
    }, 0);
  }
}

export type SubscriptionCallback<T> = (event: T) => void;
