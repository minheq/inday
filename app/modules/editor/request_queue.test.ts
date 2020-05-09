import { RequestQueue } from './request_queue';
import {
  FromWebViewMessage,
  FromWebViewGetFormats,
  FromWebViewGetText,
  FromWebViewGetSelection,
  ToWebViewGetFormats,
  ToWebViewGetSelection,
  ToWebViewGetText,
} from './types';

class MessagesHolder {
  messages: FromWebViewMessage[] = [];

  add = (message: FromWebViewMessage) => {
    this.messages.push(message);
  };

  at = (index: number) => {
    return this.messages[index];
  };
}

const request1: ToWebViewGetFormats = { type: 'get-formats' };
const request2: ToWebViewGetSelection = { type: 'get-selection' };
const request3: ToWebViewGetText = {
  type: 'get-text',
  range: { index: 0, length: 0 },
};

const response1: FromWebViewGetFormats = { type: 'get-formats', formats: {} };
const response2: FromWebViewGetSelection = {
  type: 'get-selection',
  range: { index: 0, length: 0 },
};
const response3: FromWebViewGetText = { type: 'get-text', text: '' };

test('single happy', () => {
  const q = new RequestQueue();
  const messages = new MessagesHolder();
  console.log(messages);

  q.request(request1, messages.add);
  q.receive(response1);

  expect(messages.at(0)).toMatchObject(response1);
});

test('multiple in order', () => {
  const q = new RequestQueue();
  const messages = new MessagesHolder();

  q.request(request1, messages.add);
  q.request(request2, messages.add);
  q.request(request3, messages.add);

  q.receive(response1);
  q.receive(response3);
  q.receive(response2);

  expect(messages.at(0)).toMatchObject(response1);
  expect(messages.at(1)).toMatchObject(response2);
  expect(messages.at(2)).toMatchObject(response3);
});

test('multiple reverse order', () => {
  const q = new RequestQueue();
  const messages = new MessagesHolder();

  q.request(request1, messages.add);
  q.request(request2, messages.add);
  q.request(request3, messages.add);

  q.receive(response3);
  q.receive(response2);
  q.receive(response1);

  expect(messages.at(0)).toMatchObject(response1);
  expect(messages.at(1)).toMatchObject(response2);
  expect(messages.at(2)).toMatchObject(response3);
});
