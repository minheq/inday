import { Event } from './types';
import { atom } from 'recoil';
import { RecoilKey } from './constants';

type SubscriptionCallback = (event: Event) => void;

class EventEmitter {
  private subscribers: SubscriptionCallback[] = [];

  subscribe(callback: SubscriptionCallback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: SubscriptionCallback) {
    this.subscribers = this.subscribers.filter((c) => c !== callback);
  }

  emit(event: Event) {
    this.subscribers.forEach((callback) => {
      callback(event);
    });
  }
}

export const eventEmitter = new EventEmitter();

export function useEventEmitter() {
  return eventEmitter;
}

export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: RecoilKey.Events,
  default: [],
});
