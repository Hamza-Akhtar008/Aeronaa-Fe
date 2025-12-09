export const setAuth = (data: { access_token: string; role: string; id: number }) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

export const getAuth = () => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to parse auth:", error);
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem("auth");
};