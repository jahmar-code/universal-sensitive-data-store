import { useState } from "react";
import { useForm } from "react-hook-form";

interface FetchDataFormInputs {
  data: string;
}

export default function FetchDataForm() {
  const { register, handleSubmit, reset } = useForm<FetchDataFormInputs>();
  const [resultTitles, setResultTitles] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (formData: FetchDataFormInputs) => {
    setError(null);
    setResultTitles(null);
    setLoading(true);
    try {
      // fetch data and compare with user input, return matching title(s)
      const response = await fetch("/api/sensitiveData/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: formData.data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch data.");
      }

      const responseData = await response.json();
      setResultTitles(responseData.titles);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResultTitles(null);
    setError(null);
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl mb-4">Fetch Data</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 border p-4 rounded-md"
      >
        <div className="mb-2">
          <label className="block mb-1">Data Input</label>
          <input
            {...register("data", { required: true })}
            className="w-full border px-3 py-2 text-black rounded-md"
            type="text"
            placeholder="Enter data to fetch"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-400"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-500"
          >
            Reset
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex items-center justify-center mb-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
        </div>
      )}

      {resultTitles && resultTitles.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md text-black">
          <p>Data found! Matching Title(s):</p>
          <ul>
            {resultTitles.map((title, index) => (
              <li key={index}>
                <strong>{title}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && (
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
