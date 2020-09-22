export const rpcController = (handler) => async (call, callback) => {
  try {
    const result = await handler(call.request);
    return callback(null, result);
  } catch (err) {
    return callback(err);
  }
}
