import React, { useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Input, Button, Space, Table, Drawer, Form, Row, Col, Select, message, Popconfirm, DatePicker } from 'antd';
import { Icon } from "@iconify/react";
import '../styles/table.css';
import axios from "axios";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import moment from 'moment'; 

const { Search } = Input;
const { Option } = Select;

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  header: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c883d'
  },
  logo: {
    width: 100,
    height: 50,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000'
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#EEEEEE",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    backgroundColor: '#FFFFFF',
  },
  tableHeader: {
    backgroundColor: '#e7ffe7',
    color: '#FFFFFF',
  },
  tableCol: {
    width: "150px",
    borderStyle: "solid",
    borderColor: "#EEEEEE",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    color: '#333333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888888',
    fontSize: 10,
  },
});

// Define the PDF Document component
const MyDocument = ({ duties }) => (
  <Document>
    <Page size="A1" style={styles.page}>
      <View style={styles.section}>
        <Text>Duty List</Text>
        <View style={styles.table}>
          {/* Table header */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Duty ID</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Employee ID</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Duty Date</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Vehicle ID</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Start Location</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>End Location</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Distance</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Duty Status</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Shift</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Notes</Text>
            </View>
          </View>
          {/* Table body */}
          {duties.map((duty) => (
            <View style={styles.tableRow} key={duty._id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.did}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.employeeId}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.dutyDate}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.vehicleId}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.startLocation}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.endLocation}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.distance}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.dutyStatus}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.shift}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{duty.notes}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

function Duty() {
  const [messageApi, contextHolder] = message.useMessage();

  // Read
  const [duties, setDuties] = useState([]);

  // Search Filter
  const [filterDuties, setFilterDuties] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Create
  const [openAddDuty, setOpenAddDuty] = useState(false);
  const [form] = Form.useForm();

  // Update
  const [selectedDuty, setSelectedDuty] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateForm] = Form.useForm();

  // Read
  useEffect(() => {
    fetchDuties();
  }, []);

  const fetchDuties = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/duty/getduty");
      const dutiesWithKeys = response.data.duties.map(duties => ({
        ...duties,
        key: duties._id,
        dob: moment(duties.dob).format('YYYY-MM-DD'), 
      }));
      setDuties(dutiesWithKeys);
      setFilterDuties(dutiesWithKeys);
    } catch (error) {
      console.error("Error fetching duties:", error);
      messageApi.error('Failed to fetch duties');
    }
  };

  // Create
  const addSuccess = () => {
    messageApi.success('Duty added successfully!');
    fetchDuties();
  };

  const addError = () => {
    messageApi.error('Failed to add duty. Please try again.');
  };

  const addWarning = (warningMessage) => {
    messageApi.warning(warningMessage);
  };

  const showDrawer = () => {
    setOpenAddDuty(true);
  };

  const onClose = () => {
    setOpenAddDuty(false);
    form.resetFields();
  };

  async function addNewDuty() {
    try {
      const values = await form.validateFields();
      const response = await axios.post('http://localhost:8080/api/duty/addduty', values);

      if (response.status === 200) {
        addSuccess();
        onClose();
      }
    } catch (error) {
      if (error.errorFields) {
        messageApi.warning('Please fill in all required fields correctly.');
      } else {
        console.error(error);
        addError();
      }
    }
  }

  // Delete
  async function deleteDuty(id) {
    try {
      const response = await axios.delete(`http://localhost:8080/api/duty/deleteduty/${id}`);
      messageApi.success('Duty deleted successfully!');
      setDuties((prevDuty) => prevDuty.filter(duties => duties._id !== id));
      setFilterDuties((prevDuty) => prevDuty.filter(duties => duties._id !== id));
    } catch (error) {
      console.log(error);
      messageApi.error('Failed to delete duty. Please try again.');
    }
  }


  // Table
  const columns = [
    {
      title: 'Duty ID',
      dataIndex: 'did',
      key: 'did',
      className: 'px-4',
    },
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      className: 'px-4',
    },
    {
      title: 'Duty Date',
      dataIndex: 'dutyDate',
      key: 'dutyDate',
      className: 'px-4',
      render: (dob) => moment(dob).format('YYYY-MM-DD'),
    },
    {
      title: 'Vhicle ID',
      dataIndex: 'vehicleId',
      key: 'vehicleId',
      className: 'px-4',
    },
    {
      title: 'Start Location',
      dataIndex: 'startLocation',
      key: 'startLocation',
      className: 'px-4',
    },
    {
      title: 'End Location',
      dataIndex: 'endLocation',
      key: 'endLocation',
      className: 'px-4',
    },
    {
      title: 'Distance (km)',
      dataIndex: 'distance',
      key: 'distance',
      className: 'px-4',
    },
    {
      title: 'DutyStatus',
      dataIndex: 'dutyStatus',
      key: 'dutyStatus',
      className: 'px-4',
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
      className: 'px-4',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      className: 'px-4',
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="large" className='bg-[#379237] text-white' onClick={() => updateShowDrawer(record)}>Update</Button>
          <Popconfirm
            title="Delete the duty"
            description="Are you sure to delete this duty?"
            onConfirm={() => deleteDuty(record._id)}
            onCancel={() => messageApi.info('Cancelled')}
            okText="Yes"
            cancelText="No"
          >
            <Button size="large" className='text-white bg-red-600'>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Search Filter
  useEffect(() => {
    filterDuty();
  }, [selectedShift, selectedStatus, duties]);

  const filterDuty = () => {
    let filtered = [...duties];

    if (selectedShift && selectedShift !== 'All') {
      filtered = filtered.filter(duties => duties.shift === selectedShift);
    }

    if (selectedStatus && selectedStatus !== 'All') {
      filtered = filtered.filter(duties => duties.dutyStatus === selectedStatus);
    }

    setFilterDuties(filtered);
  };

  const onSearch = (value) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = duties.filter(duties =>
      duties.did.toLowerCase().includes(lowercasedValue)
    );
    setFilterDuties(filtered);
  };

  const handleRoleChange = (value) => {
    setSelectedShift(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  // Update
  const updateShowDrawer = (duties) => {
    setSelectedDuty(duties);
    setUpdateOpen(true);

    updateForm.setFieldsValue({
      did: duties.did,
      employeeId: duties.employeeId,
      dutyDate: moment(duties.dob, 'YYYY-MM-DD'),
      vehicleId: duties.vehicleId,
      startLocation: duties.startLocation,
      endLocation: duties.endLocation,
      distance: duties.distance,
      dutyStatus: duties.dutyStatus,
      shift: duties.shift,
      notes: duties.notes,
    });
  };

  const handleUpdateDuty = async () => {
    try {
      const values = await updateForm.validateFields();

      if (Object.values(values).some(value => value === undefined || value === '')) {
        addWarning('Please fill in all required fields.');
        return;
      }

      const updatedDuty = {
        ...selectedDuty,
        ...values,
      };

      const response = await axios.put(`http://localhost:8080/api/duty/editduty/${selectedDuty._id}`, updatedDuty);

      if (response.status === 200) {
        messageApi.success('Duty updated successfully!');
        setUpdateOpen(false);
        fetchDuties();
      }
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to update duty. Please try again.');
    }
  };

  const updateOnClose = () => {
    setUpdateOpen(false);
    updateForm.resetFields();
  };
  return (
    <>
      {contextHolder}
      <div className="flex justify-between items-center h-[74px] bg-white rounded-[11px] m-[15px] px-[15px]">
        <div className="text-slate-900 text-xl font-semibold font-['Poppins']">Duties</div>
        <Space>

          {/* Search Filter */}
          <Search
            placeholder="Search by Duty ID"
            onSearch={onSearch}
            style={{
              width: '250px',
              height: '40px',
            }}
            size='large'
          />
          <Select
            placeholder="Select Duty Shift"
            style={{
              width: '200px',
              height: '40px',
            }}
            size='large'
            onChange={handleRoleChange}
            defaultValue="All"
          >
            <Option value="All">Duty Shift -- All</Option>
            <Option value="Morning">Morning</Option>
            <Option value="Afternoon">Afternoon</Option>
            <Option value="Night">Night</Option>
          </Select>
          <Select
            placeholder="Select Duty Status"
            style={{
              width: '200px',
              height: '40px',
            }}
            size='large'
            onChange={handleStatusChange}
            defaultValue="All"
          >
            <Option value="All">Duty Status -- All</Option>
            <Option value="Pending">Pending</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
          </Select>

          {/* PDF */}
          <PDFDownloadLink
            document={<MyDocument duties={filterDuties} />}
            fileName="duties.pdf"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                'Loading document...'
              ) : (
                <Button type="primary" icon={<DownloadOutlined />} className="bg-[#bfbfbf]" size="large">
                  Download PDF
                </Button>
              )
            }
          </PDFDownloadLink>



          {/* Create */}
          <Button
            type="primary"
            icon={<Icon icon="ic:baseline-plus" />}
            className="bg-[black] font-['Poppins']"
            onClick={showDrawer}
            size="large"
          >
            Add New Duty
          </Button>
        </Space>
      </div>

      <div className="p-4 m-4 bg-white rounded-xl">
        <Table
          columns={columns}
          dataSource={filterDuties}
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Create */}
      <Drawer
        title="Add Duty"
        width={720}
        onClose={onClose}
        open={openAddDuty}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={addNewDuty} type="primary" className='bg-[black]'>
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="did"
            label="Duty Id"
            rules={[{ required: true, message: 'Please enter duty id' }]}
          >
            <Input placeholder="Enter Duty Id" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="Employee Id"
                rules={[{ required: true, message: 'Please enter employee id' }]}
              >
                <Input placeholder="Enter Employee Id" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dutyDate"
                label="Duty Date"
                rules={[{ required: true, message: 'Please enter duty date' }]}
              >
                <DatePicker placeholder="Enter duty date" style={{width:"100%"}}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vehicleId"
                label="Vehicle Id"
                rules={[{ required: true, message: 'Please enter vehicle id' }]}
              >
                <Input placeholder="Enter vehicle id" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="startLocation"
                label="Start Location"
                rules={[{ required: true, message: 'Please enter start location' }]}
              >
                <Input placeholder="Enter start location" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="endLocation"
            label="End Location"
            rules={[{ required: true, message: 'Please enter end location' }]}
          >
            <Input rows={4} placeholder="Enter end location" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="distance"
                label="Distance (km)"
                rules={[{ required: true, message: 'Please enter distance' }]}
              >
                <Input placeholder="Enter distance" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dutyStatus"
                label="Duty Status"
                rules={[
                  { required: true, message: 'Please select duty status' },
                ]}
              >
                <Select placeholder="Select duty status">
                  <Option value="Pending">Pending</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="shift"
                label="Shift"
                rules={[{ required: true, message: 'Please select shift' }]}
              >
                <Select placeholder="Select shift">
                  <Option value="Morning">Morning</Option>
                  <Option value="Afternoon">Afternoon</Option>
                  <Option value="Night">Night</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Form.Item
              name="notes"
              label="Notes"
              rules={[{ required: true, message: 'Please enter notes' }]}
            >
              <Input.TextArea placeholder="Enter notes" />
            </Form.Item>
          </Col>
        </Form>
      </Drawer>

      {/* Update */}
      <Drawer
        title="Edit Duty"
        width={720}
        onClose={updateOnClose}
        open={updateOpen}
        extra={
          <Space>
            <Button onClick={updateOnClose}>Cancel</Button>
            <Button onClick={handleUpdateDuty} type="primary" className='bg-[black]'>
              Update
            </Button>
          </Space>
        }
      >
        <Form form={updateForm} layout="vertical" hideRequiredMark>
          <Form.Item
            name="did"
            label="Duty Id"
            rules={[{ required: true, message: 'Please enter duty id' }]}
          >
            <Input placeholder="Enter Duty Id" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="Employee Id"
                rules={[{ required: true, message: 'Please enter employee id' }]}
              >
                <Input placeholder="Enter Employee Id" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dutyDate"
                label="Duty Date"
                rules={[{ required: true, message: 'Please enter duty date' }]}
              >
                <DatePicker placeholder="Enter duty date" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vehicleId"
                label="Vehicle Id"
                rules={[{ required: true, message: 'Please enter vehicle id' }]}
              >
                <Input placeholder="Enter vehicle id" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="startLocation"
                label="Start Location"
                rules={[{ required: true, message: 'Please enter start location' }]}
              >
                <Input placeholder="Enter start location" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="endLocation"
            label="End Location"
            rules={[{ required: true, message: 'Please enter end location' }]}
          >
            <Input rows={4} placeholder="Enter end location" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="distance"
                label="Distance (km)"
                rules={[{ required: true, message: 'Please enter distance' }]}
              >
                <Input placeholder="Enter distance" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dutyStatus"
                label="Duty Status"
                rules={[
                  { required: true, message: 'Please select duty status' },
                ]}
              >
                <Select placeholder="Select duty status">
                  <Option value="Pending">Pending</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="shift"
                label="Shift"
                rules={[{ required: true, message: 'Please select shift' }]}
              >
                <Select placeholder="Select shift">
                  <Option value="Morning">Morning</Option>
                  <Option value="Afternoon">Afternoon</Option>
                  <Option value="Night">Night</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Form.Item
              name="notes"
              label="Notes"
              rules={[{ required: true, message: 'Please enter notes' }]}
            >
              <Input.TextArea placeholder="Enter notes" />
            </Form.Item>
          </Col>
        </Form>
      </Drawer>
    </>
  );
}

export default Duty;