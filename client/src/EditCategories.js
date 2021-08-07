import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";
import { UiEditCategories } from "./shared-ui/UiEditCategories";
import { Spinner } from "@chakra-ui/react";

export function EditCategories() {
  const mockCategories = [
    { id: "mockId-1", label: "mock category 1" },
    { id: "mockId-2", label: "mock category 2" },
    { id: "mockId-3", label: "mock category 3" },
  ];
  return (
    <UiEditCategories
      categories={mockCategories}
      onEditCategory={({ id, label }) =>
        console.log("edited category: ", { id, label })
      }
    />
  );
}
