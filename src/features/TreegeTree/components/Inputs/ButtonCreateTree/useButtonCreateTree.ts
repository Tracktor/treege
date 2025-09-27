import useTreegeContext from "@/hooks/useTreegeContext";

const useButtonCreateTree = () => {
  const { setModalOpen } = useTreegeContext();

  const handleClick = () => setModalOpen("add");

  return { handleClick };
};

export default useButtonCreateTree;
