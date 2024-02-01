export const setActualAgent = (value: string) => {
  if (value === "new") {
    window.localStorage.removeItem("agent");
  } else {
    window.localStorage.setItem("agent", value);
  }
};

export const getActualAgent = () => {
  return localStorage.getItem("agent");
};
