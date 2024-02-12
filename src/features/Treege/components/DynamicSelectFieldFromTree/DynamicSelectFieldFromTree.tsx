import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@tracktor/design-system";
import { useState } from "react";
import useTreegeContext from "@/hooks/useTreegeContext";
import { getNamesInTree } from "@/utils/tree";

// import getNamesInBranch from "@/utils/tree/getNamesInBranch/getNamesInBranch";

interface DynamicSelectFieldFromTreeProps {
  value: string | null;
  onChange?: (event: SelectChangeEvent<string | undefined>, newValue: string | undefined) => void;
}

const DynamicSelectFieldFromTree = ({ value, onChange }: DynamicSelectFieldFromTreeProps) => {
  const { tree } = useTreegeContext();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value || "");

  const filterNamesWithTwoPoints = (branchNames: string[]): string[] => branchNames.filter((name) => !name.includes(":"));

  const treeNames = getNamesInTree(tree);
  const filteredTreeNames = filterNamesWithTwoPoints(treeNames);

  const handleChange = (event: SelectChangeEvent<string | undefined>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);

    if (onChange) {
      onChange(event, newValue);
    }
  };

  return (
    <FormControl sx={{ flex: 1.5 }} required>
      <InputLabel>Parent value</InputLabel>
      <Select
        sx={{ flex: 2 }}
        value={selectedValue}
        label="Parent value"
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 300 },
          },
        }}
      >
        {filteredTreeNames && filteredTreeNames.length > 0 ? (
          filteredTreeNames.map((name) => <MenuItem value={name}>{name}</MenuItem>)
        ) : (
          <MenuItem disabled value="">
            No parents found
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default DynamicSelectFieldFromTree;
