import { logo } from "@/assets/img";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Modal } from 'antd';
import { FaSearch } from 'react-icons/fa';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
const { Search } = Input;
const Header = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');


  const onSearch = (value: any) => {
    console.log('Search value:', value);
    // Add your search logic here
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <header>
      <div className="container my-3">
        <div className="flex justify-around lg:justify-between items-center">
          <div className="order-1 lg:hidden">
            <i className="fa-solid fa-bars text-2xl" />
          </div>
          <div className="order-2 Logo lg:w-60">
            <img
              src={logo}
              alt=""
              className="lg:w-[143px] lg:h-[42.24px] w-32 h-8"
            />
          </div>
          <nav className="order-3 hidden lg:block">
            <ul className="flex items-center space-x-2">
              <li>
                <a

                  href="/"

                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-[7px]"

                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a
                  href="/shop"

                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-[7px]"

                >
                  Sản phẩm
                </a>
              </li>
              <li>
                <a
                  href="/ourstory"

                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-[7px]"

                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href=""
                  className="hover:shadow-slate-500/50 font-semibold hover:text-white  hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-[7px]"
                >
                  Nhật Ký
                </a>
              </li>
              <li>
                <a
                  href=""
                  className="hover:shadow-slate-500/50 font-semibold hover:text-white  hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 "
                >
                  Liên Hệ
                </a>
              </li>
            </ul>
          </nav>
          <div className="order-4 flex items-center space-x-6 cursor-pointer">
            <span>
              <div className="relative">
                <SearchOutlined className="text-xl cursor-pointer" onClick={showModal} />
                <Modal
                  open={isModalVisible}
                  onCancel={handleCancel}
                  footer={null}
                title="Tìm kiếm" 
                >
                  <Input
                    placeholder="Nhập từ khóa tìm kiếm"
                    size="large"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={() => onSearch(searchValue)} 
                  />
                </Modal>
              </div>
            </span>
            <span>
              <i className="fa-regular fa-heart text-xl" />
            </span>
            <span>
              <a href="/gio-hang">
                <i className="fa-regular fa-bag-shopping text-xl relative">
                  <span className="-bottom-1 left-[10px] w-4 h-4 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center">
                    0
                  </span>
                </i>
              </a>
            </span>
            <Link to="/login">
              <button className="bg-blackL  border-black shadow-lg shadow-slate-600/50 hover:text-black hover:border-0 hover:bg-white text-white px-6 py-3 rounded-xl text-lg font-medium">

                Đăng nhập
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
