import { describe, expect, it } from "vitest";
import type { HttpConfig, HttpHeader, InputNodeData } from "@/shared/types/node";

describe("HTTP Configuration System", () => {
  describe("HttpHeader Structure", () => {
    it("should validate HTTP header structure", () => {
      const header: HttpHeader = {
        key: "Authorization",
        value: "Bearer token123",
      };

      expect(header.key).toBe("Authorization");
      expect(header.value).toBe("Bearer token123");
    });

    it("should support common HTTP headers", () => {
      const headers: HttpHeader[] = [
        { key: "Content-Type", value: "application/json" },
        { key: "Authorization", value: "Bearer token" },
        { key: "Accept", value: "application/json" },
        { key: "User-Agent", value: "TreegeApp/1.0" },
      ];

      expect(headers.length).toBe(4);
      expect(headers.every((h) => h.key && h.value)).toBe(true);
    });

    it("should allow custom headers", () => {
      const header: HttpHeader = {
        key: "X-Custom-Header",
        value: "custom-value",
      };

      expect(header.key).toContain("X-");
    });
  });

  describe("HttpConfig Structure", () => {
    it("should validate basic GET request config", () => {
      const config: HttpConfig = {
        method: "GET",
        url: "https://api.example.com/users",
      };

      expect(config.method).toBe("GET");
      expect(config.url).toBeDefined();
    });

    it("should validate POST request with body", () => {
      const config: HttpConfig = {
        body: JSON.stringify({ email: "john@example.com", name: "John" }),
        headers: [{ key: "Content-Type", value: "application/json" }],
        method: "POST",
        url: "https://api.example.com/users",
      };

      expect(config.method).toBe("POST");
      expect(config.body).toBeDefined();
      expect(config.headers?.length).toBe(1);
    });

    it("should support all HTTP methods", () => {
      const methods: Array<"GET" | "POST" | "PUT" | "DELETE" | "PATCH"> = ["GET", "POST", "PUT", "DELETE", "PATCH"];

      methods.forEach((method) => {
        const config: HttpConfig = {
          method,
          url: "https://api.example.com/resource",
        };

        expect(config.method).toBe(method);
      });
    });

    it("should validate config with custom headers", () => {
      const config: HttpConfig = {
        headers: [
          { key: "Authorization", value: "Bearer token123" },
          { key: "Accept-Language", value: "en-US" },
        ],
        method: "GET",
        url: "https://api.example.com/data",
      };

      expect(config.headers?.length).toBe(2);
      expect(config.headers?.[0].key).toBe("Authorization");
    });
  });

  describe("Response Path", () => {
    it("should validate simple response path", () => {
      const config: HttpConfig = {
        method: "GET",
        responsePath: "data",
        url: "https://api.example.com/users",
      };

      expect(config.responsePath).toBe("data");
    });

    it("should validate nested response path", () => {
      const config: HttpConfig = {
        method: "GET",
        responsePath: "data.users",
        url: "https://api.example.com/users",
      };

      expect(config.responsePath).toBe("data.users");
    });

    it("should validate array index in response path", () => {
      const config: HttpConfig = {
        method: "GET",
        responsePath: "results[0].name",
        url: "https://api.example.com/search",
      };

      expect(config.responsePath).toContain("[0]");
    });

    it("should validate deeply nested response path", () => {
      const config: HttpConfig = {
        method: "GET",
        responsePath: "data.pagination.items[0].user.profile.name",
        url: "https://api.example.com/complex",
      };

      expect(config.responsePath).toContain("data.pagination");
    });
  });

  describe("Response Mapping", () => {
    it("should validate response mapping for select options", () => {
      const config: HttpConfig = {
        method: "GET",
        responseMapping: {
          labelField: "name",
          valueField: "id",
        },
        responsePath: "data.users",
        url: "https://api.example.com/users",
      };

      expect(config.responseMapping).toBeDefined();
      expect(config.responseMapping?.valueField).toBe("id");
      expect(config.responseMapping?.labelField).toBe("name");
    });

    it("should validate response mapping with nested fields", () => {
      const config: HttpConfig = {
        method: "GET",
        responseMapping: {
          labelField: "profile.fullName",
          valueField: "userId",
        },
        responsePath: "data",
        url: "https://api.example.com/users",
      };

      expect(config.responseMapping?.labelField).toContain("profile.");
    });

    it("should allow response mapping without both fields", () => {
      const config: HttpConfig = {
        method: "GET",
        responseMapping: {
          valueField: "id",
        },
        url: "https://api.example.com/data",
      };

      expect(config.responseMapping?.valueField).toBe("id");
      expect(config.responseMapping?.labelField).toBeUndefined();
    });
  });

  describe("Search Parameter", () => {
    it("should validate search parameter for combobox", () => {
      const config: HttpConfig = {
        method: "GET",
        searchParam: "q",
        url: "https://api.example.com/search",
      };

      expect(config.searchParam).toBe("q");
    });

    it("should support various search parameter names", () => {
      const searchParams = ["q", "query", "search", "filter", "term"];

      searchParams.forEach((param) => {
        const config: HttpConfig = {
          method: "GET",
          searchParam: param,
          url: "https://api.example.com/search",
        };

        expect(config.searchParam).toBe(param);
      });
    });
  });

  describe("Fetch Behavior Options", () => {
    it("should validate fetchOnMount option", () => {
      const config: HttpConfig = {
        fetchOnMount: true,
        method: "GET",
        url: "https://api.example.com/initial-data",
      };

      expect(config.fetchOnMount).toBe(true);
    });

    it("should validate showLoading option", () => {
      const config: HttpConfig = {
        method: "GET",
        showLoading: true,
        url: "https://api.example.com/data",
      };

      expect(config.showLoading).toBe(true);
    });

    it("should validate combined fetch options", () => {
      const config: HttpConfig = {
        fetchOnMount: true,
        method: "GET",
        showLoading: true,
        url: "https://api.example.com/data",
      };

      expect(config.fetchOnMount).toBe(true);
      expect(config.showLoading).toBe(true);
    });
  });

  describe("Template Variables in URL", () => {
    it("should support template variables in URL", () => {
      const config: HttpConfig = {
        method: "GET",
        url: "https://api.example.com/users/{{userId}}/posts",
      };

      expect(config.url).toContain("{{userId}}");
    });

    it("should support multiple template variables", () => {
      const config: HttpConfig = {
        method: "GET",
        url: "https://api.example.com/{{resource}}/{{id}}/{{action}}",
      };

      const matches = config.url?.match(/\{\{[^}]+\}\}/g);
      expect(matches?.length).toBe(3);
    });

    it("should support template variables in headers", () => {
      const config: HttpConfig = {
        headers: [{ key: "Authorization", value: "Bearer {{token}}" }],
        method: "GET",
        url: "https://api.example.com/data",
      };

      expect(config.headers?.[0].value).toContain("{{token}}");
    });

    it("should support template variables in body", () => {
      const config: HttpConfig = {
        body: '{"userId": "{{userId}}", "action": "{{action}}"}',
        method: "POST",
        url: "https://api.example.com/actions",
      };

      expect(config.body).toContain("{{userId}}");
      expect(config.body).toContain("{{action}}");
    });
  });

  describe("HTTP Input Node Integration", () => {
    it("should validate select input with HTTP config", () => {
      const inputData: InputNodeData = {
        httpConfig: {
          method: "GET",
          responseMapping: {
            labelField: "name",
            valueField: "id",
          },
          responsePath: "data",
          url: "https://api.example.com/countries",
        },
        label: { en: "Country" },
        name: "country",
        type: "select",
      };

      expect(inputData.httpConfig).toBeDefined();
      expect(inputData.type).toBe("select");
      expect(inputData.httpConfig?.responseMapping).toBeDefined();
    });

    it("should validate combobox with HTTP search", () => {
      const inputData: InputNodeData = {
        httpConfig: {
          method: "GET",
          responseMapping: {
            labelField: "name",
            valueField: "id",
          },
          responsePath: "results",
          searchParam: "q",
          url: "https://api.example.com/cities",
        },
        label: { en: "City" },
        name: "city",
        placeholder: { en: "Search city..." },
        type: "autocomplete",
      };

      expect(inputData.httpConfig?.searchParam).toBe("q");
      expect(inputData.type).toBe("autocomplete");
    });

    it("should validate HTTP config with dynamic field references", () => {
      const inputData: InputNodeData = {
        httpConfig: {
          fetchOnMount: false,
          method: "GET",
          responseMapping: {
            labelField: "name",
            valueField: "id",
          },
          url: "https://api.example.com/regions/{{country}}/cities",
        },
        label: { en: "City" },
        name: "city",
        type: "select",
      };

      expect(inputData.httpConfig?.url).toContain("{{country}}");
      expect(inputData.httpConfig?.fetchOnMount).toBe(false);
    });

    it("should validate POST request in HTTP config", () => {
      const inputData: InputNodeData = {
        httpConfig: {
          body: '{"search": "{{searchTerm}}"}',
          headers: [{ key: "Content-Type", value: "application/json" }],
          method: "POST",
          responseMapping: {
            labelField: "title",
            valueField: "id",
          },
          responsePath: "results",
          url: "https://api.example.com/search",
        },
        label: { en: "Search Results" },
        name: "searchResults",
        type: "select",
      };

      expect(inputData.httpConfig?.method).toBe("POST");
      expect(inputData.httpConfig?.body).toBeDefined();
    });
  });

  describe("Complex HTTP Scenarios", () => {
    it("should validate authenticated API request", () => {
      const config: HttpConfig = {
        headers: [
          { key: "Authorization", value: "Bearer {{authToken}}" },
          { key: "Content-Type", value: "application/json" },
        ],
        method: "GET",
        responseMapping: {
          labelField: "displayName",
          valueField: "userId",
        },
        responsePath: "data.users",
        showLoading: true,
        url: "https://api.example.com/users",
      };

      expect(config.headers?.length).toBe(2);
      expect(config.headers?.some((h) => h.key === "Authorization")).toBe(true);
    });

    it("should validate paginated API request", () => {
      const config: HttpConfig = {
        method: "GET",
        responsePath: "data.items",
        url: "https://api.example.com/data?page={{page}}&limit={{limit}}",
      };

      expect(config.url).toContain("page={{page}}");
      expect(config.url).toContain("limit={{limit}}");
    });

    it("should validate API with custom response structure", () => {
      const config: HttpConfig = {
        method: "GET",
        responseMapping: {
          labelField: "attributes.name",
          valueField: "id",
        },
        responsePath: "included[0].relationships.items.data",
        url: "https://api.example.com/complex",
      };

      expect(config.responsePath).toContain("included[0]");
      expect(config.responseMapping?.labelField).toContain("attributes.");
    });
  });

  describe("Error Handling Scenarios", () => {
    it("should handle missing URL gracefully", () => {
      const config: HttpConfig = {
        method: "GET",
      };

      expect(config.url).toBeUndefined();
      expect(config.method).toBe("GET");
    });

    it("should handle config without response mapping", () => {
      const config: HttpConfig = {
        method: "GET",
        url: "https://api.example.com/data",
      };

      expect(config.responseMapping).toBeUndefined();
    });

    it("should handle empty headers array", () => {
      const config: HttpConfig = {
        headers: [],
        method: "GET",
        url: "https://api.example.com/data",
      };

      expect(config.headers?.length).toBe(0);
    });
  });
});
