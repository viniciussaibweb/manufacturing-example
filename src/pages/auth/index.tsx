"use client";

import Input from "@/components/Input";
import Image from "next/image";
import React, { useRef } from "react";
import { BoxLogo } from "./styles";
import logo from "@/assets/logo.png";
import { Form } from "@unform/web";
import { useAuth } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { AuthenticateParams } from "@/services/auth/types";
import { FormHandles } from "@unform/core";
import { useLoading } from "@/store/loadingSlice";

const Auth: React.FC = () => {
  const frmLogin = useRef<FormHandles>(null);
  const { signIn, authData } = useAuth();
  const { setIsLoading } = useLoading();
  const route = useRouter();

  const loading = false;

  const schema = Yup.object().shape({
    username: Yup.string().required("O login é obrigatório"),
    password: Yup.string().required("A senha é obrigatória"),
  });

  async function handleSubmit({ username, password }: AuthenticateParams) {
    try {
      const formData = frmLogin?.current?.getData();
      await schema.validate(formData, {
        abortEarly: false,
      });
      setIsLoading(true);
      await signIn({ username, password, empId: Number(authData?.emp_id) });
      setIsLoading(false);

      // route.push("/main");
    } catch (err) {
      const validationErrors: any = {};
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          if (!error.path) {
            return;
          }
          validationErrors[error.path] = error.message;
        });
        frmLogin.current?.setErrors(validationErrors);
      }
    }
  }

  return (
    <>
      <BoxLogo>
        <Image src={logo} alt="SaibWeb" priority placeholder="blur" />

        <h1>Login</h1>

        <Form ref={frmLogin} onSubmit={handleSubmit}>
          <Input type="text" name="username" label="Usuário" />
          <Input id="password" name="password" label="Senha" type="password" />

          <button type="submit">{loading ? "Carregando..." : "Acessar"}</button>
        </Form>
      </BoxLogo>
    </>
  );
};

export default Auth;
