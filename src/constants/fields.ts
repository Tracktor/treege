interface Fields {
  isDecisionField?: boolean;
  isRequiredDisabled?: boolean;
  type: string;
}

const fields: Fields[] = [
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
    isRequiredDisabled: true,
    type: "switch",
  },
  {
    isRequiredDisabled: true,
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
