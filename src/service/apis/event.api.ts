import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const eventList = catchAsync(
  async (currentPage: number, limit: number = 10, params: any = {}) => {
    const data = await httpsCall.get(
      `/admin/event/list/${currentPage}/${limit}`,
      { params }   // if params = {}, Axios won’t add ?query
    );
    return data;
  }
);
export const eventDetails = catchAsync(async (uid) => {
  const response = await httpsCall.get(`/admin/event/detail/${uid}`);
  return response;
});

export const addEvent = catchAsync(async (values) => {
  const data = await httpsCall.post(`/admin/event/create`, values);
  return data;
});

export const deleteEvent = catchAsync(async (uid) => {
  const data = await httpsCall.delete(`/admin/event/delete/${uid}`);
  return data;
});

export const updateEvent = catchAsync(async (values, uid) => {
  const data = await httpsCall.patch(`/admin/event/update/${uid}`, values);
  return data;
});

export const getUpcomingEvent = catchAsync(async () => {
  const data = await httpsCall.get(`/admin/event/list-current-event`);
  return data;
});
export const downloadEventData = catchAsync(async (eventId: string) => {
  const response = await httpsCall.get(
    `/admin/event/export/${eventId}`,
    {
      responseType: "blob", // IMPORTANT: Excel file
    }
  );

  return response;
})