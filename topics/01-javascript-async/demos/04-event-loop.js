console.log('1 - synchronous');

setTimeout(() => {
  console.log('5 - timer callback');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3 - first Promise microtask');
  })
  .then(() => {
    console.log('4 - chained Promise microtask');
  });

console.log('2 - synchronous');

/*
Predict the output before running:

1.
2.
3.
4.
5.

Then run:
npm run demo:event-loop
*/
