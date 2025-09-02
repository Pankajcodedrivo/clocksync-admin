import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getScoreKeeperCode = catchAsync(async (gameId: string) => {
  const data= await httpsCall.post("/scoreKeeper/code", { gameId });
  return data; // return only the one-time code
});
