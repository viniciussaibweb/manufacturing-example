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
   /* height: calc(100vh - 370px);  */
  padding-top: 10px;
  padding-left: 10px;
  height: 25rem;
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
  height: 300px;
  padding: 5px 5px 10px 5px;
  /* overflow: auto; */

  section {
    width: 100%;
  }
  .ag-theme-alpine {
    /* height: calc(100vh - 488px) !important; */
    height: 25rem;
  }
`;

export const WrapperTab = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const ToolbarContainer = styled.div`
  width: 100%;
  height: 40vh;
  background-color: #4d2679;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  /* position: fixed;
  top: 100px; */
  height: auto;
  z-index: 152;

`;
export const ToolbarDescription = styled.div`
  background: #eee9f4;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  z-index: 152;
  width: 100%;
  height: 5vh;
  color: #4d2679;
  align-items: center;

  h5:not(:first-child) {
    margin-left: 5rem;
  }
  h5{
    margin-left: 1.3rem;
  }
  
`;