import { ApiService, ApiTypes } from "../../api";
import {
  PatchtScaleTypeRequestParams,
  PostScaleTypeRequestParams,
  ScaleTypeData,
} from "./types";

export class ScaleTypeService {
  private api = ApiService.getInstance(ApiTypes.MAINTENANCE);
  private baseUrl = "/industrial-maintenance/scale-type";

  async getAll(filter?: string): Promise<Array<ScaleTypeData>> {
    const params = {
      filter: filter,
    };
    const response = await this.api.get(this.baseUrl, {
      params: params,
    });

    return response.data;
  }

  async getById(id?: number): Promise<Array<ScaleTypeData>> {
    const response = await this.api.get(`${this.baseUrl}/${id}`);

    if (Object.keys(response.data).length) {
      return [response.data];
    }
    return response.data;
  }

  async deleteTool(mafeId: number) {
    return await (
      await this.api.delete(`${this.baseUrl}/${mafeId}`)
    ).data;
  }

  async postScaleType(paramsScaleType: PostScaleTypeRequestParams) {
    const objRequest = {
      description: paramsScaleType.description,
      workDays: paramsScaleType.workDays,
      offDays: paramsScaleType.offDays,
    };
    return await (
      await this.api.post(this.baseUrl, objRequest)
    ).data;
  }

  async patchScaleType(paramsScaleType: PatchtScaleTypeRequestParams) {
    const objRequest = {
      description: paramsScaleType.description,
      workDays: paramsScaleType.workDays,
      offDays: paramsScaleType.offDays,
    };

    return await (
      await this.api.patch(`${this.baseUrl}/${paramsScaleType.id}`, objRequest)
    ).data;
  }
}
