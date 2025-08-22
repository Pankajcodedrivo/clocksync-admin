import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const pageList = catchAsync(
  async (payload: any, currentPage: number, limit: number = 10) => {
    const data = await httpsCall.post(
      `/admin/page/list/${currentPage}/${limit}`,
      payload
    );
    return data;
  }
);

export const pageDetails = catchAsync(async (uid) => {
  const response = await httpsCall.get(`/admin/page/view-page/${uid}`);
  return response;
});
/*
export const addPage = catchAsync(async (values) => {
  const data = await httpsCall.post(`/admin/page/add-page`, values);
  return data;
});
*/
export const deletePage = catchAsync(async (uid) => {
  const data = await httpsCall.delete(`/admin/page/delete-page/${uid}`);
  return data;
});

export const updatePage = catchAsync(async (values, uid) => {
  const data = await httpsCall.patch(`/admin/page/update-page/${uid}`, values);
  return data;
});
