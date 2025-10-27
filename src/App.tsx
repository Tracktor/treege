import CustomInputExample from "~/example/CustomInputExample";
import Example from "~/example/Example";
import TreegeConfigProviderExample from "~/example/TreegeConfigProviderExample";

const App = () => {
  const { pathname } = window.location;

  if (pathname === "/example-treege-config-provider") {
    return <TreegeConfigProviderExample />;
  }

  if (pathname === "/example-custom-input") {
    return <CustomInputExample />;
  }

  if (pathname === "/example-complex") {
    return <Example complex />;
  }

  if (pathname === "/example") {
    return <Example demo />;
  }
  return <Example />;
};

export default App;
