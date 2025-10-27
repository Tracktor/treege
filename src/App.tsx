import CustomInputExample from "~/example/CustomInputExample";
import Example from "~/example/Example";
import TreegeConfigProviderExample from "~/example/TreegeConfigProviderExample";

const App = () => {
  const { pathname } = window.location;
  const isExample = pathname.includes("/example");
  const isExampleComplex = pathname.includes("/example-complex");
  const isCustomInputExample = pathname.includes("/example-custom-input");
  const isTreegeConfigProviderExample = pathname.includes("/example-treege-config-provider");

  if (isTreegeConfigProviderExample) {
    return <TreegeConfigProviderExample />;
  }

  if (isCustomInputExample) {
    return <CustomInputExample />;
  }

  if (isExample) {
    return <Example demo />;
  }

  if (isExampleComplex) {
    return <Example complex />;
  }

  return <Example />;
};

export default App;
