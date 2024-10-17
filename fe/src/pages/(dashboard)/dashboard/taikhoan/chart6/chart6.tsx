"use client";

import {
  // ChevronLeft,
  // ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  // PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";

export default function Chart6() {
  return (
    <Card className="overflow-hidden shadow-inner bg-gradient-to-r from-slate-400 to-black text-white">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Đơn hàng Oe31b70H
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Sao chép mã đơn hàng</span>
            </Button>
          </CardTitle>
          <CardDescription>Ngày: 23 tháng 11, 2023</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Theo dõi đơn hàng
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">Thêm</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
              <DropdownMenuItem>Xuất</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Chi tiết đơn hàng</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Đèn Glimmer x <span>2</span>
              </span>
              <span>$250.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Bộ lọc Aqua x <span>1</span>
              </span>
              <span>$49.00</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>$299.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Phí vận chuyển</span>
              <span>$5.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Thuế</span>
              <span>$25.00</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Tổng cộng</span>
              <span>$329.00</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Thông tin vận chuyển</div>
            <address className="grid gap-0.5 not-italic text-muted-foreground">
              <span>Liam Johnson</span>
              <span>1234 Main St.</span>
              <span>Anytown, CA 12345</span>
            </address>
          </div>
          <div className="grid auto-rows-max gap-3">
            <div className="font-semibold">Thông tin thanh toán</div>
            <div className="text-muted-foreground">
              Giống như địa chỉ vận chuyển
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Thông tin khách hàng</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Khách hàng</dt>
              <dd>Liam Johnson</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href="mailto:">liam@acme.com</a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Điện thoại</dt>
              <dd>
                <a href="tel:">+1 234 567 890</a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Thông tin thanh toán</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Visa
              </dt>
              <dd>**** **** **** 4532</dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Cập nhật <time dateTime="2023-11-23">23 tháng 11, 2023</time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent></PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
