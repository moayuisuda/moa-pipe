## Promise的限流管道&限流队列
```js
function sleep(e) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(e);
    }, 2000);
  });
}


// Promise.pipe，适合在可预知有哪些请求的情况下使用
Promise.pipe(
  [
    [sleep, [1]], // sleep为函数，[1]为参数数组
    [sleep, [2]],
    [sleep, [3]],
    [sleep, [4]],
    [sleep, [5]]
  ],
  2,
  e => {
    console.log(e);
  }
).then(arr => console.log(arr)); // 每次处理两个任务，处理完处理下两个任务。


// Promise.Limiter，内部自动限流，适合不可预知将会有多少请求的情况
const limiter = new Promise.Limiter(2);
let i = 0;
btn.addEventListener("click", () => {
  limiter.mount(sleep, [i++]).then(e => { // sleep为函数，[i++]为参数数组
    console.log(e);
  });
}); // 当任务数大于2，等待之前的任务处理再处理下个任务。
```