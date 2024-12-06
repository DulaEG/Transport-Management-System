import React, { useState } from 'react';
import './OvertimeCalculation.css'; // Assuming you'll add some styles for this form

const OvertimeCalculation = () => {
  const [overtimeHours, setOvertimeHours] = useState('00:00:00');
  const [overtimeRate, setOvertimeRate] = useState('');
  const [overtimePay, setOvertimePay] = useState(0);

  const handleOvertimeChange = (e) => {
    setOvertimeHours(e.target.value);
  };

  const handleOvertimeRateChange = (e) => {
    setOvertimeRate(e.target.value);
  };

  const calculateOvertimePay = () => {
    const [hours, minutes, seconds] = overtimeHours.split(':').map(Number);
    const totalOvertimeInHours = hours + minutes / 60 + seconds / 3600;
    const calculatedOvertimePay = totalOvertimeInHours * overtimeRate;

    setOvertimePay(calculatedOvertimePay.toFixed(2));
  };

  return (
    <div className="overtime-container">
      <h2>Overtime Calculation</h2>
      <form>
        <div className="form-group">
          <label>Overtime Hours (HH:MM:SS):</label>
          <input
            type="text"
            value={overtimeHours}
            onChange={handleOvertimeChange}
            placeholder="00:00:00"
          />
        </div>
        <div className="form-group">
          <label>Overtime Rate:</label>
          <input
            type="number"
            value={overtimeRate}
            onChange={handleOvertimeRateChange}
            placeholder="Rate per Hour"
          />
        </div>
        <button
          type="button"
          onClick={calculateOvertimePay}
        >
          Calculate Overtime Pay
        </button>
      </form>

      {overtimePay > 0 && (
        <div className="overtime-result">
          <h3>Calculated Overtime Pay: ${overtimePay}</h3>
        </div>
      )}
    </div>
  );
};

export default OvertimeCalculation;
