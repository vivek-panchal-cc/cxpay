const pendingRequests = new Map();
// Generate a unique key for each request
const getRequestKey = (config) => {
  return `${config.method}:${config.url}`;
};
// Add a request to the pending list
const addPendingRequest = (config) => {
  const requestKey = getRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    return false; // Request is already in progress, prevent duplicate
  }
  pendingRequests.set(requestKey, config);
  return true;
};
// Remove a request from the pending list
const removePendingRequest = (config) => {
  const requestKey = getRequestKey(config);
  pendingRequests.delete(requestKey);
};
export { addPendingRequest, removePendingRequest };
