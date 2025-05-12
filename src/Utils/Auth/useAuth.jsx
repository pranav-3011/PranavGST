//useAuth.js

export const useAuth = () => {
  //getting userData from local storage
  const userData = localStorage.getItem("userData");
  //checking whether userData is present or not
  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      return parsedData.access ? true : false;
    } catch (error) {
      console.error('Error parsing userData:', error);
      return false;
    }
  }
  return false;
};
