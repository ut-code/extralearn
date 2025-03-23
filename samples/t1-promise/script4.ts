const p1 = new Promise((resolve, _reject) => {
  resolve(1);
});
p1.then(console.log);

const p2 = Promise.resolve(2);
p2.then(console.log);

const p3 = Promise.reject(3);
p3.catch(console.error);

const { promise: p4, resolve } = Promise.withResolvers();
p4.then(console.log);
resolve(4);
