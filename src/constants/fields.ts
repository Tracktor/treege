const fields = [
  {
    type: "text",
  },
  {
    type: "number",
  },
  {
    type: "email",
  },
  {
    type: "password",
  },
  {
    type: "tel",
  },
  {
    type: "address",
  },
  {
    type: "url",
  },
  {
    type: "date",
  },
  {
    type: "time",
  },
  {
    requiredDisabled: true,
    type: "switch",
  },
  {
    requiredDisabled: true,
    type: "checkbox",
  },
  {
    isDecisionField: true,
    type: "radio",
  },
  {
    isDecisionField: true,
    type: "select",
  },
];

export default fields;
