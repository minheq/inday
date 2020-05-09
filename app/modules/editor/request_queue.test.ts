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

test('single', () => {
  const q = new RequestQueue();
  const messages: FromWebViewMessage[] = [];

  q.request({ type: 'get-formats' }, (message) => {
    messages.push(message);
  });

  const response1: FromWebViewGetFormats = { type: 'get-formats', formats: {} };
  q.receive(response1);

  expect(messages[0]).toMatchObject(response1);

  console.log(messages);
});

test('reverse order', () => {
  const q = new RequestQueue();
  const messages: FromWebViewMessage[] = [];

  function add(message: FromWebViewMessage) {
    messages.push(message);
  }

  const request1: ToWebViewGetFormats = { type: 'get-formats' };
  q.request(request1, add);
  const request2: ToWebViewGetSelection = { type: 'get-selection' };
  q.request(request2, add);
  const request3: ToWebViewGetText = {
    type: 'get-text',
    range: { index: 0, length: 0 },
  };
  q.request(request3, add);

  // No matter what the response order is like, it should follow the same sequence of requests
  const response1: FromWebViewGetText = { type: 'get-text', text: '' };
  const response2: FromWebViewGetSelection = {
    type: 'get-selection',
    range: { index: 0, length: 0 },
  };
  const response3: FromWebViewGetFormats = { type: 'get-formats', formats: {} };

  q.receive(response1);
  q.receive(response2);
  q.receive(response3);

  console.log(messages);

  expect(messages[0]).toMatchObject(response3);
  expect(messages[1]).toMatchObject(response2);
  expect(messages[2]).toMatchObject(response1);
});
