import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EssayAnswerSliceState {
  essayAnswer: string | null;
}

const initialState: EssayAnswerSliceState = {
  essayAnswer: null,
};

export const essayAnswerSlice = createSlice({
  name: "essayAnswer",
  initialState,
  reducers: {
    setEssayAnswer: (state: any, action: PayloadAction<string>) => {
      state.essayAnswer = action.payload;
    },
    resetEssayAnswer: (state: any) => {
      console.log("aaaa");
      state.essayAnswer = null;
    }
  }
});

export const { setEssayAnswer, resetEssayAnswer } = essayAnswerSlice.actions;

export default essayAnswerSlice.reducer;
