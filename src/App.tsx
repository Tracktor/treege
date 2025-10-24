import CustomInputExample from "~/example/CustomInputExample";
import Example from "~/example/Example";

const App = () => {
  const { pathname } = window.location;
  const isExample = pathname.includes("/example");
  const isCustomInputExample = pathname.includes("/custom-input-example");

  if (isExample) {
    return <Example demo />;
  }

  if (isCustomInputExample) {
    return <CustomInputExample />;
  }

  return <Example />;
};

export default App;
