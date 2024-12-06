import React, { useState, useEffect } from 'react';
import { Table, Button, ConfigProvider } from 'antd';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AttendanceHistory = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const response = await axios.get(`http://localhost:8080/api/attendance/${user.loginEmployee._id}`);
            setAttendance(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Time',
            dataIndex: 'date',
            key: 'time',
            render: (text) => new Date(text).toLocaleTimeString(),
        },
    ];

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Date', 'Time']],
            body: attendance.map(record => [
                new Date(record.date).toLocaleDateString(),
                new Date(record.date).toLocaleTimeString()
            ]),
        });
        doc.save('attendance.pdf');
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: '#0071ff',
                    },
                },
            }}
        >
            <div className="p-5">
                <h2 className="mb-4 text-2xl font-bold">Attendance History</h2>
                <Button
                    onClick={handleDownloadPDF}
                    className="mb-4 bg-[#0071ff] text-white hover:bg-[#005ad6]"
                >
                    Download PDF
                </Button>
                <Table
                    columns={columns}
                    dataSource={attendance}
                    loading={loading}
                    rowKey="_id"
                />
            </div>
        </ConfigProvider>
    );
};

export default AttendanceHistory;



