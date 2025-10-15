import Empty from "~/example/Empty";
import Example from "~/example/Example";

const App = () => {
  const isExample = window.location.pathname.includes("/example");

  if (isExample) {
    return <Example />;
  }

  return <Empty />;
};

export default App;
