import { useForm } from 'react-hook-form';
import { SensitiveData } from '../types/types';


// TODO - data format is just so we can get api calls working, we can specify how we want to structure sensitive data later

interface DataFormProps {
  data?: SensitiveData;
  setIsAdding?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingData?: React.Dispatch<React.SetStateAction<SensitiveData | null>>;
  setDataList: React.Dispatch<React.SetStateAction<SensitiveData[]>>;
  dataList: SensitiveData[];
}

export default function DataForm({
  data,
  setIsAdding,
  setEditingData,
  setDataList,
  dataList,
}: DataFormProps) {
  const { register, handleSubmit } = useForm<SensitiveData>({
    defaultValues: data || {},
  });

  const onSubmit = async (formData: SensitiveData) => {
    if (data) {
      // placeholder for API call to update data
      try {
        // await axios.put(`/api/data/${data.id}`, formData);
        setDataList(
          dataList.map((item) =>
            item.id === data.id ? { ...item, ...formData } : item
          )
        );
        if (setEditingData) setEditingData(null);
      } catch (err) {
        console.error(err);
      }
    } else {
      // placeholder for API call to add new data
      try {
        // const response = await axios.post('/api/data', formData);
        // setDataList([...dataList, response.data]);
        // using placeholder ID
        const newData = { ...formData, id: Date.now() };
        setDataList([...dataList, newData]);
        if (setIsAdding) setIsAdding(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    if (setIsAdding) setIsAdding(false);
    if (setEditingData) setEditingData(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4 border p-4 rounded-md">
      <div className="mb-2">
        <label className="block mb-1">Title</label>
        <input
          {...register('title', { required: true })}
          className="w-full border px-3 py-2 text-black rounded-md"
          type="text"
          placeholder="Enter title"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Data</label>
        <textarea
          {...register('description', { required: true })}
          className="w-full border px-3 py-2 text-black rounded-md"
          placeholder="Enter data"
        />
      </div>
      <div className="flex">
        <button type="submit" className="mr-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-400">
          {data ? 'Update' : 'Add'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-600 px-3 py-1 rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
