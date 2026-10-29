// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// React Router 7 needs TextEncoder, which jsdom in this Jest version lacks
Object.assign(global, { TextEncoder, TextDecoder });

// jsdom has no ResizeObserver; a no-op is enough for tests
if (!("ResizeObserver" in global)) {
  Object.assign(global, {
    ResizeObserver: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
}
