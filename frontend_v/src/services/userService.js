export const fetchUsersByRole = async (role, token) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user-info/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      console.log("API Response:", data);  // ✅ Debugging
  
      if (!Array.isArray(data)) {
        console.error("Error: API did not return an array!", data);
        return [];  // Empty array return to avoid .filter error
      }
  
      return data.filter(user => user.role?.toLowerCase() === role.toLowerCase());
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  