import { useContext } from "react";
import { DecisionTreeGeneratorContext } from "@/features/DecisionTreeGenerator/context/DecisionTreeGeneratorContext";

const useTreeCardContainer = () => {
  const { setTree } = useContext(DecisionTreeGeneratorContext);
  const handleOnAddChildren = (a: any, b: any) => {
    console.log(a);
    console.log(b);

    setTree((prevState) => ({
      ...prevState,
      children: [
        {
          attributes: {},
          name: "x",
        },
      ],
    }));
  };

  return { handleOnAddChildren };
};
export default useTreeCardContainer;
