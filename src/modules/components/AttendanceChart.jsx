import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AttendanceChart = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const response = await axios.get(`http://localhost:8080/api/attendance/${user.loginEmployee._id}`);
            const processedData = processAttendanceData(response.data);
            setAttendanceData(processedData);
            setPieData(processPieData(processedData));
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    const processAttendanceData = (data) => {
        const grouped = data.reduce((acc, record) => {
            const date = new Date(record.date).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(grouped).map(([date, count]) => ({ date, count }));
    };

    const processPieData = (data) => {
        const total = data.reduce((sum, entry) => sum + entry.count, 0);
        return data.slice(0, 5).map(entry => ({
            name: entry.date,
            value: (entry.count / total) * 100
        }));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Attendance Overview</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="h-[300px]">
                    <h3 className="mb-2 text-lg font-semibold text-gray-700">Daily Attendance Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={attendanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#0071ff" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="h-[300px]">
                    <h3 className="mb-2 text-lg font-semibold text-gray-700">Attendance Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="h-[300px] md:col-span-2">
                    <h3 className="mb-2 text-lg font-semibold text-gray-700">Top 5 Attendance Days</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AttendanceChart;
