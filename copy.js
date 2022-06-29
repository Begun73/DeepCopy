const obj = {
  data: {
    hello: "hello",
    someData: {
      hello: "helloInside",
      func() {
        console.log(this);
      }
    }
  },
  some: {},
  fooSomeData() {
    console.log(this.data.hello);
  },
  fooData() {
    console.log("data");
  },
  arrayData: [1, 23, 4, [1]],
  number: 5
};

const deepCopy = (original) => {
  const isPrimitive = (value) =>
    (typeof value !== "object" && typeof value !== "function") ||
    value === null;

  const isConstructor = (value, isPrototype) =>
    !Object.keys(value).length && value.constructor && !isPrototype;

  const insideCopy = (value, { context, isPrototype }) => {
    if (isPrimitive()) {
      return value;
    }

    if (typeof value === "function") {
      const newFunc = value.bind(context);
      newFunc.prototype = insideCopy(value.prototype, {
        context,
        isPrototype: true
      });
      return newFunc;
    }

    if (isConstructor(value, isPrototype)) {
      return new value.constructor(value);
    }

    let acc = Array.isArray(value) ? [] : {};
    for (let val in value) {
      acc[val] = insideCopy(value[val], { context: value });
    }
    return acc;
  };
  return (() => insideCopy(original, { context: original }))();
};

