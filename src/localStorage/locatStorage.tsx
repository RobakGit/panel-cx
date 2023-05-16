export const setActualAgent = (value: string) => {
  window.localStorage.setItem("agent", value);
};

export const getActualAgent = () => {
  return localStorage.getItem("agent");
};
