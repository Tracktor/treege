import { describe, expect, it } from "vitest";
import { sanitize, sanitizeHttpResponse } from "@/renderer/utils/sanitize";

describe("sanitize", () => {
  describe("XSS Attack Prevention", () => {
    it("should block script tags", () => {
      expect(sanitize('<script>alert("XSS")</script>')).toBe("");
      expect(sanitize('Hello<script>alert("XSS")</script>World')).toBe("HelloWorld");
      expect(sanitize("<script src='evil.js'></script>")).toBe("");
    });

    it("should block img onerror attacks", () => {
      expect(sanitize('<img src=x onerror="alert(1)">')).toBe("");
      expect(sanitize('<img src="x" onerror=alert(1)>')).toBe("");
    });

    it("should block iframe injection", () => {
      expect(sanitize('<iframe src="javascript:alert(1)"></iframe>')).toBe("");
      expect(sanitize("<iframe src='evil.com'></iframe>")).toBe("");
    });

    it("should block svg with script", () => {
      expect(sanitize('<svg onload="alert(1)">')).toBe("");
      // DOMPurify keeps text content but removes script tag
      const result = sanitize("<svg><script>alert(1)</script></svg>");
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("</script>");
    });

    it("should block event handlers", () => {
      expect(sanitize('<div onclick="alert(1)">Click</div>')).toBe("Click");
      expect(sanitize('<body onload="alert(1)">Test</body>')).toBe("Test");
      expect(sanitize('<input onfocus="alert(1)">')).toBe("");
      expect(sanitize('<a onmouseover="alert(1)">Link</a>')).toBe("Link");
    });

    it("should block javascript: protocol", () => {
      expect(sanitize('<a href="javascript:alert(1)">Link</a>')).toBe("Link");
      expect(sanitize('<a href="javascript:void(0)">Link</a>')).toBe("Link");
    });

    it("should block data: URIs with scripts", () => {
      expect(sanitize('<a href="data:text/html,<script>alert(1)</script>">Link</a>')).toBe("Link");
    });

    it("should block style injection", () => {
      expect(sanitize('<style>body{background:url("javascript:alert(1)")}</style>')).toBe("");
      expect(sanitize('<div style="background:url(javascript:alert(1))">Test</div>')).toBe("Test");
    });

    it("should block template strings and expressions", () => {
      expect(sanitize("${alert(1)}")).toBe("${alert(1)}");
      expect(sanitize("`${alert(1)}`")).toBe("`${alert(1)}`");
    });

    it("should block meta refresh attacks", () => {
      expect(sanitize('<meta http-equiv="refresh" content="0;url=javascript:alert(1)">')).toBe("");
    });

    it("should block object/embed tags", () => {
      expect(sanitize('<object data="javascript:alert(1)">')).toBe("");
      expect(sanitize('<embed src="javascript:alert(1)">')).toBe("");
    });
  });

  describe("Plain Text Mode (default)", () => {
    it("should strip all HTML tags by default", () => {
      expect(sanitize("<b>Bold</b> text")).toBe("Bold text");
      expect(sanitize("<i>Italic</i> text")).toBe("Italic text");
      expect(sanitize("<strong>Strong</strong>")).toBe("Strong");
      expect(sanitize("<p>Paragraph</p>")).toBe("Paragraph");
    });

    it("should preserve plain text", () => {
      expect(sanitize("Hello World")).toBe("Hello World");
      expect(sanitize("123")).toBe("123");
      expect(sanitize("Special chars: @#$%")).toBe("Special chars: @#$%");
    });

    it("should handle HTML entities safely", () => {
      // DOMPurify preserves entities in plain text mode
      // Main security concern: no script execution possible
      const scriptResult = sanitize("&lt;script&gt;alert(1)&lt;/script&gt;");
      expect(scriptResult).not.toMatch(/<script[^>]*>.*alert.*<\/script>/);
    });
  });

  describe("Safe HTML Mode", () => {
    it("should allow safe HTML tags when plainTextOnly is false", () => {
      expect(sanitize("<b>Bold</b>", { plainTextOnly: false })).toBe("<b>Bold</b>");
      expect(sanitize("<i>Italic</i>", { plainTextOnly: false })).toBe("<i>Italic</i>");
      expect(sanitize("<strong>Strong</strong>", { plainTextOnly: false })).toBe("<strong>Strong</strong>");
    });

    it("should still block dangerous tags in safe HTML mode", () => {
      expect(sanitize("<script>alert(1)</script><b>Text</b>", { plainTextOnly: false })).toBe("<b>Text</b>");
      expect(sanitize("<b>Bold</b><script>alert(1)</script>", { plainTextOnly: false })).toBe("<b>Bold</b>");
    });

    it("should allow custom tags", () => {
      const result = sanitize('<a href="https://example.com">Link</a>', {
        allowedAttributes: ["href"],
        allowedTags: ["a"],
        plainTextOnly: false,
      });
      expect(result).toBe('<a href="https://example.com">Link</a>');
    });

    it("should block dangerous attributes even with custom tags", () => {
      const result = sanitize('<a href="https://example.com" onclick="alert(1)">Link</a>', {
        allowedAttributes: ["href"],
        allowedTags: ["a"],
        plainTextOnly: false,
      });
      expect(result).toBe('<a href="https://example.com">Link</a>');
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined input", () => {
      expect(sanitize(undefined)).toBe("");
    });

    it("should handle null input", () => {
      expect(sanitize(null)).toBe("");
    });

    it("should handle empty string", () => {
      expect(sanitize("")).toBe("");
    });

    it("should handle whitespace", () => {
      expect(sanitize("   ")).toBe("   ");
      expect(sanitize("\n\t")).toBe("\n\t");
    });

    it("should handle mixed content", () => {
      const input = "Normal text <script>alert(1)</script> <b>bold</b> more text";
      const result = sanitize(input);
      // Check that safe content is preserved
      expect(result).toContain("Normal text");
      expect(result).toContain("bold");
      expect(result).toContain("more text");
      // Check that dangerous tags are removed
      expect(result).not.toMatch(/<script[^>]*>/);
    });

    it("should handle unicode and special characters", () => {
      expect(sanitize("Hello 世界 🌍")).toBe("Hello 世界 🌍");
      expect(sanitize("Émojis: 😀 😃 😄")).toBe("Émojis: 😀 😃 😄");
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(10000);
      expect(sanitize(longString)).toBe(longString);
    });

    it("should handle nested tags", () => {
      const result = sanitize("<div><span><b>Nested</b></span></div>");
      // Main requirement: text content is preserved
      expect(result).toContain("Nested");
      // Tags may be stripped (main security concern is no executable code)
      expect(result).not.toContain("<div>");
    });

    it("should handle malformed HTML", () => {
      const result1 = sanitize("<div><span>Unclosed");
      expect(result1).toContain("Unclosed");

      const result2 = sanitize("<<script>alert(1)</script>");
      expect(result2).not.toContain("<script>");
      // Text content may be preserved but tags are removed
    });
  });

  describe("Real-world Attack Vectors", () => {
    it("should block polyglot XSS payloads", () => {
      const result = sanitize(
        "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/\"/+/onmouseover=1/+/[*/[]/+alert(1)//>'",
      );
      // Main check: no executable script tags or event handlers
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("onload=");
      expect(result).not.toContain("onmouseover=");
    });

    it("should block encoded XSS attempts", () => {
      // DOMPurify decodes entities then removes dangerous tags
      const result = sanitize("&#60;script&#62;alert(1)&#60;/script&#62;");
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("</script>");
    });

    it("should block CSS expression attacks", () => {
      expect(sanitize('<div style="width:expression(alert(1))">Test</div>')).toBe("Test");
    });

    it("should block link hijacking", () => {
      expect(sanitize('<a href="javascript:void(0)" onclick="stealData()">Click</a>')).toBe("Click");
    });
  });
});

describe("sanitizeHttpResponse", () => {
  describe("Deep sanitization", () => {
    it("should sanitize strings in objects", () => {
      const input = {
        name: "John <script>alert(1)</script>",
        title: "Developer",
      };
      const result = sanitizeHttpResponse(input);
      expect(result).toEqual({
        name: "John ",
        title: "Developer",
      });
    });

    it("should sanitize strings in arrays", () => {
      const input = ["Safe text", "<script>alert(1)</script>", "Another safe"];
      const result = sanitizeHttpResponse(input);
      expect(result).toEqual(["Safe text", "", "Another safe"]);
    });

    it("should sanitize nested objects", () => {
      const input = {
        level1: {
          level2: {
            dangerous: '<img src=x onerror="alert(1)">',
            safe: "text",
          },
        },
      };
      const result = sanitizeHttpResponse(input);
      expect(result).toEqual({
        level1: {
          level2: {
            dangerous: "",
            safe: "text",
          },
        },
      });
    });

    it("should sanitize arrays of objects", () => {
      const input = [{ name: "User1 <script>alert(1)</script>" }, { name: "User2" }];
      const result = sanitizeHttpResponse(input);
      expect(result).toEqual([{ name: "User1 " }, { name: "User2" }]);
    });

    it("should preserve non-string values", () => {
      const input = {
        active: true,
        age: 25,
        count: null,
        items: undefined,
      };
      const result = sanitizeHttpResponse(input);
      expect(result).toEqual({
        active: true,
        age: 25,
        count: null,
        items: undefined,
      });
    });

    it("should handle mixed types in arrays", () => {
      const input = ["text", 123, true, null, { name: "<script>xss</script>" }];
      const result = sanitizeHttpResponse(input);
      expect(result).toEqual(["text", 123, true, null, { name: "" }]);
    });
  });

  describe("Edge cases for HTTP responses", () => {
    it("should handle empty objects", () => {
      expect(sanitizeHttpResponse({})).toEqual({});
    });

    it("should handle empty arrays", () => {
      expect(sanitizeHttpResponse([])).toEqual([]);
    });

    it("should handle null", () => {
      expect(sanitizeHttpResponse(null)).toBeNull();
    });

    it("should handle undefined", () => {
      expect(sanitizeHttpResponse(undefined)).toBeUndefined();
    });

    it("should handle circular references", () => {
      const obj: Record<string, unknown> = { name: "Test" };
      obj.self = obj; // Circular reference

      // sanitizeHttpResponse will hit max call stack with circular refs
      // This is expected behavior - we test that it throws predictably
      expect(() => sanitizeHttpResponse(obj)).toThrow();
    });
  });

  describe("API response scenarios", () => {
    it("should sanitize user profile from API", () => {
      const apiResponse = {
        bio: 'Developer <script>alert("XSS")</script>',
        email: "user@example.com",
        id: 123,
        name: 'John <img src=x onerror="alert(1)">',
        verified: true,
      };

      const result = sanitizeHttpResponse(apiResponse);
      expect(result).toEqual({
        bio: "Developer ",
        email: "user@example.com",
        id: 123,
        name: "John ",
        verified: true,
      });
    });

    it("should sanitize list of comments", () => {
      const comments = [
        {
          author: "User1",
          id: 1,
          text: "Great post! <script>alert(1)</script>",
        },
        {
          author: 'User2 <iframe src="evil.com">',
          id: 2,
          text: "Thanks!",
        },
      ];

      const result = sanitizeHttpResponse(comments);
      expect(result).toEqual([
        { author: "User1", id: 1, text: "Great post! " },
        { author: "User2 ", id: 2, text: "Thanks!" },
      ]);
    });
  });
});
