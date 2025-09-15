import "@testing-library/jest-dom";

Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};
