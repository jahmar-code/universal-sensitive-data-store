"use client";
import { useState, useEffect } from 'react';
import axios from 'axios'; // placeholder for API calls
import DataList from '../components/DataList';
import { useRouter } from 'next/navigation';


interface SensitiveData {
  id: number;
  title: string;
  description: string;
}

export default function Dashboard() {
  const [dataList, setDataList] = useState<SensitiveData[]>([]);
  const [username, setUserName] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    // placeholder for fetching data from API
    const fetchData = async () => {
      try {
        // const response = await axios.get('/api/data');
        // setDataList(response.data);
        // placeholder data


        // get user's name from db
        //const username = response.data;
        setUserName("Milani") // this is a placeholder
        setDataList([
          { id: 1, title: 'Credit Card', description: '**** **** **** 1234' },
          { id: 2, title: 'Social Security', description: 'SSN: ***-***-567' },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // placeholder for logout API call
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        {/* this can be changed below, just an example */}
        <h1 className="text-4xl">{username + "'s Data"}</h1>
        <button onClick={handleLogout} className="bg-gray-700 px-3 py-1 rounded-md">
          Logout
        </button>
      </div>
      <DataList dataList={dataList} setDataList={setDataList} />
    </div>
  );
}
