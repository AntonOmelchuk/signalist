import { Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "../ui/label";

const SelectField = ({
  name,
  label,
  error,
  control,
  options,
  required = false,
  placeholder,
}: SelectFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => {
          return (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                <SelectGroup>
                  {options.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="focus:bg-ray-600 focus:text-white"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
              {error && <p className="text-sm text-red-500">{error.message}</p>}
            </Select>
          );
        }}
      />
    </div>
  );
};

export default SelectField;
