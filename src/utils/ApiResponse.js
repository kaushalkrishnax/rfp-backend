export const ApiResponse = (
  res,
  statusCode = 200,
  data = null,
  message = ""
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    data,
    message,
  });
};
