import { useState, useEffect } from "react";
import { Select } from "antd";

const { Option } = Select;

const CustomDatePicker = ({ onChange }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Get number of days in a month
  const getDaysInMonth = (month, year) => {
    if (!month || !year) return [];

    const days = new Date(year, month, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const days = getDaysInMonth(selectedMonth, selectedYear);
      setDaysInMonth(days);

      if (selectedDay > days.length) {
        setSelectedDay(null);
      }
    }
  }, [selectedMonth, selectedYear]);

  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year;
  });

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleChange = (type, value) => {
    switch (type) {
      case "day":
        setSelectedDay(value);
        break;
      case "month":
        setSelectedMonth(value);
        break;
      case "year":
        setSelectedYear(value);
        break;
    }

    if (onChange) {
      onChange({
        day: type === "day" ? value : selectedDay,
        month: type === "month" ? value : selectedMonth,
        year: type === "year" ? value : selectedYear,
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Select
        placeholder="Ngày"
        className="w-1/3"
        value={selectedDay}
        onChange={(value) => handleChange("day", value)}
      >
        {daysInMonth.map((day) => (
          <Option key={day} value={day}>
            {day}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Tháng"
        className="w-1/3"
        value={selectedMonth}
        onChange={(value) => handleChange("month", value)}
      >
        {months.map((month) => (
          <Option key={month} value={month}>
            {month}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Năm"
        className="w-1/3"
        value={selectedYear}
        onChange={(value) => handleChange("year", value)}
      >
        {years.map((year) => (
          <Option key={year} value={year}>
            {year}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default CustomDatePicker;
