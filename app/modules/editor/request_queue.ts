import { ToWebViewMessage, FromWebViewMessage } from './types';

type ResponseCallback = (message: FromWebViewMessage) => void;

interface Request {
  message: ToWebViewMessage;
  callback: ResponseCallback;
}

/**
 * RequestQueue ensures that request messages to the iframe
 * receive corresponding response messages from it.
 */
export class RequestQueue {
  requestQueue: Request[] = [];
  receiveQueue: FromWebViewMessage[] = [];

  request(message: ToWebViewMessage, callback: ResponseCallback): void {
    this.requestQueue.push({ message, callback });
  }

  receive(fromWebViewMessage: FromWebViewMessage): void {
    const receiveMatch =
      this.requestQueue[0].message.type === fromWebViewMessage.type;

    if (receiveMatch) {
      const request = this.requestQueue.shift();

      if (!request) {
        throw new Error(
          `Expected a matching request to receive message ${JSON.stringify(
            fromWebViewMessage,
          )}`,
        );
      }

      request.callback(fromWebViewMessage);
      this.flush();
      return;
    }

    this.receiveQueue.push(fromWebViewMessage);
  }

  flush() {
    for (let i = 0; i < this.requestQueue.length; i++) {
      const request = this.requestQueue[i];
      let found = false;

      for (let j = 0; j < this.receiveQueue.length; j++) {
        const fromWebViewMessage = this.receiveQueue[j];

        if (fromWebViewMessage.type === request.message.type) {
          request.callback(fromWebViewMessage);
          this.requestQueue.splice(i, 1);
          this.receiveQueue.splice(i, 1);
          found = true;
          break;
        }
      }

      if (!found) {
        throw new Error(
          `Expected a matching receive message from request ${JSON.stringify(
            request.message,
          )}`,
        );
      }
    }
  }
}
