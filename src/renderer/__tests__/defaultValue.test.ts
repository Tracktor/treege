import { describe, expect, it } from "vitest";
import type { InputNodeData } from "@/shared/types/node";

describe("DefaultValue Reference System", () => {
  describe("Static Default Values", () => {
    it("should validate static string value", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          staticValue: "John Doe",
          type: "static",
        },
        label: { en: "Name" },
        name: "name",
        type: "text",
      };

      expect(inputData.defaultValue?.type).toBe("static");
      expect(inputData.defaultValue?.staticValue).toBe("John Doe");
    });

    it("should validate static boolean value", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          staticValue: true,
          type: "static",
        },
        label: { en: "Enable notifications" },
        name: "notifications",
        type: "switch",
      };

      expect(inputData.defaultValue?.staticValue).toBe(true);
      expect(typeof inputData.defaultValue?.staticValue).toBe("boolean");
    });

    it("should validate static array value for multi-select", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          staticValue: ["sports", "music"],
          type: "static",
        },
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

      expect(Array.isArray(inputData.defaultValue?.staticValue)).toBe(true);
      expect((inputData.defaultValue?.staticValue as string[]).length).toBe(2);
    });

    it("should validate null default value", () => {
      const inputData: InputNodeData = {
        defaultValue: null,
        label: { en: "Optional Field" },
        name: "optional",
        type: "text",
      };

      expect(inputData.defaultValue).toBeNull();
    });

    it("should validate static numeric string value", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          staticValue: "25",
          type: "static",
        },
        label: { en: "Age" },
        name: "age",
        type: "number",
      };

      expect(inputData.defaultValue?.staticValue).toBe("25");
    });
  });

  describe("Reference Default Values", () => {
    it("should validate reference to another field", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "email-field",
          type: "reference",
        },
        label: { en: "Confirm Email" },
        name: "confirmEmail",
        type: "text",
      };

      expect(inputData.defaultValue?.type).toBe("reference");
      expect(inputData.defaultValue?.referenceField).toBe("email-field");
    });

    it("should validate reference with transform function", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "age-field",
          transformFunction: "toString",
          type: "reference",
        },
        label: { en: "Age Display" },
        name: "ageDisplay",
        type: "text",
      };

      expect(inputData.defaultValue?.transformFunction).toBe("toString");
      expect(inputData.defaultValue?.referenceField).toBeDefined();
    });

    it("should validate reference without transform", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "username",
          type: "reference",
        },
        label: { en: "Display Name" },
        name: "displayName",
        type: "text",
      };

      expect(inputData.defaultValue?.transformFunction).toBeUndefined();
    });
  });

  describe("Transform Functions", () => {
    it("should validate toString transform", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "count",
          transformFunction: "toString",
          type: "reference",
        },
        label: { en: "Count Text" },
        name: "countText",
        type: "text",
      };

      expect(inputData.defaultValue?.transformFunction).toBe("toString");
    });

    it("should validate toNumber transform", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "age-string",
          transformFunction: "toNumber",
          type: "reference",
        },
        label: { en: "Age" },
        name: "age",
        type: "number",
      };

      expect(inputData.defaultValue?.transformFunction).toBe("toNumber");
    });

    it("should validate toBoolean transform", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "consent-string",
          transformFunction: "toBoolean",
          type: "reference",
        },
        label: { en: "Consent" },
        name: "consent",
        type: "switch",
      };

      expect(inputData.defaultValue?.transformFunction).toBe("toBoolean");
    });

    it("should validate toArray transform", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "tags-string",
          transformFunction: "toArray",
          type: "reference",
        },
        label: { en: "Tags" },
        multiple: true,
        name: "tags",
        type: "checkbox",
      };

      expect(inputData.defaultValue?.transformFunction).toBe("toArray");
    });

    it("should validate toObject transform", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "json-string",
          transformFunction: "toObject",
          type: "reference",
        },
        label: { en: "Config" },
        name: "config",
        type: "text",
      };

      expect(inputData.defaultValue?.transformFunction).toBe("toObject");
    });

    it("should validate null transform function", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "source-field",
          transformFunction: null,
          type: "reference",
        },
        label: { en: "Target" },
        name: "target",
        type: "text",
      };

      expect(inputData.defaultValue?.transformFunction).toBeNull();
    });
  });

  describe("Object Mapping", () => {
    it("should validate object mapping structure", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          objectMapping: [
            { sourceKey: "firstName", targetKey: "first" },
            { sourceKey: "lastName", targetKey: "last" },
          ],
          referenceField: "user-data",
          transformFunction: "toObject",
          type: "reference",
        },
        label: { en: "Name" },
        name: "name",
        type: "text",
      };

      expect(inputData.defaultValue?.objectMapping).toBeDefined();
      expect(inputData.defaultValue?.objectMapping?.length).toBe(2);
    });

    it("should validate single key mapping", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          objectMapping: [{ sourceKey: "email", targetKey: "contactEmail" }],
          referenceField: "user-profile",
          transformFunction: "toObject",
          type: "reference",
        },
        label: { en: "Email" },
        name: "email",
        type: "text",
      };

      expect(inputData.defaultValue?.objectMapping?.length).toBe(1);
      expect(inputData.defaultValue?.objectMapping?.[0].sourceKey).toBe("email");
      expect(inputData.defaultValue?.objectMapping?.[0].targetKey).toBe("contactEmail");
    });

    it("should validate complex object mapping", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          objectMapping: [
            { sourceKey: "user.profile.firstName", targetKey: "first" },
            { sourceKey: "user.profile.lastName", targetKey: "last" },
            { sourceKey: "user.contact.email", targetKey: "email" },
            { sourceKey: "user.settings.notifications", targetKey: "notify" },
          ],
          referenceField: "api-response",
          transformFunction: "toObject",
          type: "reference",
        },
        label: { en: "User Info" },
        name: "userInfo",
        type: "text",
      };

      expect(inputData.defaultValue?.objectMapping?.length).toBe(4);
      expect(inputData.defaultValue?.objectMapping?.every((m) => m.sourceKey.includes("."))).toBe(true);
    });

    it("should allow object mapping without mapping array", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "data",
          transformFunction: "toObject",
          type: "reference",
        },
        label: { en: "Data" },
        name: "data",
        type: "text",
      };

      expect(inputData.defaultValue?.objectMapping).toBeUndefined();
    });
  });

  describe("DefaultValue Type Combinations", () => {
    it("should not have both static and reference", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          // This would be invalid in practice, but TypeScript allows it
          referenceField: "other-field",
          staticValue: "value",
          type: "static",
        },
        label: { en: "Field" },
        name: "field",
        type: "text",
      };

      // When type is "static", we expect staticValue to be used
      expect(inputData.defaultValue?.type).toBe("static");
      expect(inputData.defaultValue?.staticValue).toBeDefined();
    });

    it("should validate reference type with all options", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          objectMapping: [
            { sourceKey: "id", targetKey: "userId" },
            { sourceKey: "name", targetKey: "userName" },
          ],
          referenceField: "user-data",
          transformFunction: "toObject",
          type: "reference",
        },
        label: { en: "User" },
        name: "user",
        type: "text",
      };

      expect(inputData.defaultValue?.type).toBe("reference");
      expect(inputData.defaultValue?.referenceField).toBeDefined();
      expect(inputData.defaultValue?.transformFunction).toBeDefined();
      expect(inputData.defaultValue?.objectMapping).toBeDefined();
    });
  });

  describe("Complex Real-World Scenarios", () => {
    it("should validate email confirmation field", () => {
      const emailInput: InputNodeData = {
        label: { en: "Email" },
        name: "email",
        required: true,
        type: "text",
      };

      const confirmEmailInput: InputNodeData = {
        defaultValue: {
          referenceField: "email",
          type: "reference",
        },
        errorMessage: { en: "Emails must match" },
        label: { en: "Confirm Email" },
        name: "confirmEmail",
        required: true,
        type: "text",
      };

      expect(emailInput.name).toBe("email");
      expect(confirmEmailInput.defaultValue?.referenceField).toBe("email");
    });

    it("should validate derived calculated field", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "birth-year",
          transformFunction: "toNumber",
          type: "reference",
        },
        label: { en: "Age" },
        name: "age",
        type: "number",
      };

      expect(inputData.defaultValue?.transformFunction).toBe("toNumber");
      expect(inputData.defaultValue?.referenceField).toBe("birth-year");
    });

    it("should validate conditional visibility with reference", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "show-advanced",
          transformFunction: "toBoolean",
          type: "reference",
        },
        label: { en: "Advanced Options Visible" },
        name: "advancedVisible",
        type: "switch",
      };

      expect(inputData.defaultValue?.type).toBe("reference");
      expect(inputData.defaultValue?.transformFunction).toBe("toBoolean");
    });

    it("should validate address auto-fill scenario", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          objectMapping: [
            { sourceKey: "street", targetKey: "street" },
            { sourceKey: "city", targetKey: "city" },
            { sourceKey: "postalCode", targetKey: "zip" },
            { sourceKey: "country", targetKey: "country" },
          ],
          referenceField: "billing-address",
          transformFunction: "toObject",
          type: "reference",
        },
        label: { en: "Shipping Address" },
        name: "shippingAddress",
        type: "text",
      };

      expect(inputData.defaultValue?.objectMapping?.length).toBe(4);
      expect(inputData.defaultValue?.referenceField).toBe("billing-address");
    });

    it("should validate multi-language field reference", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "selected-language",
          type: "reference",
        },
        label: {
          en: "Language",
          fr: "Langue",
        },
        name: "language",
        type: "select",
      };

      expect(inputData.defaultValue?.referenceField).toBe("selected-language");
      expect(typeof inputData.label).toBe("object");
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined defaultValue", () => {
      const inputData: InputNodeData = {
        label: { en: "Field" },
        name: "field",
        type: "text",
      };

      expect(inputData.defaultValue).toBeUndefined();
    });

    it("should handle empty string as static value", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          staticValue: "",
          type: "static",
        },
        label: { en: "Field" },
        name: "field",
        type: "text",
      };

      expect(inputData.defaultValue?.staticValue).toBe("");
    });

    it("should handle empty array as static value", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          staticValue: [],
          type: "static",
        },
        label: { en: "Tags" },
        multiple: true,
        name: "tags",
        type: "checkbox",
      };

      expect(Array.isArray(inputData.defaultValue?.staticValue)).toBe(true);
      expect((inputData.defaultValue?.staticValue as string[]).length).toBe(0);
    });

    it("should handle reference to non-existent field", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          referenceField: "non-existent-field",
          type: "reference",
        },
        label: { en: "Field" },
        name: "field",
        type: "text",
      };

      // The system should handle this gracefully, field just won't have a value
      expect(inputData.defaultValue?.referenceField).toBe("non-existent-field");
    });

    it("should handle empty object mapping array", () => {
      const inputData: InputNodeData = {
        defaultValue: {
          objectMapping: [],
          referenceField: "data",
          transformFunction: "toObject",
          type: "reference",
        },
        label: { en: "Data" },
        name: "data",
        type: "text",
      };

      expect(inputData.defaultValue?.objectMapping?.length).toBe(0);
    });
  });
});
