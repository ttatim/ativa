export const isUUID = (uuid: string): boolean => {
  const s = '' + uuid;
  const test = s.match(
    '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
  );
  if (test === null) {
    return false;
  }
  return true;
};
