import { CartProductType, OrderType } from "@/type/type";
import styles from "./OrderCard.module.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import OrderProductCard from "../OrderProductCard/OrderProductCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminUserOrder } from "@/actions/admin";
dayjs.locale("ko");

export default function OrderCard({ order }: { order: OrderType }) {
  const queryClient = useQueryClient();
  const [isClick, setIsClick] = useState<boolean>(false);
  const [name, setName] = useState(order.name);
  const [phone, setPhone] = useState(order.phone);
  const [address1, setAddress1] = useState(order.address1);
  const [address2, setAddress2] = useState(order.address2);
  const [zipcode, setZipcode] = useState(order.zipcode);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber);
  const [subtotal, setSubTotal] = useState<number>();
  const updateOrderMutate = useMutation({
    mutationFn: async () => {
      await updateAdminUserOrder({
        name,
        phone,
        address1,
        address2,
        zipcode,
        orderId: order.orderId,
        orderStatus,
        trackingNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "user"],
      });
    },
  });
  useEffect(() => {
    if (!order) return;
    let cal: number = 0;
    order.cart.forEach((product: CartProductType) => {
      cal += Number(product.price) * Number(product.cartStock.stock.qty);
    });
    setSubTotal(cal);
  }, [order]);
  return (
    <div className={styles.order}>
      <div className={styles.top}>
        <span>주문번호</span>
        <div>
          <span
            onClick={() => {
              setIsClick((prev) => !prev);
            }}
          >
            {order.orderId}
          </span>
        </div>
      </div>
      {isClick && (
        <>
          {" "}
          <div className={styles.center}>
            <div className={styles.centerLeft}>
              <div className={styles.centerLeftDiv}>
                <span>주문상태</span>
                <input
                  value={orderStatus}
                  onChange={(e) => {
                    setOrderStatus(e.target.value);
                  }}
                />
              </div>
              <div className={styles.centerLeftDiv}>
                <span>배송상태</span>
                <input
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                  }}
                />
              </div>
              <div className={styles.centerLeftDiv}>
                <span>우편번호</span>
                <input
                  value={zipcode}
                  type="text"
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1");
                    setZipcode(value);
                  }}
                />
              </div>
              <div className={styles.centerLeftDiv}>
                <span>주소</span>
                <input
                  value={address1}
                  onChange={(e) => {
                    setAddress1(e.target.value);
                  }}
                />
              </div>
              <div className={styles.centerLeftDiv}>
                <span>상세주소</span>
                <input
                  value={address2}
                  onChange={(e) => {
                    setAddress2(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className={styles.centerRight}>
              <div className={styles.centerRightDiv}>
                <span>구매일</span>
                <input
                  value={dayjs(order.createdAt).format("YYYY.MM.DD HH:mm")}
                  disabled
                />
              </div>
              <div className={styles.centerRightDiv}>
                <span>구매가격</span>
                <input value={order.amount} disabled />
              </div>
              <div className={styles.centerRightDiv}>
                <span>이름</span>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className={styles.centerRightDiv}>
                <span>이메일</span>
                <input value={order.email} disabled />
              </div>
              <div className={styles.centerRightDiv}>
                <span>휴대전화</span>
                <input
                  value={phone}
                  type="text"
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1");
                    setPhone(value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.maintop}>
              <span className={styles.mainTopPrice}>Price</span>
              <span className={styles.mainTopQty}>Quantity</span>
              <span className={styles.mainTopTotal}>Total</span>
            </div>
            {order &&
              order.cart.map((product: CartProductType, index: number) => (
                <OrderProductCard product={product} key={index} />
              ))}
          </div>
          <div className={styles.subtotal}>
            <div className={styles.subTotalMain}>
              <span>Subtotal</span>
              {subtotal && <span>{`₩${subtotal || 0}`}</span>}
            </div>
          </div>
          <div className={styles.buttom}>
            <button
              onClick={() => {
                updateOrderMutate.mutate();
              }}
              type="submit"
            >
              주문 업데이트
            </button>
          </div>
        </>
      )}
    </div>
  );
}
