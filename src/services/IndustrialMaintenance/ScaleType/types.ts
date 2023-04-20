export interface ScaleTypeData {
  id: number;
  companyId: number;
  code: number;
  userId: number;
  dateAt: string;
  workDays: number;
  offDays: number;
  description: string;
}

export interface PostScaleTypeRequestParams {
  workDays: number;
  offDays: number;
  description: string;
}

export interface PatchtScaleTypeRequestParams
  extends PostScaleTypeRequestParams {
  id: number;
}
