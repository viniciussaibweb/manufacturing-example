import { DefaultResponseApi } from "@/interfaces/default";
import { ApiService } from "../api";
import {
  AuthenticateParams,
  ChangeCompanyParams,
  DataChangeCompanyResponse,
  GetAuthorizedCompaniesParams,
  GetModulesParams,
} from "./types";

export class AuthService {
  private api = ApiService.getInstance("EMISSORES");

  async getAuthorizedCompanies(params: GetAuthorizedCompaniesParams) {
    const { username, password, empId } = params;
    const empr = empId || 0;
    const response = await this.api.post("v1/accounts/authenticate", {
      username,
      password,
      EMP_ID: empr,
    });
    return response;
  }

  async authenticate(params: AuthenticateParams) {
    const res = await this.api.post("v1/accounts/authenticate", params);

    const { success, retorno } = res.data;
    if (success) {
      localStorage.setItem("token", retorno.token);
    }
    return res;
  }

  async getUserType(idUser: number) {
    const api = ApiService.getInstance("EMISSORES");
    const responseTipo = await api.get(`/v1/users/user_tipo/${idUser}`);
    const { TIPO } = responseTipo.data.retorno[0];
    return TIPO;
  }

  async getModules(userParams: GetModulesParams) {
    const api = ApiService.getInstance("SAIBWEB");
    const urlModulos =
      String(userParams.usr_tipo) === "1"
        ? `/v1/system/modulos_menu`
        : `/v1/system/user_group_link/${userParams.usr_id}`;

    const { data } = await api.get(urlModulos);

    return data;
  }

  async changeCompany(
    params: ChangeCompanyParams
  ): Promise<DefaultResponseApi<DataChangeCompanyResponse>> {
    const api = ApiService.getInstance("EMISSORES");

    const res = await api.post("v1/accounts/changeEmp", params);

    return res.data;
  }
}
