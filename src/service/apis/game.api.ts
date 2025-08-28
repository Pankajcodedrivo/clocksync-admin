import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const gameList = catchAsync(
  async (currentPage: number, limit: number = 10, params: any = {}) => {
    const data = await httpsCall.get(
      `/admin/game/list/${currentPage}/${limit}`,
      { params }   // if params = {}, Axios won’t add ?query
    );
    return data;
  }
);
export const gameDetails = catchAsync(async (uid) => {
  const response = await httpsCall.get(`/admin/game/detail/${uid}`);
  return response;
});

export const addGame = catchAsync(async (values) => {
  const data = await httpsCall.post(`/admin/game/create`, values);
  return data;
});

export const deleteGame = catchAsync(async (uid) => {
  const data = await httpsCall.delete(`/admin/game/delete/${uid}`);
  return data;
});

export const updateGame = catchAsync(async (values, uid) => {
  const data = await httpsCall.patch(`/admin/game/update/${uid}`, values);
  return data;
});

export const getallfield = catchAsync(async (uid) => {
  const response = await httpsCall.get(`/admin/game/getallfield`);
  return response;
});

export const getallScorekeeper = catchAsync(async (uid) => {
  const response = await httpsCall.get(`/admin/game/getallScorekeeper`);
  return response;
});
