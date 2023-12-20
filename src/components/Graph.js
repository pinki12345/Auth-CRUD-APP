import React, { useState, useEffect } from "react";
import { supabase } from "../createClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Graph = ({userdata}) => {
    console.log("User Data-",userdata);
  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    const { data } = await supabase.from("users").select("*");
    setUsers(data);
  }

  useEffect(() => {
    fetchUsers();
  }, [userdata]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={600}
          height={300}
          data={users}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
