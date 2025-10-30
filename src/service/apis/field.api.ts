import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const fieldList = catchAsync(
  async (currentPage: number, limit: number = 10, params: any = {}) => {
    const data = await httpsCall.get(
      `/admin/field/list/${currentPage}/${limit}`,
      { params }   // if params = {}, Axios won’t add ?query
    );
    return data;
  }
);


export const fieldDetails = catchAsync(async (uid) => {
  const response = await httpsCall.get(`/admin/field/detail/${uid}`);
  return response;
});

export const addField = catchAsync(async (values) => {
  const data = await httpsCall.post(`/admin/field/create`, values);
  return data;
});

export const deleteField = catchAsync(async (uid) => {
  const data = await httpsCall.delete(`/admin/field/delete/${uid}`);
  return data;
});

export const updateField = catchAsync(async (values, uid) => {
  const data = await httpsCall.patch(`/admin/field/update/${uid}`, values);
  return data;
});

export const updateUniversalClock = catchAsync(async (values, uid) => {
  const data = await httpsCall.patch(`/admin/field/update-universal-clock/${uid}`, values);
  return data;
});
