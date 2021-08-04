import { Box, Select } from "@chakra-ui/react";

function UiCategories({ value, categories, onChange }) {
  return (
    <Box>
      <Select
        placeholder="Select Category"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue);
        }}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </Select>
    </Box>
  );
}

export { UiCategories };
