const buildQuery = (params: Record<string, any>) => {
  const queryParams = new URLSearchParams(params);
  return queryParams.toString();
};

export default buildQuery;
