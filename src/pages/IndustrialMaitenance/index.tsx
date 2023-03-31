"use client";
import React, { useEffect, useRef, useState } from "react";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { FaClipboard } from "react-icons/fa";

import { ApiService, ApiTypes } from "../../services/api/index";

import { PageContainer, Wrapper } from "./styles";

import { ToolbarButtonWarning, Toolbar } from "../../styles/global";

import { MdClose, MdSearch } from "react-icons/md";
import { BootstrapTooltip } from "../../components/Tooltip/index";

import { toast } from "react-toastify";

import TabList from "./TabList";
import { ToolsProvider, useTools } from "@/hooks/IndustrialMaintenance/useTool";
import Tab from "@/components/Tab";
import TabRegister from "./TabRegister";

const IndustrialMaitenance: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [idEdicao, setIdEdicao] = useState<number>();
  const { filterTools } = useTools();
  const [tabActive, setTabActive] = useState(0);

  const formCadastroRef: React.RefObject<FormHandles> =
    useRef<FormHandles>(null);
  const formGerenceMaitenace: React.RefObject<FormHandles> =
    useRef<FormHandles>(null);

  const api = ApiService.getInstance(ApiTypes.MAINTENANCE);

  const toastOptions = {
    autoClose: 4000,
    position: toast.POSITION.TOP_CENTER,
  };

  const [, setGridInstance] = useState({ api: {}, columnApi: {} });
  const onGridReady = (params: any) => {
    setGridInstance({ api: params.api, columnApi: params.columnApi });
    params.api.sizeColumnsToFit();
  };

  useEffect(() => {
    filterTools();
  }, []);

  const handleEdit = async (params: { mafeDescricao: string }) => {
    if (!params.mafeDescricao) {
      toast.error("A descrição não pode estar vazia!", toastOptions);
      setVisible(false);
      return;
    }
    try {
      const objRequest = {
        mafeDescricao: params.mafeDescricao,
      };
      await api.patch(`/industrial-maintenance/tool/${idEdicao}`, objRequest);
      filterTools();
      setVisible(false);
    } catch (err) {
      toast.error(`Falha ao alterar o cadastro. Motivo: ${err}`, toastOptions);
      setVisible(false);
    }
  };

  const handleExcluir = async (params: { data: { mafeId: number } }) => {
    try {
      const idMafe = params.data.mafeId;
      await api.delete(`/industrial-maintenance/tool/${idMafe}`);
      toast.success("Item deletado com sucesso!");
      filterTools();
    } catch (err) {
      toast.error(
        `Não foi possível excluir o cadastro. Motivo: ${err}`,
        toastOptions
      );
    }
  };

  const handleActionSubmit = async (
    formData: { mafeDescricao: string },
    { reset }: { reset: () => void }
  ) => {
    try {
      formCadastroRef.current?.setErrors({});

      const schema = Yup.object().shape({
        mafeDescricao: Yup.string().required("O campo é obrigatório"),
      });

      await schema.validate(formData, {
        abortEarly: false,
      });
      const objRequest = {
        mafeDescricao: formData.mafeDescricao,
      };
      await api.post("/industrial-maintenance/tool", objRequest);

      reset();

      filterTools();
    } catch (err) {
      const validationErrors: Record<string, string> = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error: Yup.ValidationError) => {
          const path = error.path!;
          const message = error.message;
          validationErrors[path] = message;
        });
        formCadastroRef.current?.setErrors(validationErrors);
      } else {
        toast.error(`Falha ao Salvar o cadastro. Motivo: ${err}`, toastOptions);
      }
    }
  };

  const handleOpenEdit = async (params: {
    data: { mafeDescricao: string; mafeId: number };
  }) => {
    const description = params.data.mafeDescricao;

    formGerenceMaitenace.current?.setFieldValue("mafeDescricao", description);
    setIdEdicao(params.data.mafeId);
    setVisible(true);
  };

  const searchMafe = async () => {
    const mafeDescricao =
      formCadastroRef.current?.getFieldValue("mafeDescricao");

    try {
      const Response = await api.get(
        `/industrial-maintenance/tool?filter=${mafeDescricao}`
      );
      const mafe = Response.data;
      // setListIndustrialMaitenance(mafe);
    } catch (err) {}
  };

  function closeDialog() {
    setVisible(false);
  }

  // const gridColumnDef = [
  //   {
  //     field: "mafeEmpId",
  //     headerName: "AÇÕES",
  //     minWidth: 100,
  //     maxWidth: 200,
  //     lockVisible: true,
  //     cellRenderer(params: CellRendererParams) {
  //       return (
  //         <>
  //           <BootstrapTooltip title="Excluir" placement="top">
  //             <button
  //               type="button"
  //               className="grid-button"
  //               onClick={() => handleExcluir(params)}
  //             >
  //               <MdDelete size={20} color="#61098a" />
  //             </button>
  //           </BootstrapTooltip>
  //           <BootstrapTooltip title="Editar" placement="top">
  //             <button
  //               type="button"
  //               className="grid-button"
  //               onClick={() => handleOpenEdit(params)}
  //             >
  //               <MdModeEdit size={20} color="#61098a" />
  //             </button>
  //           </BootstrapTooltip>
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     field: "mafeCodigo",
  //     headerName: "CÓDIGO",
  //     minWidth: 80,
  //     maxWidth: 100,
  //     sortable: true,
  //     resizable: true,
  //     filter: true,
  //     lockVisible: true,
  //     cellStyle: { fontWeight: "bold" },
  //   },
  //   {
  //     field: "mafeDescricao",
  //     headerName: "DESCRIÇÃO",
  //     sortable: true,
  //     resizable: true,
  //     // headerClass: "ag-header-cell-editable",
  //     // cellEditorFramework: GridInput,
  //     filter: true,
  //     lockVisible: true,
  //   },
  // ];
  return (
    <Wrapper>
      <PageContainer>
        <Toolbar>
          {/* <BootstrapTooltip
            title="Confirmar Cadastro"
            placement="bottom"
            onClick={() => formCadastroRef.current?.submitForm()}
          >
            <ToolbarButtonConfirm>
              <MdSave size={21} color="#fff" />
            </ToolbarButtonConfirm>
          </BootstrapTooltip>
          <BootstrapTooltip title="Pesquisar" placement="bottom">
            <ToolbarButton type="button" onClick={searchMafe}>
              <MdSearch size={25} color="#fff" />
            </ToolbarButton>
          </BootstrapTooltip> */}

          <span className="title">TOOLS</span>
          <BootstrapTooltip title="Voltar para Dashboard" placement="top">
            <ToolbarButtonWarning type="button">
              <MdClose size={21} color="#fff" />
            </ToolbarButtonWarning>
          </BootstrapTooltip>
        </Toolbar>

        <Tab
          tabActive={tabActive}
          onChange={(index) => setTabActive(index)}
          tabItems={[
            {
              component: <TabList />,
              title: {
                icon: <MdSearch size={20} />,
                label: "Lista configurações",
              },
            },
            {
              component: <TabRegister />,
              title: {
                icon: <FaClipboard size={20} />,
                label: "Cadastrar/editar",
              },
            },
          ]}
        />
        {/* <PageBody>
          <BoxComponentes>
            <FormContainer>
              <Form ref={formCadastroRef} onSubmit={handleActionSubmit}>
                <BoxComponentes>
                  <AreaComp wd="99" noPd>
                    <Input
                      label="Descrição:"
                      type="text"
                      name="mafeDescricao"
                    />
                  </AreaComp>
                </BoxComponentes>
              </Form>
            </FormContainer>
          </BoxComponentes>

          <BoxComponentes>
            <AreaComp>
              <GridContainer>
                <section className="ag-theme-alpine">
                  <AgGridReact
                    columnDefs={gridColumnDef}
                    rowData={listIndustrialMaitenance}
                    rowSelection="single"
                    animateRows
                    onGridReady={onGridReady}
                    gridOptions={{ localeText: AgGridTranslation }}
                  />
                </section>
              </GridContainer>
            </AreaComp>
          </BoxComponentes>
        </PageBody> */}
      </PageContainer>

      {/* <Dialog
        isOpen={visible}
        closeDialogFn={closeDialog}
        title="Editar Tools"
        size="sm"
      >
        <Container>
          <AreaConsult ptop="18px" pleft="18px" pright="10px">
            <Form ref={formGerenceMaitenace} onSubmit={handleEdit}>
              <BoxComponentes pdtop="12">
                <AreaComp wd="auto">
                  <Input label="Descrição:" type="text" name="mafeDescricao" />
                </AreaComp>

                <AreaComp hver wd="30" ptop="15px">
                  <button type="submit" className="btn1">
                    Salvar
                    <MdSave size={25} color="#fff" />
                  </button>
                </AreaComp>
              </BoxComponentes>
            </Form>
          </AreaConsult>
        </Container>
      </Dialog> */}
    </Wrapper>
  );
};

export default () => (
  <ToolsProvider>
    <IndustrialMaitenance />
  </ToolsProvider>
);
