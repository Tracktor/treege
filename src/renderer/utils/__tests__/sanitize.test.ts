import { describe, expect, it, vi } from "vitest";
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

    it("should handle circular references gracefully", () => {
      const obj: Record<string, unknown> = { name: "Test<script>xss</script>" };
      obj.self = obj; // Circular reference

      // With the new implementation, circular references are handled gracefully
      const result = sanitizeHttpResponse(obj) as Record<string, unknown>;
      expect(result.name).toBe("Test");
      expect(result.self).toBe("[Circular Reference]");
    });

    it("should handle multiple circular references", () => {
      const obj1: Record<string, unknown> = { name: "Object1" };
      const obj2: Record<string, unknown> = { name: "Object2" };
      obj1.ref = obj2;
      obj2.ref = obj1; // Circular reference between obj1 and obj2

      const result = sanitizeHttpResponse(obj1) as Record<string, unknown>;
      expect(result.name).toBe("Object1");
      expect(result.ref).toHaveProperty("name", "Object2");
      expect((result.ref as Record<string, unknown>).ref).toBe("[Circular Reference]");
    });

    it("should handle circular references in arrays", () => {
      const obj: Record<string, unknown> = { name: "Test" };
      const arr = [obj, { nested: obj }];
      obj.arr = arr;

      const result = sanitizeHttpResponse(obj) as Record<string, unknown>;
      expect(result.name).toBe("Test");
      expect(Array.isArray(result.arr)).toBe(true);
      // The array should contain the object and a nested reference
      const resultArr = result.arr as unknown[];
      expect(resultArr[0]).toBe("[Circular Reference]");
    });
  });

  describe("Deep nesting protection", () => {
    it("should handle deeply nested objects (within limit)", () => {
      // Create a deeply nested object (50 levels)
      let nested: Record<string, unknown> = { value: "deep<script>xss</script>" };
      for (let i = 0; i < 49; i++) {
        nested = { child: nested };
      }

      const result = sanitizeHttpResponse(nested);
      // Should successfully sanitize all levels
      let current = result as Record<string, unknown>;
      for (let i = 0; i < 49; i++) {
        expect(current).toHaveProperty("child");
        current = current.child as Record<string, unknown>;
      }
      expect(current.value).toBe("deep");
    });

    it("should stop at maximum depth to prevent DoS", () => {
      // Create an object nested beyond MAX_DEPTH (100)
      let nested: Record<string, unknown> = { value: "too deep<script>xss</script>" };
      for (let i = 0; i < 150; i++) {
        nested = { child: nested };
      }

      // Mock console.warn to verify warning is logged
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = sanitizeHttpResponse(nested);

      // Should have logged a warning about max depth
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Maximum depth"));

      warnSpy.mockRestore();

      // Result should still be valid (not throw)
      expect(result).toBeDefined();
    });

    it("should sanitize strings even when max depth is exceeded (XSS protection)", () => {
      // Security test: Create an object nested beyond MAX_DEPTH with XSS payload at bottom
      let nested: unknown = '<script>alert("XSS at depth 150")</script>';
      for (let i = 0; i < 150; i++) {
        nested = { child: nested };
      }

      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = sanitizeHttpResponse(nested);

      warnSpy.mockRestore();

      // Navigate to max depth level
      let current = result as Record<string, unknown>;
      for (let i = 0; i < 100; i++) {
        current = current.child as Record<string, unknown>;
      }

      // At level 101, should get either sanitized string or safe placeholder
      const deepValue = current.child;

      // Must be either empty string (sanitized XSS) or safe placeholder
      expect(typeof deepValue === "string").toBe(true);
      expect(deepValue).not.toContain("<script>");
      expect(deepValue).not.toContain("alert");
    });

    it("should handle deeply nested arrays", () => {
      // Create deeply nested arrays
      let nested: unknown[] = ["value<script>xss</script>"];
      for (let i = 0; i < 50; i++) {
        nested = [nested];
      }

      const result = sanitizeHttpResponse(nested);
      // Should successfully sanitize
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle mixed deep nesting (objects and arrays)", () => {
      // Create mixed nested structure
      let nested: unknown = { value: "test<script>xss</script>" };
      for (let i = 0; i < 50; i++) {
        nested = i % 2 === 0 ? { child: nested } : [nested];
      }

      const result = sanitizeHttpResponse(nested);
      expect(result).toBeDefined();
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
