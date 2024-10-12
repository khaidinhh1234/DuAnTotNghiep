import instance from "@/configs/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, message, Space, Table, TableColumnsType } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const { Search } = Input;

interface UserPrivilegeDataType {
  key: React.Key;
  privilege: string;
  description: string;
}

const UserPrivilegeAdmin = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      try {
        const response = await instance.delete(`/vaitro/${id}`);
        message.open({
          type: "success",
          content: "Xóa vai trò thành công!",
        });
        return response.data;
      } catch (error) {
        message.open({
          type: "error",
          content: "Không thể xóa vai trò!",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["VAITRO_KEY"],
      });
    },
  });
  const columns: TableColumnsType<UserPrivilegeDataType> = [
    {
      title: <div className="w-[40%] pl-8 ">Vai trò</div>,
      dataIndex: "ten_vai_tro",
      render: (text) => <div className="w-[50%] pl-8">{text}</div>,
    },
    {
      title: <div className="w-[40%] pl-8 ">Mô tả vai trò</div>,
      render: (_, record: any) => (
        <div className="w-[50%] pl-8">{record?.mo_ta}</div>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          {typeof record.key === "number" && record.key <= 3 ? (
            <Link to={`show/${record.key}`}>
              <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
                Xem Quyền
              </Button>
            </Link>
          ) : (
          <>
            {" "}
            <Button
              className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300"
              onClick={() => mutate(record.key as number)}
            >
              Xóa
            </Button>
            <Link to={`edit-permission/${record.key}`}>
              <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
                Cập nhật
              </Button>
            </Link>
            <Link to={`show/${record.key}`}>
              <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
                Xem Quyền
              </Button>
            </Link>
          </>
          )}
        </Space>
      ),
    },
  ];
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
  });
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };
  // const queryClient = useQueryClient();
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["VAITRO_KEY"],
    queryFn: async () => {
      try {
        const response = await instance.get("/vaitro");
        return response.data;
      } catch (error) {
        message.open({
          type: "error",
          content: "Không thể lấy dữ liệu!",
        });
      }
    },
  });
  console.log("Data:", data);
  console.log("Fetching:", isFetching);
  const vaitro = data?.data
    .map((item: any) => {
      return { ...item, key: item.id };
    })
    .reverse();
  console.log("vaitro", vaitro);
  // console.log(vaitro);
  const [filteredData, setFilteredData] = useState(vaitro);

  const onSearch = (value: string) => {
    const filtered = vaitro?.filter(
      (item: any) =>
        item.ten_vai_tro.toLowerCase().includes(value.toLowerCase())
      // ||
      //   item.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // const rowSelection: TableRowSelection<UserPrivilegeDataType> = {
  //   onChange: (selectedRowKeys) => {
  //     console.log("Selected Row Keys:", selectedRowKeys);
  //   },
  // };

  if (isError) return <div>Error...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Vai trò</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Quản lý vai trò</h1>
        <Link to="/admin/ADmin/userprivileges/add-permission">
          <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
            <i className="fa-sharp fa-solid fa-plus text-2xl"></i> Thêm vai trò
            mới
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <Search
          placeholder="Tìm kiếm quyền hoặc mô tả"
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
        />
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={vaitro}
          pagination={{ pageSize: 10, className: "my-5" }}
          rowKey="id"
          onChange={handleTableChange}
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default UserPrivilegeAdmin;
