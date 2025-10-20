import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";

export type ComboboxOption = {
  value?: string | null;
  label: string;
};

/**
 * Reusable Combobox component with search, create, and clear functionality
 */
const ComboboxWithCreate = ({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search or create...",
  createLabel = (query: string) => `Use: ${query}`,
  clearLabel = "Clear selection",
  emptyLabel = "No results found",
  className,
  allowClear = true,
  allowCreate = true,
}: {
  options: ComboboxOption[];
  value?: string | null;
  onValueChange?: (newValue: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  createLabel?: (query: string) => string;
  clearLabel?: string;
  emptyLabel?: string;
  className?: string;
  allowClear?: boolean;
  allowCreate?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Normalize value to string or undefined
  const normalizedValue = value || "";
  const selectedOption = options.find((option) => option.value === normalizedValue);

  const canCreate =
    allowCreate &&
    search.trim() !== "" &&
    !options.some((option) => option.label.toLowerCase() === search.toLowerCase() || option.value?.toLowerCase() === search.toLowerCase());

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === normalizedValue) {
      if (allowClear) {
        onValueChange?.("");
      }
      // if clearing isn't allowed, keep selection as-is
    } else {
      onValueChange?.(selectedValue);
    }
    setOpen(false);
    setSearch("");
  };

  const handleCreate = () => {
    if (search.trim()) {
      onValueChange?.(search.trim());
      setOpen(false);
      setSearch("");
    }
  };

  const handleClear = () => {
    onValueChange?.("");
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{emptyLabel}</CommandEmpty>

            {/* Clear option - appears at the end if there's a selection */}
            {allowClear && value && (
              <CommandGroup>
                <CommandItem value="__clear__" onSelect={handleClear} className="text-muted-foreground mt-1">
                  <X className="mr-2 h-4 w-4" />
                  {clearLabel}
                </CommandItem>
              </CommandGroup>
            )}

            <CommandGroup>
              {/* Create new option */}
              {canCreate && (
                <CommandItem value={`__create__${search}`} onSelect={handleCreate} className="text-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  {createLabel(search)}
                </CommandItem>
              )}

              {/* Existing options */}
              {options
                .filter((option) => {
                  const s = search.toLowerCase();
                  return option.label.toLowerCase().includes(s) || (option.value?.toLowerCase() ?? "").includes(s);
                })
                .map((option, idx) => (
                  <CommandItem
                    key={option.value ?? option.label ?? idx}
                    value={option.label}
                    onSelect={() => handleSelect(option?.value || "")}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxWithCreate;
