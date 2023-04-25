import React from "react";
import * as S from "./styles";
import { Form } from "@unform/web";
import { AreaComp, Row, Toolbar, ToolbarButton } from "@/styles/global";

import { MdSave } from "react-icons/md";
import { BootstrapTooltip } from "@/components/Tooltip";
import { useCenterCost } from "@/hooks/IndustrialMaintenance/useCenterCost";

import Input from "@/components/Input";

const TabRegister: React.FC = () => {
  const { formRegisterRef, saveCenterCost } = useCenterCost();
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

      <Form ref={formRegisterRef} onSubmit={saveCenterCost}>
        <Row gp="10px" mg="10px 0">
          <AreaComp wd="12" noPd>
            <Input label="Código:" type="text" name="code" disabled />
          </AreaComp>
          <AreaComp wd="70" noPd>
            <Input
              maxLength={100}
              label="Descrição:"
              type="text"
              name="description"
            />
          </AreaComp>
          <AreaComp wd="22" noPd>
            <Input label="Tag:" type="text" name="tag" />
          </AreaComp>
        </Row>
      </Form>
    </S.Container>
  );
};

export default TabRegister;
