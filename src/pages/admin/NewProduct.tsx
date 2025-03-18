import React from 'react';
import { AddInventoryProduct } from '../../components/custom/modals';

export default function NewProduct() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      <AddInventoryProduct />
    </div>
  );
} 