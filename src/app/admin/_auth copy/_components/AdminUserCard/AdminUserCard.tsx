import { OrderType, UserType } from "@/type/type";
import styles from "./AdminUserCard.module.css";
import dayjs from "dayjs";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminUser, updateAdminUser } from "@/actions/admin";
import OrderCard from "../OrderCard/OrderCard";
dayjs.locale("ko");

export default function AdminUserCard({ user }: { user: UserType }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>(user.name);
  const [phone, setPhone] = useState<string>(user.phone);
  const [isAdmin, setIsAdmin] = useState<boolean>(user.isAdmin);
  const [address1, setAddress1] = useState<string>(user.address1);
  const [address2, setAddress2] = useState<string>(user.address2);
  const [zipcode, setZipcode] = useState<string>(user.zipcode);
  const [orders] = useState<OrderType[]>(user.orders);
  const [newPassword, setNewPassword] = useState<string>("");
  const updateUserMutate = useMutation({
    mutationFn: async () => {
      await updateAdminUser(
        user.id,
        name,
        isAdmin,
        phone,
        address1,
        address2,
        zipcode,
        newPassword
      );
    },
    onSuccess: () => {
      setNewPassword("");
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
    },
  });
  const deleteUserMutate = useMutation({
    mutationFn: async () => {
      await deleteAdminUser(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
    },
  });
  return (
    <div className={styles.adminUserCard}>
      <div className={styles.top}>
        <div className={styles.name}>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className={styles.createdAt}>
          {dayjs(user?.createdAt).format("YYYY.MM.DD HH:mm")}
        </div>
        <div className={styles.isAdmin}>
          <select
            value={isAdmin ? "true" : "false"}
            onChange={(e) => {
              if (e.target.value === "true") setIsAdmin(true);
              else setIsAdmin(false);
            }}
          >
            <option value={"true"}>true</option>
            <option value={"false"}>false</option>
          </select>
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.centerLeft}>
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
              value={address1 || ""}
              onChange={(e) => {
                setAddress1(e.target.value);
              }}
            />
          </div>
          <div className={styles.centerLeftDiv}>
            <span>상세주소</span>
            <input
              value={address2 || ""}
              onChange={(e) => {
                setAddress2(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={styles.centerRight}>
          <div className={styles.centerRightDiv}>
            <span>이메일</span>
            <input value={user.email} disabled />
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
          <div className={styles.centerRightDiv}>
            <span>비밀번호</span>
            <input
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        {orders.map((order) => (
          <OrderCard key={order.orderId} order={order} />
        ))}
      </div>
      <div className={styles.buttom}>
        <button
          type="submit"
          onClick={() => {
            const check = confirm("정말로 삭제하시겠습니까?");
            if (check) deleteUserMutate.mutate();
          }}
        >
          유저 삭제
        </button>
        <button
          onClick={() => {
            updateUserMutate.mutate();
          }}
          type="submit"
        >
          유저 업데이트
        </button>
      </div>
    </div>
  );
}
