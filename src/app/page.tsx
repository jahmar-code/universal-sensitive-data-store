"use client";
import { useState, useEffect } from "react";
import DataList from "../app/components/DataList";
import { SensitiveData } from "./types/types";
import FetchDataForm from "./components/FetchDataForm";

export default function Page() {
  const [dataList, setDataList] = useState<SensitiveData[]>([]);
  const [username, setUserName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sensitiveData");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch data.");
        }
        const responseData = await response.json();
        setDataList(responseData.data);
        setUserName("Sensitive");
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl">{username} Data</h1>
      </div>
      <FetchDataForm />
      <DataList dataList={dataList} setDataList={setDataList} />
    </div>
  );
}
