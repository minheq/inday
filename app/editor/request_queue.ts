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
    const firstMatch =
      this.requestQueue[0].message.type === fromWebViewMessage.type;

    if (firstMatch) {
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
    const pairs: [Request, FromWebViewMessage][] = [];

    for (let i = 0; i < this.requestQueue.length; i++) {
      const request = this.requestQueue[i];
      let found = false;

      for (let j = 0; j < this.receiveQueue.length; j++) {
        const fromWebViewMessage = this.receiveQueue[j];

        if (fromWebViewMessage.type === request.message.type) {
          pairs.push([request, fromWebViewMessage]);
          found = true;
          break;
        }
      }

      if (!found) {
        // No response yet
        return;
      }
    }

    for (let i = 0; i < pairs.length; i++) {
      const [request, message] = pairs[i];
      request.callback(message);
    }
  }
}
