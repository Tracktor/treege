// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
    t: (str: string) => str,
  }),
}));
