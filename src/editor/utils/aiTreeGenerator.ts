import { AIGenerationRequest, AIGenerationResponse } from "@/editor/types/ai";

/**
 * System prompt that explains the Treege structure to the AI
 */
const SYSTEM_PROMPT = `You are a Treege decision tree generator. You must generate valid JSON structures for decision trees.

IMPORTANT RULES:
1. Always respond with valid JSON only, no markdown, no code blocks, no explanations outside the JSON
2. The JSON must have this exact structure: { "nodes": [...], "edges": [...] }
3. Every node must have: id (string), type (string), position ({ x: number, y: number }), data (object)
4. Every edge must have: id (string), source (string), target (string)
5. For regex patterns: ALWAYS use double backslashes (\\\\) for special characters (\\\\s, \\\\d, etc.)
6. AVOID using "pattern" field unless specifically requested - prefer using simple validation

NODE TYPES:
- "input": Form input fields (text, number, select, checkbox, etc.)
- "ui": UI elements (title, divider)
- "flow": Navigation/flow control nodes
- "group": Container for organizing nodes

INPUT NODE TYPES (data.type):
- "text", "number", "textarea", "password"
- "select", "radio", "checkbox", "switch"
- "autocomplete", "date", "daterange", "time", "timerange"
- "file", "address", "http", "hidden"

INPUT NODE DATA STRUCTURE:
{
  "id": "unique-id",
  "type": "input",
  "position": { "x": 0, "y": 0 },
  "data": {
    "label": "Field Label",
    "name": "fieldName",
    "type": "text",
    "required": true,
    "placeholder": "Enter value...",
    "helperText": "Optional helper text",
    "pattern": "regex pattern (optional)",
    "errorMessage": "Error message if validation fails",
    "options": [{ "value": "val", "label": "Label" }], // for select/radio/checkbox
    "multiple": false // for select/checkbox
  }
}

UI NODE TYPES (data.type):
- "title": Display a title
- "divider": Display a divider line

UI NODE DATA STRUCTURE:
{
  "id": "unique-id",
  "type": "ui",
  "position": { "x": 0, "y": 0 },
  "data": {
    "label": "UI Element Label",
    "type": "title" // or "divider"
  }
}

FLOW NODE DATA STRUCTURE:
{
  "id": "unique-id",
  "type": "flow",
  "position": { "x": 0, "y": 0 },
  "data": {
    "label": "Flow Step Label",
    "targetId": "next-node-id" // optional
  }
}

GROUP NODE DATA STRUCTURE:
{
  "id": "unique-id",
  "type": "group",
  "position": { "x": 0, "y": 0 },
  "data": {
    "label": "Group Label"
  }
}

EDGE STRUCTURE:
{
  "id": "edge-id",
  "source": "source-node-id",
  "target": "target-node-id",
  "type": "default" // or "conditional" for advanced flows
}

LAYOUT GUIDELINES:
- Position nodes in a vertical flow (top to bottom)
- Start at position { x: 0, y: 0 }
- Space nodes vertically by 180-200 pixels (consistent spacing)
- For horizontal spacing, use ~350 pixels
- Create logical flow from top to bottom
- IMPORTANT: Keep consistent vertical spacing to avoid overlap

EXAMPLES:

User: "Create a simple contact form with name, email and message"
Response:
{
  "nodes": [
    {
      "id": "title-1",
      "type": "ui",
      "position": { "x": 0, "y": 0 },
      "data": { "label": "Contact Form", "type": "title" }
    },
    {
      "id": "name-1",
      "type": "input",
      "position": { "x": 0, "y": 180 },
      "data": {
        "label": "Name",
        "name": "name",
        "type": "text",
        "required": true,
        "placeholder": "Enter your name"
      }
    },
    {
      "id": "email-1",
      "type": "input",
      "position": { "x": 0, "y": 360 },
      "data": {
        "label": "Email",
        "name": "email",
        "type": "text",
        "required": true,
        "placeholder": "your@email.com"
      }
    },
    {
      "id": "message-1",
      "type": "input",
      "position": { "x": 0, "y": 540 },
      "data": {
        "label": "Message",
        "name": "message",
        "type": "textarea",
        "required": true,
        "placeholder": "Enter your message"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "title-1", "target": "name-1" },
    { "id": "e2", "source": "name-1", "target": "email-1" },
    { "id": "e3", "source": "email-1", "target": "message-1" }
  ]
}

User: "Create a user registration form with age, address and country selector"
Response:
{
  "nodes": [
    {
      "id": "title-1",
      "type": "ui",
      "position": { "x": 0, "y": 0 },
      "data": { "label": "User Registration", "type": "title" }
    },
    {
      "id": "age-1",
      "type": "input",
      "position": { "x": 0, "y": 180 },
      "data": {
        "label": "Age",
        "name": "age",
        "type": "number",
        "required": true,
        "placeholder": "Enter your age"
      }
    },
    {
      "id": "address-1",
      "type": "input",
      "position": { "x": 0, "y": 360 },
      "data": {
        "label": "Address",
        "name": "address",
        "type": "address",
        "required": true,
        "placeholder": "Enter your address"
      }
    },
    {
      "id": "country-1",
      "type": "input",
      "position": { "x": 0, "y": 540 },
      "data": {
        "label": "Country",
        "name": "country",
        "type": "select",
        "required": true,
        "options": [
          { "value": "us", "label": "United States" },
          { "value": "ca", "label": "Canada" },
          { "value": "uk", "label": "United Kingdom" },
          { "value": "fr", "label": "France" },
          { "value": "de", "label": "Germany" }
        ]
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "title-1", "target": "age-1" },
    { "id": "e2", "source": "age-1", "target": "address-1" },
    { "id": "e3", "source": "address-1", "target": "country-1" }
  ]
}

Remember:
- Always respond with ONLY valid JSON
- No markdown code blocks
- No explanations outside the JSON
- Follow the exact structure shown above
`;

/**
 * Default models for each provider
 */
const DEFAULT_MODELS = {
  claude: "claude-3-5-haiku-20241022",
  deepseek: "deepseek-chat",
  gemini: "gemini-2.5-flash",
  openai: "gpt-4o-mini",
} as const;

/**
 * Clean and parse JSON response from AI
 * Handles common JSON parsing issues like unescaped characters
 */
function safeJsonParse(text: string): AIGenerationResponse {
  try {
    // First try direct parse
    return JSON.parse(text);
  } catch (error) {
    // If direct parse fails, try cleaning the JSON
    const cleaned = text
      // Remove Markdown code blocks if present
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      // Log the problematic JSON for debugging
      console.error("Failed to parse AI response:", text.substring(0, 500));
      throw new Error(`Invalid JSON response from AI: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

/**
 * Generate tree using Gemini API
 */
async function generateWithGemini(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const model = request.config.model || DEFAULT_MODELS.gemini;
  const temperature = request.config.temperature ?? 0.7;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${request.config.apiKey}`,
    {
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nUser request: ${request.prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          temperature,
        },
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No response from Gemini");
  }

  return safeJsonParse(text);
}

/**
 * Generate tree using OpenAI API
 */
async function generateWithOpenAI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const model = request.config.model || DEFAULT_MODELS.openai;
  const temperature = request.config.temperature ?? 0.7;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    body: JSON.stringify({
      messages: [
        { content: SYSTEM_PROMPT, role: "system" },
        { content: request.prompt, role: "user" },
      ],
      model,
      response_format: { type: "json_object" },
      temperature,
    }),
    headers: {
      Authorization: `Bearer ${request.config.apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("No response from OpenAI");
  }

  return safeJsonParse(text);
}

/**
 * Generate tree using DeepSeek API (OpenAI-compatible)
 */
async function generateWithDeepSeek(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const model = request.config.model || DEFAULT_MODELS.deepseek;
  const temperature = request.config.temperature ?? 0.7;

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    body: JSON.stringify({
      messages: [
        { content: SYSTEM_PROMPT, role: "system" },
        { content: request.prompt, role: "user" },
      ],
      model,
      response_format: { type: "json_object" },
      temperature,
    }),
    headers: {
      Authorization: `Bearer ${request.config.apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("No response from DeepSeek");
  }

  return safeJsonParse(text);
}

/**
 * Generate tree using Claude API
 */
async function generateWithClaude(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const model = request.config.model || DEFAULT_MODELS.claude;
  const temperature = request.config.temperature ?? 0.7;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    body: JSON.stringify({
      max_tokens: 4096,
      messages: [{ content: request.prompt, role: "user" }],
      model,
      system: SYSTEM_PROMPT,
      temperature,
    }),
    headers: {
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
      "x-api-key": request.config.apiKey,
    },
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;

  if (!text) {
    throw new Error("No response from Claude");
  }

  return safeJsonParse(text);
}

/**
 * Main function to generate tree using AI
 */
export function generateTreeWithAI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  switch (request.config.provider) {
    case "gemini":
      return generateWithGemini(request);
    case "openai":
      return generateWithOpenAI(request);
    case "deepseek":
      return generateWithDeepSeek(request);
    case "claude":
      return generateWithClaude(request);
    default:
      throw new Error(`Unsupported AI provider: ${request.config.provider}`);
  }
}
