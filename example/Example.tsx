import { Flow } from "@/shared/types/node";
import ExampleLayout from "~/example/ExampleLayout";
import example from "~/example/json/treege.json";

const Example = () => <ExampleLayout flow={example as Flow} />;

export default Example;
