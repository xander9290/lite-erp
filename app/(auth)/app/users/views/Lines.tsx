"use client";

import { useState } from "react";

type OrderLine = {
  id?: string;
  product: string;
  quantity: number;
};

export default function NewOrderPage() {
  const [name, setName] = useState("");
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);

  const addLine = () => {
    setOrderLines([...orderLines, { product: "", quantity: 1 }]);
  };

  const updateLine = (
    index: number,
    key: keyof OrderLine,
    value: string | number
  ) => {
    const updated = [...orderLines];
    updated[index] = { ...updated[index], [key]: value };
    setOrderLines(updated);
  };

  const removeLine = (index: number) => {
    setOrderLines(orderLines.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, orderLines }),
    });

    if (res.ok) {
      alert("Order created successfully");
      setName("");
      setOrderLines([]);
    } else {
      alert("Error creating order");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Create Order</h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Order name"
        className="border p-2 mb-4 block"
      />

      <div>
        <h2 className="text-lg mb-2">Order Lines</h2>
        <button
          onClick={addLine}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Add Line
        </button>
        {orderLines.map((line, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={line.product}
              onChange={(e) => updateLine(index, "product", e.target.value)}
              placeholder="Product"
              className="border p-2"
            />
            <input
              type="number"
              value={line.quantity}
              onChange={(e) =>
                updateLine(index, "quantity", Number(e.target.value))
              }
              className="border p-2 w-20"
            />
            <button
              onClick={() => removeLine(index)}
              className="bg-red-500 text-white px-2"
            >
              X
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 mt-4"
      >
        Save Order
      </button>
    </div>
  );
}
