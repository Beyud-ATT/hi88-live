import React from "react";
import { Table, Avatar, Rate, Flex, Typography } from "antd";
import "tailwindcss/tailwind.css";

const OnlineTable = () => {
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => (
        <span className="text-white text-xs sm:text-sm md:text-base">
          {text}
        </span>
      ),
    },
    {
      title: "THÀNH VIÊN",
      dataIndex: "member",
      key: "member",
      render: (text) => (
        <div className="flex items-center">
          <Avatar
            src="https://example.com/avatar.png"
            className="mr-2 bg-white w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
          />
          <span className="text-white text-xs sm:text-sm md:text-base">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "TƯƠNG TÁC",
      dataIndex: "interaction",
      key: "interaction",
      render: (text) => (
        <span className="text-white text-xs sm:text-sm md:text-base">
          {text}
        </span>
      ),
    },
    {
      title: "TRONG NGÀY",
      dataIndex: "daily",
      key: "daily",
      render: (text) => (
        <span className="text-white text-xs sm:text-sm md:text-base">
          {text}
        </span>
      ),
    },
    {
      title: "PHÒNG LIVE",
      dataIndex: "liveRooms",
      key: "liveRooms",
      render: (text) => (
        <span className="text-white text-xs sm:text-sm md:text-base">
          {text}
        </span>
      ),
    },
    {
      title: "TRONG TUẦN",
      dataIndex: "weekly",
      key: "weekly",
      render: (text) => (
        <span className="text-white text-xs sm:text-sm md:text-base">
          {text}
        </span>
      ),
    },
    {
      title: "PHONG ĐỘ",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <div className="scale-75 sm:scale-90 md:scale-100 origin-left">
          <Rate
            allowHalf
            disabled
            defaultValue={rating}
            className="flex items-center"
          />
        </div>
      ),
    },
  ];

  const data = Array(8)
    .fill(null)
    .map((_, index) => ({
      key: index,
      index: index + 1,
      member: "Happy",
      interaction: 9,
      daily: "12:0",
      liveRooms: 4,
      weekly: "78h",
      rating: 4,
    }));

  return (
    <Flex
      vertical
      gap={18}
      className="p-2 sm:p-3 md:p-4 border border-[var(--table-border-color)] rounded-lg"
    >
      <Flex justify="center" align="middle">
        <Typography.Title
          level={4}
          className="text-center !text-[#FB8C00] uppercase italic font-bold bg-[var(--table-header-bg)] w-full py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base"
        >
          Trực tuyến
        </Typography.Title>
      </Flex>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        className="table-fixed text-white"
        bordered={false}
        rowClassName={() => "bg-[var(--background-color)]"}
        scroll={{ x: 600 }}
      />
    </Flex>
  );
};

export default OnlineTable;
