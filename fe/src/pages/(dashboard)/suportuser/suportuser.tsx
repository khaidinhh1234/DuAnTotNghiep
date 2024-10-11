const Suportuser = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị /{" "}
          <span className="font-semibold px-px=">Hỗ trợ khách hàng </span>{" "}
        </h1>
      </div>
      {/* <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl">Hỗ trợ khách hàng </h1>

 
      </div> */}
      <div className=" ">
        {/* <div className="max-w-xs my-2">
            <Input
                placeholder="Tìm kiếm..."
                size="large"
                value={searchText}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div> */}
        <div className="bg-gray-100 h-[700px] flex ">
          <aside className="w-64 bg-white border-r border-gray-200 p-4">
            <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-gray-200">
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold">John Deo</h2>
                <p className="text-sm text-gray-500">Marketing Manager</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm liên hệ"
              className="w-full mb-4 p-2 bg-gray-100 rounded-md text-sm"
            />
            <h3 className="font-semibold text-gray-700 mb-2">
              Cuộc trò chuyện gần đây
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 p-2 bg-blue-100 rounded-md">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">James Johnson</h4>
                  <p className="text-xs text-gray-500">
                    Bạn: Sehiwid paezo umo e...
                  </p>
                </div>
                <span className="text-xs text-gray-400">5 phút</span>
              </li>
              <li className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Maria Hernandez</h4>
                  <p className="text-xs text-gray-500">
                    Fahjuv an le nicug kekizgu.
                  </p>
                </div>
                <span className="text-xs text-gray-400">1 phút</span>
              </li>
              {/* Add more chat items similarly */}
            </ul>
          </aside>
          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col bg-white">
            <header className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-semibold">James Johnson</h2>
                  <p className="text-sm text-green-500">trực tuyến</p>
                </div>
              </div>
              <div className="space-x-4 text-gray-400">
                <button className="hover:text-gray-600">
                  <i className="fas fa-phone" />
                </button>
                <button className="hover:text-gray-600">
                  <i className="fas fa-video" />
                </button>
                <button className="hover:text-gray-600">
                  <i className="fas fa-ellipsis-v" />
                </button>
              </div>
            </header>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* Message */}
              <div className="flex flex-col space-y-1">
                <div className="flex items-end space-x-2">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="bg-gray-100 p-2 rounded-md">
                    <p className="text-sm">Sicov watiro tibzila gej ajku.</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 pl-10">1 giờ trước</span>
              </div>
              {/* Add more messages similarly */}
            </div>
            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <form className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn"
                  className="flex-1 p-2 bg-gray-100 rounded-md"
                />
                <button type="submit" className="text-blue-500">
                  <i className="fas fa-paper-plane" />
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-paperclip" />
                </button>
              </form>
            </div>
          </main>
          {/* Media & Attachments Sidebar */}
          <aside className="w-64 bg-white border-l border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 mb-4">Media (1)</h3>
            <div className="mb-4">
              <img
                src="https://via.placeholder.com/150"
                alt="Media Image"
                className="w-full rounded-md"
              />
            </div>
            <h3 className="font-semibold text-gray-700 mb-4">Đính kèm (5)</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/20"
                  alt="Attachment Icon"
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">service-task.pdf</h4>
                  <p className="text-xs text-gray-400">2MB</p>
                </div>
              </li>
              {/* Add more attachments similarly */}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Suportuser;
