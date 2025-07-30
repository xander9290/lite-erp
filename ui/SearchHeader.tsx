"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

type TInputs = {
  searchKey: string;
  filterSearch: string;
};

export type TFilterSearch = {
  key: string;
  value: string;
};

function SearchHeader({
  basePath,
  filterSearch = [],
}: {
  basePath: string;
  filterSearch: TFilterSearch[];
}) {
  const route = useRouter();
  const { register, handleSubmit, reset, watch } = useForm<TInputs>();

  const [searchKey] = watch(["searchKey"]);

  const cleanedSearch = basePath.replace(/&?search=[^&]*/, ""); // Remove existing search param if any

  const onSubmit: SubmitHandler<TInputs> = (data) => {
    if (data.searchKey) {
      route.push(
        `${cleanedSearch}&search=${data.searchKey}&filter=${data.filterSearch}`
      ); // Update the URL with the new search value
    } else {
      route.push(cleanedSearch); // If searchKey is empty, just navigate to the base path
      reset({ filterSearch: filterSearch[0].key });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="d-flex gap-1">
        <Form.Select {...register("filterSearch")} className="w-25">
          {filterSearch.map((filter, i) => (
            <option
              key={`filterSearch-${i}-${filter.value}`}
              value={filter.key}
            >
              {filter.value}
            </option>
          ))}
        </Form.Select>
        <Form.Control
          {...register("searchKey")}
          size="sm"
          type="text"
          placeholder="Buscar..."
          autoComplete="off"
        />
        <Button type="submit" size="sm" variant="primary">
          <i className="bi bi-search"></i>
        </Button>
      </Form.Group>
    </Form>
  );
}

export default SearchHeader;
