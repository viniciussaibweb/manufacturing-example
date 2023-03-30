/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";

import loadingImg from "../../assets/loading.gif";
/* ======== Styles ========== */
import { BaseModal, ModalContent, TitleBar, CModal, ModalBody } from "./styles";
import Image from "next/image";
import { AreaConsult, Container } from "@/styles/global";
import DialogLoadingContainer from "./dialog-loading-container";
/* ======== Styles ========== */

const DialogLoading = ({ isOpen }: { isOpen: boolean }) => (
  <DialogLoadingContainer isOpen={isOpen}>
    <BaseModal isOpen={isOpen}>
      <ModalContent>
        <TitleBar wd="100%">
          <h1>Carregando...</h1>
        </TitleBar>
        <CModal wd="100%" hg="170px">
          <Container>
            <AreaConsult ptop="18px" pleft="14px">
              <ModalBody>
                <h2>Aguarde, Processando Informações...</h2>
                <Image src={loadingImg} alt="Carregando" />
              </ModalBody>
            </AreaConsult>
          </Container>
        </CModal>
      </ModalContent>
    </BaseModal>
  </DialogLoadingContainer>
);

export default DialogLoading;

DialogLoading.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};
