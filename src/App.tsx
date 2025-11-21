import CustomInputExample from "~/example/web/CustomInputExample";
import Example from "~/example/web/Example";
import TreegeConfigProviderExample from "~/example/web/TreegeConfigProviderExample";

const App = () => {
  const { pathname } = window.location;

  if (pathname === "/example-treege-config-provider") {
    return <TreegeConfigProviderExample />;
  }

  if (pathname === "/example-custom-input") {
    return <CustomInputExample />;
  }

  if (pathname === "/example-all-inputs") {
    return <Example all />;
  }

  if (pathname === "/example") {
    return <Example demo />;
  }
  return <Example />;
};

export default App;
