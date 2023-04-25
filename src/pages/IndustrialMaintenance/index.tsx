import React from "react";
import { useRouter } from "next/navigation";
import { Wrapper } from "./styled";
// import { Container } from './styles';

const IndustrialMaitenance: React.FC = () => {
  const router = useRouter();
  return (
    <Wrapper>
      <ul>
        <li onClick={() => router.push("/IndustrialMaintenance/Tools")}>
          FERRAMENTAS
        </li>
        <li onClick={() => router.push("/IndustrialMaintenance/Function")}>
          FUNÇÃO
        </li>
        <li onClick={() => router.push("/IndustrialMaintenance/CenterCost")}>
          CENTRO DE CUSTO
        </li>
        <li onClick={() => router.push("/IndustrialMaintenance/Location")}>
          LOCALIZAÇÂO
        </li>
        <li
          onClick={() => router.push("/IndustrialMaintenance/MaintenanceTypes")}
        >
          TIPOS MANUTENÇÃO
        </li>
        <li
          onClick={() =>
            router.push("/IndustrialMaintenance/PositionsOcupation")
          }
        >
          CARGOS/OCUPAÇÃO
        </li>
        <li onClick={() => router.push("/IndustrialMaintenance/ScaleType")}>
          TIPO ESCALA
        </li>
        <li onClick={() => router.push("/IndustrialMaintenance/ServiceTypes")}>
          TIPOS SERVIÇO
        </li>
        <li onClick={() => router.push("/IndustrialMaintenance/Shift")}>
          MUDANÇAS
        </li>
        <li onClick={() => router.push("/IndustrialMaintenance/Task")}>
          TAREFAS
        </li>
      </ul>
    </Wrapper>
  );
};

export default IndustrialMaitenance;
