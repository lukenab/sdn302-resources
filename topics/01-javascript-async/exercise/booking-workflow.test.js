import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createBooking,
  findRoom,
  findRoomWithCallback
} from './booking-workflow.js';

test('callback API returns the matching room', async () => {
  const room = await new Promise((resolve, reject) => {
    findRoomWithCallback(1, (error, value) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(value);
    });
  });

  assert.equal(room.name, 'Alpha');
});

test('callback API reports a missing room', async () => {
  await assert.rejects(
    new Promise((resolve, reject) => {
      findRoomWithCallback(999, (error, value) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(value);
      });
    }),
    /Room not found/
  );
});

test('Promise API resolves with the matching room', async () => {
  const room = await findRoom(1);

  assert.equal(room.id, 1);
});

test('Promise API rejects for a missing room', async () => {
  await assert.rejects(findRoom(999), /Room not found/);
});

test('async workflow creates a booking', async () => {
  const booking = await createBooking(1, 3);

  assert.deepEqual(booking, {
    roomId: 1,
    roomName: 'Alpha',
    hours: 3,
    totalPrice: 300
  });
});

test('async workflow rejects an unavailable room', async () => {
  await assert.rejects(createBooking(2, 2), /Room is unavailable/);
});

test('async workflow validates hours', async () => {
  await assert.rejects(createBooking(1, 0), /Hours must be greater than 0/);
});
