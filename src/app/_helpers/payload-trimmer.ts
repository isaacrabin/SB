// Takes in the paramter object, finds key that their values are strings and trims the values
export const trimPayload = (payload: any) => {
  Object.keys(payload).map(
    (k) =>
      (payload[k] =
        typeof payload[k] === 'string' ? payload[k].trim() : payload[k])
  );
};
