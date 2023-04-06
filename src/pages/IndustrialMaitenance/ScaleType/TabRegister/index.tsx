import React from "react";
import * as S from "./styled";
import { Form } from "@unform/web";
import { AreaComp, Row, Toolbar, ToolbarButton } from "@/styles/global";
import Input from "@/components/Input";
import { MdSave } from "react-icons/md";
import { BootstrapTooltip } from "@/components/Tooltip";
import { useTools } from "@/hooks/IndustrialMaintenance/useTool";
import { useScaleType } from "@/hooks/IndustrialMaintenance/useScaleType";

const TabRegister: React.FC = () => {
  const { formRegisterRef, saveScaleType } = useScaleType();
  return (
    <S.Container>
      <Toolbar colorInverterDefault>
        <BootstrapTooltip title="Salvar" placement="bottom">
          <ToolbarButton
            type="button"
            onClick={() => formRegisterRef.current?.submitForm()}
          >
            <MdSave size={25} color="#fff" />
          </ToolbarButton>
        </BootstrapTooltip>
      </Toolbar>

      <Form ref={formRegisterRef} onSubmit={saveScaleType}>
        <Row gp="10px" mg="10px 0">
          <AreaComp wd="20" noPd>
            <Input label="Código:" type="text" name="code" disabled />
          </AreaComp>
          <AreaComp wd="80" noPd>
            <Input label="Descrição:" type="text" name="description" />
          </AreaComp>
          <AreaComp wd="20" noPd>
            <Input label="Dias trabalhados:" type="number" name="workDays" />
          </AreaComp>
          <AreaComp wd="20" noPd>
            <Input label="Dias sem trabalho:" type="number" name="offDays" />
          </AreaComp>
        </Row>
      </Form>
    </S.Container>
  );
};

export default TabRegister;
