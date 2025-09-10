import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getScoreKeeperCode = catchAsync(async (gameId: string) => {
  const data= await httpsCall.post("/scoreKeeper/code", { gameId });
  return data; // return only the one-time code
});

export const getScoreKeeperList = catchAsync(async (currentPage: number, limit: number = 10, params: any = {}) => {
  const data = await httpsCall.post(
    `/scoreKeeper/all-scorekeeper/${currentPage}/${limit}`,
    {params}
  );
  return data;
});