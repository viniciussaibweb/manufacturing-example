import { ApiService } from "@/services/api";
import React from "react";

// import { Container } from './styles';

const Products: React.FC = () => {
  const fn = async () => {
    const api = ApiService.getInstance("SAIBWEB");

    const res = await api.get("industrial-maintenance/tool");
    console.log(res);
  };

  return (
    <div onClick={fn}>
      <button>click</button>
      <h1>Products</h1>
    </div>
  );
};

export default Products;
