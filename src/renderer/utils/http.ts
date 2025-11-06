import { FormValues } from "@/renderer/types/renderer";
import { HttpHeader } from "@/shared/types/node";

/**
 * Result of an HTTP request
 */
export interface HttpRequestResult {
  /**
   * Whether the request was successful (2xx status code)
   */
  success: boolean;
  /**
   * Response data (parsed JSON or raw text)
   */
  data?: unknown;
  /**
   * Error message if request failed
   */
  error?: string;
  /**
   * HTTP status code
   */
  status?: number;
  /**
   * HTTP status text
   */
  statusText?: string;
}

/**
 * Options for making an HTTP request
 */
export interface HttpRequestOptions {
  /**
   * The URL to call (should already have variables replaced)
   */
  url: string;
  /**
   * HTTP method
   */
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /**
   * Request headers
   */
  headers?: HttpHeader[];
  /**
   * Request body (for POST/PUT/PATCH)
   */
  body?: string;
}

/**
 * Make an HTTP request with common error handling and response parsing
 *
 * This is a shared utility used by both HTTP inputs and submit buttons
 * to ensure consistent behavior across the library.
 *
 * @param options - Request options
 * @returns Promise with request result
 */
export const makeHttpRequest = async (options: HttpRequestOptions): Promise<HttpRequestResult> => {
  try {
    const { url, method = "GET", headers: customHeaders = [], body } = options;

    // Validate URL
    if (!url || url.trim() === "") {
      return {
        error: "No URL provided",
        success: false,
      };
    }

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add custom headers
    customHeaders.forEach((header) => {
      if (header.key && header.value) {
        headers[header.key] = header.value;
      }
    });

    // Prepare request options
    const requestOptions: RequestInit = {
      headers,
      method,
    };

    // Add body for methods that support it
    if (body && method && ["POST", "PUT", "PATCH"].includes(method)) {
      requestOptions.body = body;
    }

    // Make the HTTP request
    const response = await fetch(url, requestOptions);

    // Parse response
    let responseData: unknown;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Check if request was successful
    if (!response.ok) {
      return {
        data: responseData,
        error: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        statusText: response.statusText,
        success: false,
      };
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      success: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
  }
};

/**
 * Replace template variables in a string with actual values from form data
 *
 * Supports two formats:
 * - {{fieldId}} - for URLs (with optional URL encoding)
 * - ${fieldId} or ${fieldName} - for request bodies (with JSON escaping)
 *
 * @param template - The template string containing variables
 * @param values - Form values to substitute
 * @param encode - Whether to URL-encode the replaced values (for URLs)
 * @returns The string with variables replaced
 */
export const replaceTemplateVariables = (template: string | undefined, values: FormValues, encode = false): string => {
  if (!template) {
    return "";
  }

  // Replace {{fieldId}} format (for URLs)
  const withCurlyBraces = template.replace(/\{\{([\w-]+)}}/g, (_, fieldId) => {
    const value = values[fieldId.trim()];
    const stringValue = value !== undefined && value !== null ? String(value) : "";
    return encode ? encodeURIComponent(stringValue) : stringValue;
  });

  // Replace ${fieldId} format (for request bodies)
  return withCurlyBraces.replace(/\$\{([\w-]+)}/g, (_, fieldId) => {
    const value = values[fieldId.trim()];
    if (value === undefined || value === null) {
      return "";
    }
    // If the value is a string, wrap it in quotes for JSON and escape quotes
    if (typeof value === "string") {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    // For numbers, booleans, etc., convert to string
    return String(value);
  });
};

/**
 * Replace template variables in response data (for redirect URLs)
 *
 * Supports {{response.field}} format to access response data
 *
 * @param template - The template string containing variables
 * @param responseData - Response data object
 * @returns The string with variables replaced
 */
export const replaceResponseVariables = (template: string | undefined, responseData: unknown): string => {
  if (!template) {
    return "";
  }

  // Replace {{response.field}} format
  return template.replace(/\{\{response\.([\w.-]+)}}/g, (_, path) => {
    const value = getNestedValue(responseData, path.trim());
    return value !== undefined && value !== null ? String(value) : "";
  });
};

/**
 * Get nested value from an object using dot notation
 *
 * @param obj - The object to extract value from
 * @param path - The path in dot notation (e.g., "user.profile.name")
 * @returns The value at the path, or undefined if not found
 */
const getNestedValue = (obj: unknown, path: string): unknown => {
  if (!obj || typeof obj !== "object") {
    return undefined;
  }

  const parts = path.split(".");
  let current: any = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
};
