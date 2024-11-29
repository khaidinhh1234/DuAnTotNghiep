import ScrollToTop from "@/assets/js/scrolltotop";
import ChangePassword from "@/pages/(auth)/ChangePassword/changepassword";
import OTPPage from "@/pages/(auth)/EnterOTP/EntOtp";
import ErrorAuth from "@/pages/(auth)/ErrorAuth/changepassword";
import ForgotPassword from "@/pages/(auth)/ForgotPassword/ForgotPassword";
import Login from "@/pages/(auth)/login/login";
import LoginSuccessfull from "@/pages/(auth)/LoginSuccessfull/LoginSuccessfull";
import Register from "@/pages/(auth)/register/register";
import PageAddAdmin from "@/pages/(dashboard)/admin/addAdmin/page";
import PagePrivilegeAdmin from "@/pages/(dashboard)/admin/page";
import { AnalyticsAdmin } from "@/pages/(dashboard)/analytics/page";
import Color from "@/pages/(dashboard)/bienthe/color";
import Remotecolor from "@/pages/(dashboard)/bienthe/remote";
import Remotesize from "@/pages/(dashboard)/bienthe/remotesize";
import Size from "@/pages/(dashboard)/bienthe/size";
import CategoriesAdd from "@/pages/(dashboard)/categories/add/page";
import CategoriesEdit from "@/pages/(dashboard)/categories/edit/page";
import CategoriesAdmin from "@/pages/(dashboard)/categories/page";
import CategoriesRemote from "@/pages/(dashboard)/categories/remote/page";
import CentralStock from "@/pages/(dashboard)/centralstock.tsx/page";
import BannerManagement from "@/pages/(dashboard)/content/banner/banner";
import Content from "@/pages/(dashboard)/content/footer/footer";

import IntroCard from "@/pages/(dashboard)/adminProfile/profile/IntroCard";
import SanPham from "@/pages/(dashboard)/dashboard/sanpham/page";
import TaiKhoan from "@/pages/(dashboard)/dashboard/taikhoan/page";
import EvaluateAdmin from "@/pages/(dashboard)/evaluate/page";
import { LayoutAdmin } from "@/pages/(dashboard)/layout";
import NewAdd from "@/pages/(dashboard)/news/add/NewAdd";
import NewEdit from "@/pages/(dashboard)/news/edit/NewEdit";
import PageNew from "@/pages/(dashboard)/news/pagenew";
import RemoteNew from "@/pages/(dashboard)/news/remote/RemoteNew";
import ViewNew from "@/pages/(dashboard)/news/view/ViewNew";
import NewCategoriesAdd from "@/pages/(dashboard)/newscategory/add/page";
import NewCategoriesEdit from "@/pages/(dashboard)/newscategory/edit/page";
import NewCategory from "@/pages/(dashboard)/newscategory/page";
import NewCategoriesRemote from "@/pages/(dashboard)/newscategory/remove/page";
import OrderAdmin from "@/pages/(dashboard)/order/page";
import AddProducts from "@/pages/(dashboard)/products/Addd/page";
import EditProducts from "@/pages/(dashboard)/products/Editt/page";
import ProductsAdmin from "@/pages/(dashboard)/products/page";
import ProductsRemote from "@/pages/(dashboard)/products/remote/page";
import RevenueAdmin from "@/pages/(dashboard)/revenue/page";
import Suportuser from "@/pages/(dashboard)/suportuser/suportuser";
import Feedback from "@/pages/(dashboard)/support/feedback/Feedback";
import PageSupport from "@/pages/(dashboard)/support/page";
import Tagsadd from "@/pages/(dashboard)/tags/add/add";
import Tagsedit from "@/pages/(dashboard)/tags/edit/edit";
import TagsRemoteAdmin from "@/pages/(dashboard)/tags/remove/remove";
import Tags from "@/pages/(dashboard)/tags/tags";
import Collect from "@/pages/(dashboard)/transport/collect/Collect";
import PageTransport from "@/pages/(dashboard)/transport/page";
import TableUncomfirmedOrder from "@/pages/(dashboard)/transport/unconfirmedorder/table";
import MemberRankForm from "@/pages/(dashboard)/user/hangthanhvien/add/page";
import MemberRank from "@/pages/(dashboard)/user/hangthanhvien/edit/page";
import Rank from "@/pages/(dashboard)/user/hangthanhvien/page";
import Remoterank from "@/pages/(dashboard)/user/hangthanhvien/remote.tsx/remote";
import UserskhachhangAdd from "@/pages/(dashboard)/user/khachhang/add/page";
import UserskhachhangEdit from "@/pages/(dashboard)/user/khachhang/edit/page";
import UsersAdminkhachhang from "@/pages/(dashboard)/user/khachhang/page";
import UserskhachangRemote from "@/pages/(dashboard)/user/khachhang/remote/page";
import {
  default as ShowNhanvien,
  default as ShowUser,
} from "@/pages/(dashboard)/user/khachhang/show/showUser";
import UsersNhanvienAdd from "@/pages/(dashboard)/user/nhanvien/add/page";
import UsersnhanvienEdit from "@/pages/(dashboard)/user/nhanvien/edit/page";
import UsersAdminNhanvien from "@/pages/(dashboard)/user/nhanvien/page";
import UsersRemoteNhanvien from "@/pages/(dashboard)/user/nhanvien/remote/page";
import PageAddPermission from "@/pages/(dashboard)/userprivileges/addpermission/page";
import PageEditPermission from "@/pages/(dashboard)/userprivileges/edit/page";
import UserPrivilegeAdmin from "@/pages/(dashboard)/userprivileges/page";
import Showvaitro from "@/pages/(dashboard)/userprivileges/show/page";
import AddVoucher from "@/pages/(dashboard)/vourcher/add/add";
import ChuongTrinhUuDaiAdd from "@/pages/(dashboard)/vourcher/banner/add";
import ChuongTrinhUuDaiEdit from "@/pages/(dashboard)/vourcher/banner/edit";
import ChuongTrinhUuDai from "@/pages/(dashboard)/vourcher/banner/page";
import ChuongTrinhUuDaiRemote from "@/pages/(dashboard)/vourcher/banner/remote";
import EditVoucher from "@/pages/(dashboard)/vourcher/edit/edit";
import VoucherAdmin from "@/pages/(dashboard)/vourcher/page";
import ShowVoucher from "@/pages/(dashboard)/vourcher/show/show";
import Shipper from "@/pages/(van_chuyen)/shipper";
import NotFoundPage from "@/pages/(website)/404/page";
import Cart from "@/pages/(website)/cart/Cart";
import Layoutcheckout from "@/pages/(website)/checkout/layoutcheckout";
import Contact from "@/pages/(website)/contact/Contact";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import LayoutMyPro from "@/pages/(website)/layoutmypro";
import ManageAddresses from "@/pages/(website)/manageaddresses/ManageAddresses";
import MyOrderdetail from "@/pages/(website)/myOrder-detail.tsx/myOrder-detail";
import MyOrder from "@/pages/(website)/myOrder/Myorder";
import MyProfile from "@/pages/(website)/myprofile/MyProfile";
import MyProfileedit from "@/pages/(website)/myprofile/MyProfileedit";
import MyVoucher from "@/pages/(website)/myvocher/myvocher";
import RevenuePage from "@/pages/(website)/mywallet/doanhthu";
import BankAccount from "@/pages/(website)/mywallet/nganhang";
import TaiChinh from "@/pages/(website)/mywallet/wallte";
import WithdrawPage from "@/pages/(website)/mywallet/WithdrawPage";
import MyWishlists from "@/pages/(website)/mywishlists/MyWishlists";
import NewDetail from "@/pages/(website)/newdetail/NewDetail";
import Notificationkm from "@/pages/(website)/notifications/_components/Khuyenmai";
import Notification from "@/pages/(website)/notifications/Notification";
import Ordersummary from "@/pages/(website)/ordersummary/ordersummary";
import Payment from "@/pages/(website)/payment/PayMent";
import PageProductDetail from "@/pages/(website)/productdetail/PageProductDetail";
import SavedCard from "@/pages/(website)/savedcards/SavedCard";
import Setting from "@/pages/(website)/settings/Setting";
import ShippingAddressPage from "@/pages/(website)/ShipingAdrres/ShipingAdrres";
import ThankYouPage from "@/pages/(website)/thankyou/thankyou";
import Voucher from "@/pages/(website)/vourcher/page";
import { Navigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import Bienthe from "../pages/(dashboard)/bienthe/bienthe";
import PageOur from "../pages/(website)/ourstory/pageOur";
import { List } from "./../pages/(dashboard)/dashboard/list/page";
import Dashboard from "./../pages/(dashboard)/dashboard/tongquan/page";
import Page from "./../pages/(website)/shop/shop";
import PrivateRoute from "./PrivateRoute";

import History from "@/pages/(website)/myOrder/_components/history";

// import SearchResultsPage from "@/pages/(website)/_component/SearchResultsPage";

// import History from "@/pages/(website)/mywallet/history";
import RefundRequests from "@/pages/(dashboard)/dohoan/donhoan";
import WithdrawalRequests from "@/pages/(dashboard)/dohoan/ruttien";
import Page2 from "@/pages/(website)/_component/shop";
// import ProductsList from "@/pages/(website)/Shopuudai/_components/ProductsList";
import Test4 from "@/pages/(van_chuyen)/TransportDetail";
import NapTien from "@/pages/(website)/mywallet/NapTien";
import WalletProtectedRoute from "./WalletProtectedRoute";

// import ThankYouPage1 from "@/pages/(website)/thankyou/you";
// import PaymentStatus from "@/pages/(website)/mywallet/PaymentStatus";
import AllTransport from "@/pages/(van_chuyen)/AllTransport";
import Blog from "@/pages/(website)/blog/Blog";
import BlogCategories from "@/pages/(website)/blog/BlogCategories";
import BlogDetail from "@/pages/(website)/blog/BlogDetail";

import NotificationPage1 from "@/pages/(dashboard)/_component/Notificationstb";
import { ActionLog } from "@/pages/(dashboard)/ActionLog/page";
import AdminProfile from "@/pages/(dashboard)/adminProfile/admin-profile/AdminProfile";
import ShopDM from "@/pages/(website)/shopdm/shop";
import Page4 from "@/pages/(website)/_component/shop";

import Page3 from "@/pages/(website)/Shopuudai/shop";
import HoanTien from "@/pages/(website)/myOrder/_components/Hoan";

import Danhgias from "@/pages/(website)/myOrder/_components/Danhgias";

import ReturnOrders1 from "@/pages/(dashboard)/dohoan/hoanhang/page";
import ReturnOrders from "@/pages/(van_chuyen)/ReturnOrders";
import RemoteEvaluate from "@/pages/(dashboard)/evaluate/RemoteEvaluate";
import Test from "@/pages/(dashboard)/test";
import Test3 from "@/pages/(website)/abc";
import PrivateShipper from "./PrivateShipper";
const Router = () => {
  //

  return (
    <>
      {" "}
      <ScrollToTop />
      <Routes>
        {/* TRang USER */}
        <Route path="/" element={<LayoutWebsite />}>
          <Route index element={<HomePage />} />
          <Route path="/shop" element={<Page />} />
          <Route path="/shop/:tenDanhMucCha" element={<ShopDM />} />
          <Route
            path="/shop/:tenDanhMucCha/:tenDanhMucCon"
            element={<ShopDM />}
          />
          <Route
            path="/shop/:tenDanhMucCha/:tenDanhMucCon/:tenDanhMucConCapBa"
            element={<ShopDM />}
          />
          <Route path="/product-detail/:slug" element={<PageProductDetail />} />
          <Route path="/ourstory" element={<PageOur />} />
          <Route path="/shopp/:slug" element={<Page3 />} />
          <Route path="/vourcher" element={<Voucher />} />
          <Route path="/myorder" element={<MyOrder />} />
          <Route path="/ordersummary" element={<Ordersummary />} />
          <Route path="/payment" element={<Payment />} />{" "}
          <Route path="/contact" element={<Contact />} />
          <Route path="/gio-hang" element={<Cart />} />{" "}
          {/* <Route path="/test" element={<Test3 />} />{" "} */}
          <Route path="/thankyou" element={<ThankYouPage />} />{" "}
          <Route path="/checkout" element={<Layoutcheckout />} />{" "}
          <Route path="/search-results" element={<Page4 />} />
          <Route
            path="/shippingAddressPage"
            element={<ShippingAddressPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/mypro" element={<LayoutMyPro />}>
            <Route path="/mypro/myprofile" element={<MyProfile />} />{" "}
            <Route path="/mypro/myprofileedit" element={<MyProfileedit />} />{" "}
            <Route path="/mypro/myorder" element={<MyOrder />} />{" "}
            <Route path="/mypro/vocher" element={<MyVoucher />} />{" "}
            <Route path="/mypro/myorder/:slug" element={<MyOrderdetail />} />{" "}
            <Route path="/mypro/myorderdetail" element={<MyOrderdetail />} />{" "}
            <Route path="/mypro/mywishlist" element={<MyWishlists />} />{" "}
            <Route path="/mypro/savedcard" element={<SavedCard />} />{" "}
            <Route path="/mypro/notification" element={<Notification />} />{" "}
            <Route path="/mypro/notificationKm" element={<Notificationkm />} />{" "}
            <Route path="/mypro/setting" element={<Setting />} />
            <Route path="/mypro/danhgia/:slug" element={<Danhgias />} />
            {/* <Route path="/mypro/hoanhang/:slug" element={<HoanTien />} /> */}
            <Route path="/mypro/hoanhang/:slug" element={<HoanTien />} />
            {/* <Route path="/mypro/wallet" element={<TaiChinh />} />
            <Route path="/mypro/WithdrawPage" element={<WithdrawPage />} />
            <Route path="/mypro/bank" element={<BankAccount />} />
            <Route path="/mypro/naptien" element={<NapTien/>} /> */}
            <Route path="/mypro/wallet" element={<TaiChinh />} />
            <Route
              path="/mypro/WithdrawPage"
              element={
                <WalletProtectedRoute>
                  <WithdrawPage />
                </WalletProtectedRoute>
              }
            />
            <Route
              path="/mypro/bank"
              element={
                <WalletProtectedRoute>
                  <BankAccount />
                </WalletProtectedRoute>
              }
            />
            <Route
              path="/mypro/naptien"
              element={
                <WalletProtectedRoute>
                  <NapTien />
                </WalletProtectedRoute>
              }
            />
            <Route path="/mypro/doangthu" element={<RevenuePage />} />
            <Route path="/mypro/lichsu" element={<History />} />
            <Route
              path="/mypro/manageaddresses"
              element={<ManageAddresses />}
            />{" "}
            <Route path="***" element={<NotFoundPage />} />
          </Route>
          {/* chi tiết bài viêt */}
          <Route
            path="/tin-tuc-theo-danh-muc/:duong_dan"
            element={<NewDetail />}
          />
          <Route path="/blog" element={<Blog />} />
          <Route path="/danhmuctintuc/:duongDan" element={<BlogCategories />} />
          <Route path="/xem-bai-viet/:duong_dan" element={<BlogDetail />} />
        </Route>
        {/* TRang admin */}
        <Route
          path="admin"
          element={
            <PrivateRoute>
              <>
                <LayoutAdmin />
              </>
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard/list" />} />
          <Route path="dashboard/list" element={<Dashboard />} />
          <Route path="dashboard/doanhthu" element={<List />} />
          <Route path="dashboard/sanpham" element={<SanPham />} />
          <Route path="dashboard/taikhoan" element={<TaiKhoan />} />
          <Route path="dashboard/thongbao" element={<NotificationPage1 />} />
          {/* Sản phẩm  */}
          <Route
            path="products"
            element={<Navigate to="/admin/products/list" />}
          />{" "}
          <Route path="products/list" element={<ProductsAdmin />} />
          {/* <Route path="products/add" element={<ProductsAdd />} /> */}
          <Route path="products/addd" element={<AddProducts />} />
          <Route path="products/edit/:id" element={<EditProducts />} />
          {/* <Route path="products/edit/:id" element={<ProductsEdit />} /> */}
          <Route path="products/remote" element={<ProductsRemote />} />
          {/* <Route path="products/adds" element={<Productsadd />} /> */}
          {/* Biến thể */}
          {/* <Route path="products/detaile" element={<Detail item={{
            id: 0
          }} />} /> */}
          {/* Biến thể */}
          <Route path="products/bienthe" element={<Bienthe />} />
          <Route path="products/bienthecolor/edit/:id" element={<Color />} />
          <Route path="products/bienthesize/edit/:id" element={<Size />} />
          <Route path="products/bienthe/remote" element={<Remotecolor />} />
          <Route path="products/bienthe/remotesize" element={<Remotesize />} />
          {/* Tag */}
          <Route path="products/tags" element={<Tags />} />
          <Route path="products/tags/add" element={<Tagsadd />} />
          <Route path="products/tags/edit/:id" element={<Tagsedit />} />
          <Route path="products/tags/remote" element={<TagsRemoteAdmin />} />
          {/* danh mục */}
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="categories/add" element={<CategoriesAdd />} />
          <Route path="categories/edit/:id" element={<CategoriesEdit />} />
          <Route path="categories/remote" element={<CategoriesRemote />} />{" "}
          {/* danh mục tin tức */}
          <Route path="newcategory" element={<NewCategory />} />
          <Route path="newcategory/add" element={<NewCategoriesAdd />} />
          <Route path="newcategory/edit/:id" element={<NewCategoriesEdit />} />
          <Route path="newcategory/remote" element={<NewCategoriesRemote />} />
          {/* đơn hàng */}
          <Route
            path="orders"
            element={<Navigate to="/admin/orders/transport" />}
          />
          <Route path="orders/list" element={<OrderAdmin />} />
          <Route path="orders/transport" element={<PageTransport />} />
          <Route
            path="orders/uncomfirmedorder"
            element={<TableUncomfirmedOrder />}
          />
          <Route path="orders/ruttien" element={<WithdrawalRequests />} />
          <Route path="orders/donhoan" element={<RefundRequests />} />
          <Route path="orders/collect" element={<Collect />} />
          <Route path="orders/hoanhang" element={<ReturnOrders1 />} />
          {/* khuyến mãi */}
          <Route path="vouchers" element={<VoucherAdmin />} />{" "}
          <Route path="add-vocher" element={<AddVoucher />} />
          <Route path="vouchers/show/:id" element={<ShowVoucher />} />
          <Route path="vouchers/edit/:id" element={<EditVoucher />} />
          {/* trương trình ưu đâix */}
          <Route path="chuongtrinhuudai" element={<ChuongTrinhUuDai />} />
          <Route path="chuongtrinhuudaiadd" element={<ChuongTrinhUuDaiAdd />} />
          <Route
            path="chuongtrinhuudai/edit/:id"
            element={<ChuongTrinhUuDaiEdit />}
          />
          <Route
            path="chungtrinhuudai/remote"
            element={<ChuongTrinhUuDaiRemote />}
          />
          {/* Tài khoản khách hàng */}
          <Route
            path="users"
            element={<Navigate to="/admin/users/khachhang" />}
          />{" "}
          <Route path="users/khachhang" element={<UsersAdminkhachhang />} />
          <Route path="users/khachhang/add" element={<UserskhachhangAdd />} />
          <Route
            path="users/khachhang/edit/:id"
            element={<UserskhachhangEdit />}
          />
          <Route
            path="users/khachhang/remote"
            element={<UserskhachangRemote />}
          />{" "}
          <Route path="users/khachhang/show/:id" element={<ShowUser />} />
          {/* tài khoản Nhân viên */}
          <Route path="users/nhanvien" element={<UsersAdminNhanvien />} />
          <Route path="users/nhanvien/add" element={<UsersNhanvienAdd />} />
          <Route
            path="users/nhanvien/edit/:id"
            element={<UsersnhanvienEdit />}
          />
          <Route path="users/nhanvien/show/:id" element={<ShowNhanvien />} />
          <Route
            path="users/nhanvien/remote"
            element={<UsersRemoteNhanvien />}
          />
          {/* Hạng thành viên */}
          <Route path="users/rank" element={<Rank />} />
          <Route path="users/rankadd" element={<MemberRankForm />} />
          <Route path="users/remoterank" element={<Remoterank />} />
          <Route path="users/rank/edit/:id" element={<MemberRank />} />
          {/* Đánh giá */}
          <Route path="evaluates" element={<EvaluateAdmin />} />
          <Route path="remote/evaluates" element={<RemoteEvaluate />} />
          {/* liên hệ */}
          <Route path="support" element={<PageSupport />} />
          <Route path="support/feedback" element={<Feedback />} />
          {/* Tin tức */}
          <Route path="news" element={<PageNew />} />
          <Route path="news/add" element={<NewAdd />} />
          <Route path="news/edit/:id" element={<NewEdit />} />
          <Route path="news/remote" element={<RemoteNew />} />
          <Route path="news/details/:id" element={<ViewNew />} />
          {/* Thống kê */}
          <Route path="analytics" element={<AnalyticsAdmin />} />
          <Route path="centralstocks" element={<CentralStock />} />
          <Route path="suportuser" element={<Suportuser />} />
          <Route path="revenues" element={<RevenueAdmin />} />
          <Route path="list" element={<List />} />
          <Route
            path="ADmin"
            element={<Navigate to="/admin/ADmin/privilegeadmin" />}
          />
          {/* vận chuyển */}
          <Route path="transport" element={<PageTransport />} />
          <Route
            path="transport/uncomfirmedorder"
            element={<TableUncomfirmedOrder />}
          />
          //vai trò
          {/* //vai trò */}
          <Route
            path="ADmin/userprivileges"
            element={<UserPrivilegeAdmin />}
          />{" "}
          <Route
            path="ADmin/userprivileges/add-permission"
            element={<PageAddPermission />}
          />
          <Route
            path="ADmin/userprivileges/show/:id"
            element={<Showvaitro />}
          />
          <Route
            path="ADmin/userprivileges/edit-permission/:id"
            element={<PageEditPermission />}
          />
          {/* Profile admin */}
          <Route path="admin-profile" element={<AdminProfile />} />
          <Route path="taikhoan/:id" element={<IntroCard />} />
          {/* Nội dung */}
          <Route
            path="Content"
            element={<Navigate to="/admin/Content/qlfooter" />}
          />
          <Route path="Content/qlfooter" element={<Content />} />
          <Route path="Content/qlbanner" element={<BannerManagement />} />
          {/* Lịch sử thao tác */}
          <Route path="history" element={<ActionLog />} />
          {/* Error */}
          <Route path="*" element={<NotFoundPage />} />
          {/* Chưa dùng đến */}
          <Route path="test" element={<Test />} />
          <Route path="ADmin/privilegeadmin" element={<PagePrivilegeAdmin />} />
          <Route path="add-admin" element={<PageAddAdmin />} />
        </Route>{" "}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/EnterOtp" element={<OTPPage />} />
        <Route path="/error" element={<ErrorAuth />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/loginSuccessfull" element={<LoginSuccessfull />} />
        <Route path="/shipper" element={<Shipper />} />
        <Route
          path="/shipper2"
          element={
            <PrivateShipper>
              <AllTransport />
            </PrivateShipper>
          }
        />
        <Route path="/return-orders" element={<ReturnOrders />} />
        <Route path="/test2" element={<Test4 />} />{" "}
        <Route path="/test" element={<Test3 />} />
      </Routes>
    </>
  );
};

export default Router;
