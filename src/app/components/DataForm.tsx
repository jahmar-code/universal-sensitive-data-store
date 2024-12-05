import { useForm } from "react-hook-form";
import { SensitiveData } from "../types/types";
import { useState } from "react";

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
  const [error, setError] = useState("");

  const onSubmit = async (formData: SensitiveData) => {
    if (data) {
      // this updates existing data
      try {
        const response = await fetch(`/api/sensitiveData/${data.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preHash: formData.description,
            title: formData.title,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update data.");
        }

        const updatedData = await response.json();

        // setDataList(
        //   dataList.map((item) =>
        //     item.id === data.id ? { ...item, ...formData } : item
        //   )
        // );
        setDataList(
          dataList.map((item) =>
            item.id === data.id
              ? {
                  ...item,
                  title: updatedData.data.title,
                  hash: updatedData.data.hash,
                  updated_at: updatedData.data.updated_at,
                }
              : item
          )
        );
        if (setEditingData) setEditingData(null);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      }
    } else {
      // this inserts new data
      try {
        const response = await fetch("/api/sensitiveData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preHash: formData.description,
            title: formData.title,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add data.");
        }

        const responseData = await response.json();
        const newData: SensitiveData = {
          ...formData,
          id: responseData.data.id,
          hash: responseData.data.hash,
          created_at: responseData.data.created_at,
          updated_at: responseData.data.updated_at,
        };
        setDataList([...dataList, newData]);

        if (setIsAdding) setIsAdding(false);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    if (setIsAdding) setIsAdding(false);
    if (setEditingData) setEditingData(null);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-4 border p-4 rounded-md"
    >
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-2">
        <label className="block mb-1">Title</label>
        <input
          {...register("title", { required: true })}
          className="w-full border px-3 py-2 text-black rounded-md"
          type="text"
          placeholder="Enter title"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Data</label>
        <textarea
          {...register("description", { required: true })}
          className="w-full border px-3 py-2 text-black rounded-md"
          placeholder="Enter data"
        />
      </div>
      <div className="flex">
        <button
          type="submit"
          className="mr-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-400"
        >
          {data ? "Update" : "Add"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
