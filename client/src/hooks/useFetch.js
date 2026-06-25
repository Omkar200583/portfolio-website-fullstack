import { useState } from "react";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (callback) => {
    try {
      setLoading(true);
      setError(null);
      const result = await callback();
      return result;
    } catch (err) {
      setError(err.message || "Something went wrong");
      throw err; // Re-throw to handle in component if needed
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchData,
  };
};

export default useFetch;