import styled from "styled-components";

export const ToolbarInnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #4d2679;

  span {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    margin-top: 4px;
  }

  .my-tooltip + .my-tooltip {
    margin-left: 0;
  }
`;

export const PageBody = styled.div`
  width: 100%;
  /* height: calc(100vh - 202px); */
  padding-top: 10px;
  padding-left: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const FormContainer = styled.div`
  width: 100%;
  padding-left: 3px;
  padding-bottom: 15px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  justify-items: left;
`;

export const GridContainer = styled.div`
  width: 100%;
  height: calc(100vh - 280px);
  padding: 5px 5px 10px 5px;
  /* overflow: auto; */

  section {
    width: 100%;
  }
  .ag-theme-alpine {
    height: calc(100vh - 488px) !important;
  }
`;

export const WrapperTab = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
