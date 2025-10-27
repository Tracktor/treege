import { describe, expect, it } from "vitest";
import type { Flow, InputNodeData, InputOption } from "@/shared/types/node";

describe("Input Node Validation", () => {
  describe("Basic Input Fields", () => {
    it("should validate text input", () => {
      const inputData: InputNodeData = {
        label: { en: "Full Name" },
        name: "fullName",
        required: true,
        type: "text",
      };

      expect(inputData.type).toBe("text");
      expect(inputData.name).toBe("fullName");
      expect(inputData.required).toBe(true);
    });

    it("should validate text input with email pattern", () => {
      const inputData: InputNodeData = {
        errorMessage: { en: "Please enter a valid email" },
        label: { en: "Email" },
        name: "email",
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        placeholder: { en: "you@example.com" },
        required: true,
        type: "text",
      };

      expect(inputData.type).toBe("text");
      expect(inputData.pattern).toBeDefined();
      expect(inputData.errorMessage).toBeDefined();
    });

    it("should validate number input", () => {
      const inputData: InputNodeData = {
        helperText: { en: "Must be between 18 and 120" },
        label: { en: "Age" },
        name: "age",
        required: true,
        type: "number",
      };

      expect(inputData.type).toBe("number");
      expect(inputData.helperText).toBeDefined();
    });

    it("should validate textarea input", () => {
      const inputData: InputNodeData = {
        label: { en: "Description" },
        name: "description",
        placeholder: { en: "Enter description..." },
        type: "textarea",
      };

      expect(inputData.type).toBe("textarea");
      expect(inputData.required).toBeFalsy();
    });

    it("should validate date input", () => {
      const inputData: InputNodeData = {
        label: { en: "Birth Date" },
        name: "birthDate",
        required: true,
        type: "date",
      };

      expect(inputData.type).toBe("date");
    });

    it("should validate time input", () => {
      const inputData: InputNodeData = {
        label: { en: "Appointment Time" },
        name: "appointmentTime",
        type: "time",
      };

      expect(inputData.type).toBe("time");
    });

    it("should validate text input with URL pattern", () => {
      const inputData: InputNodeData = {
        errorMessage: { en: "Please enter a valid URL" },
        label: { en: "Website" },
        name: "website",
        pattern: "^https?://.*",
        type: "text",
      };

      expect(inputData.type).toBe("text");
      expect(inputData.pattern).toBeDefined();
    });

    it("should validate text input with phone pattern", () => {
      const inputData: InputNodeData = {
        label: { en: "Phone Number" },
        name: "phone",
        pattern: "^\\+?[0-9\\s\\-()]+$",
        type: "text",
      };

      expect(inputData.type).toBe("text");
      expect(inputData.pattern).toBeDefined();
    });
  });

  describe("Selection Inputs", () => {
    it("should validate select input with options", () => {
      const inputData: InputNodeData = {
        label: { en: "Country" },
        name: "country",
        options: [
          { label: { en: "France" }, value: "FR" },
          { label: { en: "United States" }, value: "US" },
          { label: { en: "Germany" }, value: "DE" },
        ],
        required: true,
        type: "select",
      };

      expect(inputData.type).toBe("select");
      expect(inputData.options).toBeDefined();
      expect(inputData.options?.length).toBe(3);
    });

    it("should validate radio input with options", () => {
      const inputData: InputNodeData = {
        label: { en: "Gender" },
        name: "gender",
        options: [
          { label: { en: "Male" }, value: "male" },
          { label: { en: "Female" }, value: "female" },
          { label: { en: "Other" }, value: "other" },
        ],
        required: true,
        type: "radio",
      };

      expect(inputData.type).toBe("radio");
      expect(inputData.options).toBeDefined();
      expect(inputData.options?.every((opt) => opt.value && opt.label)).toBe(true);
    });

    it("should validate checkbox input with multiple selection", () => {
      const inputData: InputNodeData = {
        label: { en: "Interests" },
        multiple: true,
        name: "interests",
        options: [
          { label: { en: "Sports" }, value: "sports" },
          { label: { en: "Music" }, value: "music" },
          { label: { en: "Reading" }, value: "reading" },
        ],
        type: "checkbox",
      };

      expect(inputData.type).toBe("checkbox");
      expect(inputData.multiple).toBe(true);
      expect(inputData.options?.length).toBeGreaterThan(0);
    });

    it("should validate autocomplete input with searchable options", () => {
      const inputData: InputNodeData = {
        label: { en: "City" },
        name: "city",
        options: [
          { label: { en: "Paris" }, value: "paris" },
          { label: { en: "London" }, value: "london" },
          { label: { en: "Berlin" }, value: "berlin" },
        ],
        placeholder: { en: "Search city..." },
        type: "autocomplete",
      };

      expect(inputData.type).toBe("autocomplete");
      expect(inputData.placeholder).toBeDefined();
    });
  });

  describe("Option Validation", () => {
    it("should validate option with label and value", () => {
      const option: InputOption = {
        label: { en: "Option 1" },
        value: "opt1",
      };

      expect(option.label).toBeDefined();
      expect(option.value).toBeDefined();
    });

    it("should validate option with disabled state", () => {
      const option: InputOption = {
        disabled: true,
        label: { en: "Disabled Option" },
        value: "disabled",
      };

      expect(option.disabled).toBe(true);
    });

    it("should validate multi-language option labels", () => {
      const option: InputOption = {
        label: {
          ar: "خيار",
          de: "Option",
          en: "Option",
          es: "Opción",
          fr: "Option",
        },
        value: "option1",
      };

      expect(typeof option.label).toBe("object");
      expect(option.label.en).toBe("Option");
      expect(option.label.fr).toBe("Option");
    });
  });

  describe("Pattern Validation", () => {
    it("should validate email pattern", () => {
      const pattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
      const regex = new RegExp(pattern);

      expect(regex.test("user@example.com")).toBe(true);
      expect(regex.test("invalid.email")).toBe(false);
      expect(regex.test("@example.com")).toBe(false);
    });

    it("should validate phone pattern", () => {
      const pattern = "^\\+?[0-9\\s\\-()]+$";
      const regex = new RegExp(pattern);

      expect(regex.test("+33 1 23 45 67 89")).toBe(true);
      expect(regex.test("(123) 456-7890")).toBe(true);
      expect(regex.test("abc123")).toBe(false);
    });

    it("should validate URL pattern", () => {
      const pattern = "^https?://.*";
      const regex = new RegExp(pattern);

      expect(regex.test("https://example.com")).toBe(true);
      expect(regex.test("http://example.com")).toBe(true);
      expect(regex.test("example.com")).toBe(false);
    });

    it("should validate custom alphanumeric pattern", () => {
      const pattern = "^[a-zA-Z0-9]+$";
      const regex = new RegExp(pattern);

      expect(regex.test("abc123")).toBe(true);
      expect(regex.test("ABC")).toBe(true);
      expect(regex.test("abc-123")).toBe(false);
      expect(regex.test("abc 123")).toBe(false);
    });

    it("should validate postal code patterns", () => {
      // French postal code
      const frPattern = "^[0-9]{5}$";
      const frRegex = new RegExp(frPattern);
      expect(frRegex.test("75001")).toBe(true);
      expect(frRegex.test("7500")).toBe(false);

      // US ZIP code
      const usPattern = "^[0-9]{5}(-[0-9]{4})?$";
      const usRegex = new RegExp(usPattern);
      expect(usRegex.test("12345")).toBe(true);
      expect(usRegex.test("12345-6789")).toBe(true);
      expect(usRegex.test("1234")).toBe(false);
    });
  });

  describe("Required Field Validation", () => {
    it("should mark field as required", () => {
      const inputData: InputNodeData = {
        label: { en: "Required Field" },
        name: "required",
        required: true,
        type: "text",
      };

      expect(inputData.required).toBe(true);
    });

    it("should allow optional field", () => {
      const inputData: InputNodeData = {
        label: { en: "Optional Field" },
        name: "optional",
        type: "text",
      };

      expect(inputData.required).toBeFalsy();
    });
  });

  describe("Helper Text and Placeholders", () => {
    it("should support helper text", () => {
      const inputData: InputNodeData = {
        helperText: { en: "Enter your full legal name" },
        label: { en: "Name" },
        name: "name",
        type: "text",
      };

      expect(inputData.helperText).toBeDefined();
      expect(typeof inputData.helperText).toBe("object");
    });

    it("should support placeholders", () => {
      const inputData: InputNodeData = {
        label: { en: "Email" },
        name: "email",
        placeholder: { en: "you@example.com" },
        type: "text",
      };

      expect(inputData.placeholder).toBeDefined();
    });

    it("should support multi-language helper text", () => {
      const inputData: InputNodeData = {
        helperText: {
          en: "We'll never share your email",
          fr: "Nous ne partagerons jamais votre email",
        },
        label: { en: "Email" },
        name: "email",
        type: "text",
      };

      expect(inputData.helperText?.en).toBeDefined();
      expect(inputData.helperText?.fr).toBeDefined();
    });
  });

  describe("Error Messages", () => {
    it("should support custom error messages", () => {
      const inputData: InputNodeData = {
        errorMessage: { en: "Please enter a valid email address" },
        label: { en: "Email" },
        name: "email",
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        type: "text",
      };

      expect(inputData.errorMessage).toBeDefined();
    });

    it("should support multi-language error messages", () => {
      const inputData: InputNodeData = {
        errorMessage: {
          en: "This field is required",
          es: "Este campo es obligatorio",
          fr: "Ce champ est obligatoire",
        },
        label: { en: "Field" },
        name: "field",
        required: true,
        type: "text",
      };

      expect(inputData.errorMessage?.en).toBe("This field is required");
      expect(inputData.errorMessage?.fr).toBe("Ce champ est obligatoire");
      expect(inputData.errorMessage?.es).toBe("Este campo es obligatorio");
    });
  });

  describe("Complete Input Node in Flow", () => {
    it("should validate complete input node structure", () => {
      const flow: Flow = {
        edges: [],
        id: "input-flow",
        nodes: [
          {
            data: {
              errorMessage: { en: "Invalid email format" },
              helperText: { en: "We'll use this to contact you" },
              label: { en: "Email Address" },
              name: "email",
              pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
              placeholder: { en: "your.email@example.com" },
              required: true,
              type: "text",
            },
            id: "email-input",
            position: { x: 0, y: 0 },
            type: "input",
          },
        ],
      };

      const inputNode = flow.nodes[0];
      expect(inputNode.type).toBe("input");
      expect(inputNode.data).toHaveProperty("name");
      expect(inputNode.data).toHaveProperty("type");
      expect(inputNode.data).toHaveProperty("label");
      expect(inputNode.data).toHaveProperty("placeholder");
      expect(inputNode.data).toHaveProperty("helperText");
      expect(inputNode.data).toHaveProperty("errorMessage");
      expect(inputNode.data).toHaveProperty("pattern");
      expect(inputNode.data).toHaveProperty("required");
    });

    it("should validate multi-step form with various input types", () => {
      const flow: Flow = {
        edges: [
          { id: "e1-2", source: "name-input", target: "email-input" },
          { id: "e2-3", source: "email-input", target: "country-input" },
          { id: "e3-4", source: "country-input", target: "interests-input" },
        ],
        id: "registration-flow",
        nodes: [
          {
            data: {
              label: { en: "Full Name" },
              name: "fullName",
              required: true,
              type: "text",
            },
            id: "name-input",
            position: { x: 0, y: 0 },
            type: "input",
          },
          {
            data: {
              label: { en: "Email" },
              name: "email",
              pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
              required: true,
              type: "text",
            },
            id: "email-input",
            position: { x: 0, y: 100 },
            type: "input",
          },
          {
            data: {
              label: { en: "Country" },
              name: "country",
              options: [
                { label: { en: "France" }, value: "FR" },
                { label: { en: "USA" }, value: "US" },
              ],
              required: true,
              type: "select",
            },
            id: "country-input",
            position: { x: 0, y: 200 },
            type: "input",
          },
          {
            data: {
              label: { en: "Interests" },
              multiple: true,
              name: "interests",
              options: [
                { label: { en: "Tech" }, value: "tech" },
                { label: { en: "Sports" }, value: "sports" },
              ],
              type: "checkbox",
            },
            id: "interests-input",
            position: { x: 0, y: 300 },
            type: "input",
          },
        ],
      };

      expect(flow.nodes.length).toBe(4);
      expect(flow.edges.length).toBe(3);
      expect(flow.nodes.every((n) => n.type === "input")).toBe(true);
    });
  });

  describe("Switch and Toggle Inputs", () => {
    it("should validate switch input", () => {
      const inputData: InputNodeData = {
        label: { en: "Enable notifications" },
        name: "notifications",
        type: "switch",
      };

      expect(inputData.type).toBe("switch");
      expect(inputData.name).toBe("notifications");
    });
  });

  describe("Advanced Input Types", () => {
    it("should validate password input", () => {
      const inputData: InputNodeData = {
        errorMessage: { en: "Password must be at least 8 characters" },
        label: { en: "Password" },
        name: "password",
        pattern: "^.{8,}$",
        required: true,
        type: "password",
      };

      expect(inputData.type).toBe("password");
      expect(inputData.pattern).toBeDefined();
    });

    it("should validate file input", () => {
      const inputData: InputNodeData = {
        helperText: { en: "Upload your resume (PDF only)" },
        label: { en: "Resume" },
        name: "resume",
        type: "file",
      };

      expect(inputData.type).toBe("file");
    });

    it("should validate daterange input", () => {
      const inputData: InputNodeData = {
        helperText: { en: "Select a date range" },
        label: { en: "Date Range" },
        name: "dateRange",
        type: "daterange",
      };

      expect(inputData.type).toBe("daterange");
    });

    it("should validate timerange input", () => {
      const inputData: InputNodeData = {
        helperText: { en: "Select a time range" },
        label: { en: "Time Range" },
        name: "timeRange",
        type: "timerange",
      };

      expect(inputData.type).toBe("timerange");
    });

    it("should validate address input", () => {
      const inputData: InputNodeData = {
        label: { en: "Address" },
        name: "address",
        placeholder: { en: "Enter your address" },
        type: "address",
      };

      expect(inputData.type).toBe("address");
    });

    it("should validate hidden input", () => {
      const inputData: InputNodeData = {
        label: { en: "Hidden Field" },
        name: "hidden",
        type: "hidden",
      };

      expect(inputData.type).toBe("hidden");
    });

    it("should validate http input", () => {
      const inputData: InputNodeData = {
        httpConfig: {
          method: "GET",
          url: "https://api.example.com/data",
        },
        label: { en: "Dynamic Data" },
        name: "dynamicData",
        type: "http",
      };

      expect(inputData.type).toBe("http");
      expect(inputData.httpConfig).toBeDefined();
    });
  });
});
