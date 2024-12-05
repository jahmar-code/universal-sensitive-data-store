import { SensitiveData } from "../types/types";
import { useState } from "react";
import DataForm from "./DataForm";

interface DataListProps {
  dataList: SensitiveData[];
  setDataList: React.Dispatch<React.SetStateAction<SensitiveData[]>>;
}

export default function DataList({ dataList, setDataList }: DataListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingData, setEditingData] = useState<SensitiveData | null>(null);
  const [error, setError] = useState("");

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/sensitiveData/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete data.");
      }

      setDataList(dataList.filter((data) => data.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={() => setIsAdding(true)}
        className="mb-4 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-400"
      >
        Add New Data
      </button>

      {isAdding && (
        <DataForm
          setIsAdding={setIsAdding}
          setDataList={setDataList}
          dataList={dataList}
        />
      )}

      {editingData && (
        <DataForm
          data={editingData}
          setEditingData={setEditingData}
          setDataList={setDataList}
          dataList={dataList}
        />
      )}

      <ul>
        {dataList.map((data) => (
          <li key={data.id} className="border p-4 mb-2 rounded-md">
            <h2 className="text-xl">{data.title}</h2>
            <p>Hash: {data.hash}</p>
            <p>Created At: {new Date(data.created_at!).toLocaleString()}</p>
            <p>Updated At: {new Date(data.updated_at!).toLocaleString()}</p>
            <div className="mt-2">
              <button
                onClick={() => setEditingData(data)}
                className="mr-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-400"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(data.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
