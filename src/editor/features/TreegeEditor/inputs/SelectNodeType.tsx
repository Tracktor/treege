import { nodeTypes } from "@/editor/constants/nodeTypes";
import useFlowActions from "@/editor/hooks/useFlowActions";
import useNodesSelection from "@/editor/hooks/useNodesSelection";
import useTranslate from "@/editor/hooks/useTranslate";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { isGroupNode } from "@/shared/utils/nodeTypeGuards";

const SelectNodeType = () => {
  const { selectedNode } = useNodesSelection();
  const { updateSelectedNodeType } = useFlowActions();
  const value = selectedNode?.type || "";
  const isGroup = isGroupNode(selectedNode);
  const t = useTranslate();

  return (
    <SelectGroup>
      <SelectLabel>{t("editor.selectNodeType.nodeType")}</SelectLabel>
      <Select value={value} onValueChange={(newValue) => updateSelectedNodeType(newValue)} disabled={isGroup}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("editor.selectNodeType.nodeType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.keys(nodeTypes)
              .filter((type) => (isGroup ? type === "group" : type !== "group"))
              .map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </SelectGroup>
  );
};

export default SelectNodeType;
