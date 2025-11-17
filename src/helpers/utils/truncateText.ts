export const truncateText = (value: string, maxLength: number) => {
  if (!value) return undefined;
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
};