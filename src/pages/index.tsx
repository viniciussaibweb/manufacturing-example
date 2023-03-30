import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  color: #61098a;
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>Saibweb</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <h1>home</h1>
      </Container>
    </>
  );
}
