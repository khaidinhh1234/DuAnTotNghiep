import instance from "@/configs/axios";
import { PlusOutlined } from "@ant-design/icons";
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
        const response = await instance.delete(`/admin/vaitro/${id}`);
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
      render: (text) => <div className="w-[40%] pl-8">{text}</div>,
    },
    {
      title: "Mô tả vai trò",
      dataIndex: "mo_ta",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          {typeof record.key === "number" && record.key <= 3 ? (
            <Link to={`show/${record.key}`}>
              <Button className="text-white bg-black rounded-lg hover:bg-orange-50 hover:text-black shadow-xl shadow-black/20  transition-colors hover:border-0">
                Xem Quyền
              </Button>
            </Link>
          ) : (
            <>
              {" "}
              <Button
                className="text-white bg-black rounded-lg hover:bg-orange-50 hover:text-black shadow-xl shadow-black/20  transition-colors hover:border-0"
                onClick={() => mutate(record.key as number)}
              >
                Xóa
              </Button>
              <Link to={`edit-permission/${record.key}`}>
                <Button className="text-white bg-black rounded-lg hover:bg-orange-50 hover:text-black shadow-xl shadow-black/20  transition-colors hover:border-0">
                  Cập nhật
                </Button>
              </Link>
              <Link to={`show/${record.key}`}>
                <Button className="text-white bg-black rounded-lg hover:bg-orange-50 hover:text-black shadow-xl shadow-black/20  transition-colors hover:border-0">
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
        const response = await instance.get("/admin/vaitro");
        return response.data;
      } catch (error) {
        message.open({
          type: "error",
          content: "Không thể lấy dữ liệu!",
        });
      }
    },
  });
  console.log("Fetching:", isFetching);
  const vaitro = data?.data
    .map((item: any) => {
      return { ...item, key: item.id };
    })
    .reverse();
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

  if (isLoading) return <div>Loading...</div>;
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
          <Button className="bg-black text-white" icon={<PlusOutlined />}>
            Thêm vai trò mới
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
          dataSource={filteredData == undefined ? vaitro : filteredData}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </main>
  );
};

export default UserPrivilegeAdmin;
