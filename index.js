Promise.pipe = function(arr, limit, hook) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let re = [];
    let p = Promise.resolve();

    while (arr[index]) {
      let curr = [];
      for (let i = index; i < index + limit; i++) {
        if (arr[i]) {
          curr.push(arr[i]);
        }
      }
      p = p
        .then(() => Promise.all(curr.map(p => p[0](...p[1]))))
        .then(e => {
          re = re.concat(e);
          hook(e);
          if (re.length === arr.length) resolve(re);
        }).catch(reject);
      index += limit;
    }
  });
};


Promise.Limiter = class {
  constructor(max) {
    this.resource = max;
    this.quene = [];
  }

  mount(fn, args) {
    return new Promise((resolve, reject) => {
      let task = this.consume(fn, args, resolve, reject);
      if (this.resource > 0) {
        task(fn, args, resolve, reject);
      } else {
        this.quene.push(task);
      }
    });
  }

  consume(fn, args, resolve, reject) {
    return () => {
      this.resource--;
      fn(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.resource++;
          let task;
          if (task = this.quene.shift()) task();
        });
    };
  }
};
