"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "..";

type IsLoading = boolean;
export const slice = createSlice({
  name: "loading",
  initialState: {
    loading: false,
  },
  reducers: {
    setIsLoading: (state, { payload }: PayloadAction<IsLoading>) => {
      return {
        loading: payload,
      };
    },
  },
});

export const { setIsLoading } = slice.actions;

export const useLoading = () => {
  const dispacth = useDispatch();
  const { loading } = useSelector((state: RootState) => state.loading);
  const setIsLoading_ = (isLoading: boolean) =>
    dispacth(setIsLoading(isLoading));

  return {
    loading,
    setIsLoading: setIsLoading_,
  };
};
export default slice.reducer;
