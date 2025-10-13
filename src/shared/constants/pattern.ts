const pattern = {
  alphanumeric: "^[a-zA-Z0-9]+$",
  email: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
  letters: "^[a-zA-Z]+$",
  number: "^[0-9]+$",
  url: "^https?:\\/\\/.+$",
};

export default pattern;
