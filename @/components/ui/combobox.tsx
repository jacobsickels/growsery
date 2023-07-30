import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import * as React from "react";

type Option = {
  value: string;
  label: string;
};

export function Combobox({
  options,
  self,
  defaultValue,
  onChange,
  onCreateNewGroup,
}: {
  options: Option[];
  self: Option;
  defaultValue: string;
  // Null will return if setting to user instead of group
  onChange: (groupId: string | null) => void;
  onCreateNewGroup: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const getButtonValue = () => {
    const groupOption = options.find((option) => option.value === value)?.label;

    if (!groupOption && value === self.value) {
      return self.label;
    } else if (groupOption) {
      return groupOption;
    }

    return "Select group...";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {getButtonValue()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search groups..." />
          <CommandEmpty>No groups found.</CommandEmpty>
          <CommandGroup heading="User">
            <CommandItem
              onSelect={() => {
                setValue(self.value);
                setOpen(false);
                onChange(null);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === self.value ? "opacity-100" : "opacity-0"
                )}
              />
              {self.label}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Groups">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  setValue(option.value);
                  setOpen(false);
                  onChange(option.value);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
            <CommandItem onSelect={onCreateNewGroup}>
              <PlusCircle className={cn("mr-2 h-4 w-4")} />
              Create a new group
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
