import React from "react";
import { useRouter } from "next/navigation";
// import { Container } from './styles';

const IndustrialMaitenance: React.FC = () => {
  const router = useRouter();
  return (
    <div>
      <ul>
        <li onClick={() => router.push("/IndustrialMaintenance/Tools")}>
          Tools
        </li>
      </ul>
    </div>
  );
};

export default IndustrialMaitenance;
