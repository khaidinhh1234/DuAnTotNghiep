import React from "react";

import { DataTable } from "./_component/data-table";
import { columns } from "./_component/columns";

interface ProductData {
  id: string;
  amount: number;
  name: string;
  price: number;
  total: number;
  status: string;
  email: string;
}

const data: ProductData[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    total: 34,
    price: 0,
    name: "success",
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    price: 0,
    total: 24,
    name: "success",
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    total: 234,
    price: 900,
    name: "success",
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    price: 0,
    total: 234,
    amount: 874,
    name: "hello",
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    name: "success",
    total: 234,
    price: 0,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

const Products = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
      </div>
      <div className="container mx-auto ">
        <DataTable columns={columns as any} data={data} />
      </div>
    </main>
  );
};

export default Products;
