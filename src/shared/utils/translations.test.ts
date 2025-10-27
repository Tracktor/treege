import { describe, expect, it } from "vitest";
import { getStaticTranslations, getTranslatedText } from "./translations";

describe("Translation Utilities", () => {
  describe("getTranslatedText", () => {
    it("should return empty string when text is undefined", () => {
      expect(getTranslatedText(undefined)).toBe("");
    });

    it("should return empty string when text is null", () => {
      expect(getTranslatedText(null as never)).toBe("");
    });

    it("should return the plain string when text is a string", () => {
      expect(getTranslatedText("Hello World")).toBe("Hello World");
    });

    it("should return English translation by default", () => {
      const text = {
        en: "Hello",
        fr: "Bonjour",
      };
      expect(getTranslatedText(text)).toBe("Hello");
    });

    it("should return specified language translation", () => {
      const text = {
        en: "Hello",
        es: "Hola",
        fr: "Bonjour",
      };
      expect(getTranslatedText(text, "fr")).toBe("Bonjour");
      expect(getTranslatedText(text, "es")).toBe("Hola");
    });

    it("should fallback to English when requested language is not available", () => {
      const text = {
        en: "Hello",
        fr: "Bonjour",
      };
      expect(getTranslatedText(text, "de")).toBe("Hello");
    });

    it("should fallback to first available language when neither requested nor English is available", () => {
      const text = {
        es: "Hola",
        fr: "Bonjour",
      };
      // Will return the first value found in the object
      expect(getTranslatedText(text, "de")).toBe("Hola");
    });

    it("should return empty string when object has no values", () => {
      const text = {};
      expect(getTranslatedText(text)).toBe("");
    });

    it("should handle falsy values in translation object", () => {
      const text = {
        en: "",
        fr: "Bonjour",
      };
      // When requesting "en", it gets empty string (falsy), so it falls back to first truthy value
      expect(getTranslatedText(text, "en")).toBe("Bonjour");
      // When requesting "de" (not available), it falls back to "en" which is empty, then to first truthy value
      expect(getTranslatedText(text, "de")).toBe("Bonjour");
    });

    it("should work with complex multi-language objects", () => {
      const text = {
        ar: "مرحبا",
        de: "Hallo",
        en: "Hello",
        es: "Hola",
        fr: "Bonjour",
        it: "Ciao",
        pt: "Olá",
      };
      expect(getTranslatedText(text, "ar")).toBe("مرحبا");
      expect(getTranslatedText(text, "de")).toBe("Hallo");
      expect(getTranslatedText(text, "it")).toBe("Ciao");
      expect(getTranslatedText(text, "pt")).toBe("Olá");
    });
  });

  describe("getStaticTranslations", () => {
    it("should return English translations by default", () => {
      const translations = getStaticTranslations("en");
      expect(translations).toBeDefined();
      expect(Object.keys(translations).length).toBeGreaterThan(0);
    });

    it("should return French translations", () => {
      const translations = getStaticTranslations("fr");
      expect(translations).toBeDefined();
      expect(Object.keys(translations).length).toBeGreaterThan(0);
    });

    it("should return Spanish translations", () => {
      const translations = getStaticTranslations("es");
      expect(translations).toBeDefined();
      expect(Object.keys(translations).length).toBeGreaterThan(0);
    });

    it("should return German translations", () => {
      const translations = getStaticTranslations("de");
      expect(translations).toBeDefined();
      expect(Object.keys(translations).length).toBeGreaterThan(0);
    });

    it("should return Italian translations", () => {
      const translations = getStaticTranslations("it");
      expect(translations).toBeDefined();
      expect(Object.keys(translations).length).toBeGreaterThan(0);
    });

    it("should return Portuguese translations", () => {
      const translations = getStaticTranslations("pt");
      expect(translations).toBeDefined();
      expect(Object.keys(translations).length).toBeGreaterThan(0);
    });

    it("should return Arabic translations", () => {
      const translations = getStaticTranslations("ar");
      expect(translations).toBeDefined();
      expect(Object.keys(translations).length).toBeGreaterThan(0);
    });

    it("should fallback to English for unsupported language", () => {
      const englishTranslations = getStaticTranslations("en");
      const unsupportedTranslations = getStaticTranslations("zh");
      expect(Object.keys(unsupportedTranslations).length).toBe(Object.keys(englishTranslations).length);
    });

    it("should flatten nested translation keys to dot notation", () => {
      const translations = getStaticTranslations("en");
      const keys = Object.keys(translations);

      // Check that there are dot-notated keys (flattened nested structure)
      const hasDotNotation = keys.some((key) => key.includes("."));
      expect(hasDotNotation).toBe(true);
    });

    it("should have consistent keys across all languages", () => {
      const languages = ["en", "fr", "es", "de", "it", "pt", "ar"];
      const englishKeys = Object.keys(getStaticTranslations("en"));

      languages.forEach((lang) => {
        const translations = getStaticTranslations(lang);
        const keys = Object.keys(translations);
        expect(keys.length).toBe(englishKeys.length);
      });
    });
  });
});
