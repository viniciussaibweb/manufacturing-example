import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  .datepicker-container {
    display: flex;
    justify-content: space-between;
    padding-left: 2px;
    padding-right: 2px;
  }

  div.MuiFormControl-root.MuiTextField-root.input_cad {
    background: #fff;
  }

  .datepicker-saib {
    background-color: #7d46bb !important;
  }

  input.MuiInputBase-input.MuiInput-input:hover,
  .MuiInputBase-root.MuiInput-root.MuiInput-underline.MuiInputBase-formControl.MuiInput-formControl:hover,
  .MuiInput-underline:hover:not(.Mui-disabled):before,
  .MuiInput-underline:after,
  .MuiInput-underline:before {
    border: none !important;
    border-bottom: none !important;
  }
  input.MuiInputBase-input.MuiInput-input ::before {
    border: none !important;
    border-bottom: none !important;
  }
  input.MuiInputBase-input.MuiInput-input ::after {
    border: none !important;
    border-bottom: none !important;
  }
`;

export const ContentToolbarDatePicker = styled.div`
  height: 15%;
  width: 100%;
`;

export const LineTimeDateAndTime = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid #efefef;
`;

export const DescriptionDate = styled.h2`
  font-weight: 500;
  padding: 5px 10px;
  cursor: pointer;
`;
export const DescriptionTime = styled.h2`
  font-weight: 500;
  padding: 5px 10px;
  cursor: pointer;
`;

export const LineButtonsHeaderDatePicker = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;

  padding: 10px 0;
`;

export const ButtonControllYesterday = styled.button`
  box-sizing: border-box;
  border: none;
  background: transparent;
  padding: 0 10px;
`;

export const ButtonControllTomorrow = styled.button`
  box-sizing: border-box;
  border: none;
  background: transparent;
  padding: 0 10px;
`;

export const ContainerDatePicker = styled.div`
  font-weight: 700;
  flex-direction: column;
  display: flex;
  width: 100%;

  .react-datepicker__input-time-container {
    display: flex;
    flex-wrap: nowrap;
  }

  .react-datepicker-time__input-container {
    width: 75%;
  }

  div.react-datepicker-time__input {
    border: none !important;
    width: 100% !important;
    margin-left: 5px !important;
  }

  input.react-datepicker-time__input {
    box-sizing: border-box;
    border: 1px solid #cac8c8 !important;
    border-radius: 5px;
    padding: 4px;
    outline: 0;
    margin-left: 5px;
    width: 100% !important;
  }

  .react-datepicker-popper {
    z-index: 999 !important;
  }

  .react-datepicker-time__input {
    margin: 0 !important;

    .input_cad.time {
      /* padding-left: 0; */
    }
  }

  .react-datepicker__input-container {
    input {
      font-size: 0.9rem !important;
      font-weight: 700 !important;

      /* height: 30px; */
    }
  }

  .react-datepicker {
    border: unset;
    box-shadow: -1px 1px 5px 1px rgba(0, 0, 0, 0.1);
    button {
      background-color: ${colors.primaria};
    }
  }

  .react-datepicker__triangle {
    display: none;
  }
  .react-datepicker__day:hover {
    background-color: ${colors.primaria_intermediaria} !important;
    color: #fff !important;
  }

  .react-datepicker__day--selected {
    background-color: ${colors.primaria}!important;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: white;
    color: rgba(0, 0, 0);
  }

  .react-datepicker__header {
    background-color: ${colors.primaria};
  }

  .react-datepicker__header div {
    color: white !important;
  }
  .react-datepicker__header {
    border-bottom: unset;
  }

  .react-datepicker__today-button {
    background: #8e44ad;
    color: white;
    border-top: unset;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .react-datepicker__header {
    color: white;
  }

  .react-datepicker__month--selected {
    background-color: #bf1f7c;
  }

  .react-datepicker__month-text:hover {
    background-color: #bf1f7c4f !important;
  }

  .react-datepicker__month--selected {
    background-color: #bf1f7c !important;
  }

  .react-datepicker__day--in-range {
    background-color: #bf1f7c !important;
  }
`;
