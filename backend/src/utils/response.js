export const sendSuccess = (res, status = 200, payload = {}, maybeData) => {
  if (typeof payload === 'string') {
    const data = maybeData?.data !== undefined ? maybeData.data : maybeData;
    const extra = typeof maybeData === 'object' && maybeData !== null && !Array.isArray(maybeData) ? maybeData : {};
    return res.status(status).json({
      success: true,
      status,
      message: payload,
      ...(data !== undefined ? { data } : {}),
      ...extra,
    });
  }

  return res.status(status).json({
    success: true,
    status,
    ...payload,
  });
};

export const sendError = (res, status = 400, message = 'Request failed', data = {}) => res.status(status).json({
  success: false,
  status,
  message,
  data,
});
