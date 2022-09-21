interface Fields {
  readonly isDecisionField?: boolean;
  readonly isRequiredDisabled?: boolean;
  readonly isBooleanField?: boolean;
  readonly type: string;
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
    type: "file",
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
    isBooleanField: true,
    isRequiredDisabled: true,
    type: "switch",
  },
  {
    isBooleanField: true,
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
