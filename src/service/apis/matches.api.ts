import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const matchApi = catchAsync(async (values: any) => {
  const searchQuery = values.search || "";
  const data = await httpsCall.get(`/admin/match/list-match/${values.currentPage}/${values.limit}
    ?search=${searchQuery}`,values);
  return data;
});
export const matchesDetails = catchAsync(async (id: any, values: any) => {
  const response = await httpsCall.get(`/admin/match/detail-match/${id}`);
  return response;
});

export const addMatch = catchAsync(async (values: any) => {
  const data = await httpsCall.post(`/admin/match/add-match`, values);
  return data;
});

export const deleteMatch = catchAsync(async (uid) => {
  const data = await httpsCall.delete(`/admin/match/delete-match/${uid}`);
  return data;
});

export const updateMatch = catchAsync(async (id, values: any) => {
  const data = await httpsCall.patch(`/admin/match/update-match/${id}`, values);
  return data;
});

export const teamlistApi = catchAsync(async (values: any) => {
    const data = await httpsCall.post(`/admin/team/search-team`,values);
    return data;
  });

// Round
  export const roundList = catchAsync(async (values: any) => {
    const data = await httpsCall.get(`/admin/round/allrounds`,values);
    return data;
  });
  export const roundDetails = catchAsync(async (id: any, values: any) => {
    const response = await httpsCall.get(`/admin/round/edit-round/${id}`);
    return response;
  });
  
  export const addRoundSchedule = catchAsync(async (values: any) => {
    const data = await httpsCall.post(`/admin/round/roundadd`, values);
    return data;
  });
  
  export const deleteRound = catchAsync(async (uid) => {
    const data = await httpsCall.delete(`/admin/round/delete-round/${uid}`);
    return data;
  });
  
  export const updateRoundSchedule = catchAsync(async (id, values: any) => {
    const data = await httpsCall.patch(`/admin/round/update-round/${id}`, values);
    return data;
  });
  