// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState({
    admissions: 0,
    messages: 0,
    news: 0,
    bankAvailable: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const [admissions, messages, news, bank] = await Promise.all([
        fetch("http://localhost:5000/api/admission", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),

        fetch("http://localhost:5000/api/contact", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),

        fetch("http://localhost:5000/api/news/admin", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),

        fetch("http://localhost:5000/api/bank").then((res) => res.json()),
      ]);

      setData({
        admissions: admissions.length,
        messages: messages.length,
        news: news.length,
        bankAvailable: !!bank?.accountName,
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Admissions" value={data.admissions} />
        <Card title="Messages" value={data.messages} />
        <Card title="News Posts" value={data.news} />
        <Card
          title="Bank Info Set"
          value={data.bankAvailable ? "✅ Yes" : "❌ No"}
        />
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white rounded p-4 shadow text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;
