import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 1rem;
  }
`;

export default function Custom404() {
  return (
    <Container>
      <h1>Pagina não encontrada :( </h1>
    </Container>
  );
}
