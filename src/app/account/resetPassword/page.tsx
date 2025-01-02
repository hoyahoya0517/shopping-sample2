"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/auth";

function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!token) return;
      await resetPassword(newPassword, token);
      setIsResetPassword(true);
    } catch (error: any) {
      if (error.message === "expired token") {
        alert("비밀번호 변경은 메일을 받은 후 10분 안에 가능합니.");
      } else if (error.message) {
        alert(error.message);
      } else {
        alert("문제가 발생했습니다. 다시 시도하세요.");
      }
    }
  };
  useEffect(() => {
    if (!token) router.push("/account/forgotPassword");
  }, [token]);
  return (
    <div className={styles.resetPassword}>
      <form onSubmit={handleSubmit} className={styles.main}>
        <div className={styles.info}>
          <span>Reset your password</span>
        </div>
        <div className={styles.inputSection}>
          <input
            required
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            disabled={isResetPassword}
          />
        </div>
        <button
          type="submit"
          className={
            isResetPassword ? `${styles.disabledButton}` : `${styles.button}`
          }
          disabled={isResetPassword}
        >
          Submit
        </button>
        <div className={styles.menu}>
          <Link href={"/account/login"}>로그인</Link>
        </div>
        {isResetPassword && (
          <div className={styles.success}>
            <span>비밀번호 변경이 완료되었습니다.</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}