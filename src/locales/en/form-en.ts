const FORM_EN = {
  additionalParams: "Api parameters",
  addressStructureHint: "An address type must be:",
  ancestor: "Ancestor",
  ancestorValue: "Get value from: {{ancestorName}}",
  apiRoute: "Api route",
  cardNumber: "Card number",
  dataMapping: "Option mapping",
  decisionField: "Decision field",
  disabledPast: "Disabled Past",
  dynamicSelectStructureHint: "Make sure the field accepts the ancestor value.",
  email: "Email",
  firstNameAndLastName: "First name and last name",
  helperText: "Helper text",
  hiddenValue: "Hidden value",
  key: "Key",
  keyPath: "Key path (string | number)",
  keyPathApiDescription:
    "(Option) To insert a value in a URL, use the syntax {paramName}. For example: http://api.com/userId={userId}, add {userId} in params.",
  keyPathAssignment: "Key path to value: {{keyPath}}",
  keyPathObject: "Key path to value",
  label: "Label",
  letter: "Letter",
  mapObject: "Map object",
  message: "Message",
  mustBeUnique: "Must be unique",
  newTree: "Nouvel arbre",
  noAncestorFound: "No parents found",
  number: "Nombre",
  numberAndLetter: "Number and letter",
  objectDemo: "Example of object mapping",
  offMessage: "Message (disable)",
  onMessage: "Message (enable)",
  pattern: "Pattern",
  patternMessage: "Pattern message",
  phoneNumber: "Phone number",
  receiveValueFromParent: "Default value from ancestor",
  repeatable: "Repeatable",
  searchKeyPlaceholder: "text",
  selectStructureHint: "Must be an value existing in the values option.",
  staticFields: "Static fields",
  staticValue: "(Option) Static value",
  staticValueDescription: "By default, it will use the ancestor value, but you can assign a static value.",
  step: "Step",
  tree: "Tree",
  treeName: "Tree name",
  type: {
    address: "Address",
    autocomplete: "Autocomplete",
    checkbox: "Checkbox",
    date: "Date",
    dateRange: "Date range",
    dynamicSelect: "Dynamic select",
    email: "Email",
    file: "File",
    hidden: "Hidden field",
    number: "Number",
    password: "Password",
    radio: "Radio",
    select: "Select",
    switch: "Switch",
    tel: "Tel",
    text: "Text",
    time: "Time",
    timeRange: "Time range",
    title: "Title",
    tree: "Tree",
    url: "URL",
  },
  typeStructureWarning: "Type structure must be: {{type}}",
  url: "URL",
  urlConstruction: "URL construction",
  useAncestorValueAsParam: "Use Ancestor value",
  value: "Value",
  values: "Values",
  warningApiAutocomplete: {
    response: "should have as a response",
    url: "The API Route",
  },
  warningApiSelect: {
    response: "at the location specified in the API URL.",
    url: "To automatically include the parent value in the API URL: add",
    warning: "{{}}",
  },
} as const;

export default FORM_EN;
