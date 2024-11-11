import { SensitiveData } from '../types/types';
import { useState } from 'react';
import DataForm from './DataForm';

interface DataListProps {
  dataList: SensitiveData[];
  setDataList: React.Dispatch<React.SetStateAction<SensitiveData[]>>;
}

export default function DataList({ dataList, setDataList }: DataListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingData, setEditingData] = useState<SensitiveData | null>(null);

  const handleDelete = async (id: number) => {
    // placeholder for API call to delete data
    try {
      // await axios.delete(`/api/data/${id}`);
      setDataList(dataList.filter((data) => data.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
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
            <p>{data.description}</p>
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
