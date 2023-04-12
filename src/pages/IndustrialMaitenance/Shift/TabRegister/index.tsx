import React, { useState, useMemo } from "react";
import * as S from "./styles";
import { Form } from "@unform/web";
import { AreaComp, Row, Toolbar, ToolbarButton } from "@/styles/global";

import { MdSave } from "react-icons/md";
import { BootstrapTooltip } from "@/components/Tooltip";
import { useShift } from "@/hooks/IndustrialMaintenance/useShift";

import Input from "@/components/Input";
import DatePickerInput from "@/components/DataPickerInput";

const TabRegister: React.FC = () => {
  const {
    formRegisterRef,
    saveShift,
    startTime,
    endTime,
    startBreakTime,
    endBreakTime,
    minTime,
    maxTime,
    onChangeStartTime,
    onChangeEndTime,
    onChangeStartBreackTime,
    onChangeEndBreackTime,
  } = useShift();

  const endTimeError = useMemo(() => {
    if (startTime > endTime) {
      return "A hora final deve ser maior que a hora inicial.";
    } else {
      return "";
    }
  }, [startTime, endTime]);

  const endBreackTimeError = useMemo(() => {
    if (startBreakTime > endBreakTime) {
      return "A hora final deve ser maior que a hora inicial.";
    } else {
      return "";
    }
  }, [startBreakTime, endBreakTime]);

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

      <Form ref={formRegisterRef} onSubmit={saveShift}>
        <Row gp="10px" mg="10px 0">
          <AreaComp wd="20" noPd>
            <Input label="Código:" type="text" name="code" disabled />
          </AreaComp>
          <AreaComp wd="60" noPd>
            <Input
              maxLength={100}
              label="Descrição:"
              type="text"
              name="description"
            />
          </AreaComp>
        </Row>
        <Row gp="10px" mg="10px 0">
          <AreaComp wd="40" noPd>
            <DatePickerInput
              label="Hora de início do turno:"
              onChangeDate={onChangeStartTime}
              value={startTime}
              dateAndTime
              minDate={minTime ? minTime : undefined}
              maxDate={maxTime ? maxTime : undefined}
            />
          </AreaComp>
          <AreaComp wd="40" noPd>
            <DatePickerInput
              label="Hora de fim do turno:"
              onChangeDate={onChangeEndTime}
              value={endTime}
              dateAndTime
              minDate={minTime ? minTime : undefined}
              maxDate={maxTime ? maxTime : undefined}
              error={endTimeError}
            />
          </AreaComp>
        </Row>
        <Row gp="10px" mg="10px 0">
          <AreaComp wd="40" noPd>
            <DatePickerInput
              label="Hora de início do intenvalo:"
              onChangeDate={onChangeStartBreackTime}
              value={startBreakTime}
              dateAndTime
              minDate={minTime ? minTime : undefined}
              maxDate={maxTime ? maxTime : undefined}
            />
          </AreaComp>
          <AreaComp wd="40" noPd>
            <DatePickerInput
              label="Hora de fim do intenvalo:"
              onChangeDate={onChangeEndBreackTime}
              value={endBreakTime}
              dateAndTime
              minDate={minTime ? minTime : undefined}
              maxDate={maxTime ? maxTime : undefined}
              error={endBreackTimeError}
            />
          </AreaComp>
        </Row>
      </Form>
    </S.Container>
  );
};

export default TabRegister;
