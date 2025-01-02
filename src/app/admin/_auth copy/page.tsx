"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "@/type/type";
import { getAdminUser } from "@/actions/admin";
import AdminUserCard from "./_components/AdminUserCard/AdminUserCard";
import { getUserInfo } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function Auth() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("email");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("createdAt");
  const [options, setOptions] = useState("?createdAt=-1");
  const [nameFilter, setNameFilter] = useState("오름차순");
  const [createdAtFilter, setCreatedAtFilter] = useState("최신");
  const [isAdminFilter, setIsAdminFilter] = useState("어드민o");
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });
  const { data: users } = useQuery<UserType[]>({
    queryKey: ["admin", "user", options],
    queryFn: () => getAdminUser(options),
  });
  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (search) searchParams.set("q", search);
    if (filter === "name") {
      if (nameFilter === "오름차순") {
        searchParams.set("name", "1");
      } else {
        searchParams.set("name", "-1");
      }
    } else if (filter === "createdAt") {
      if (createdAtFilter === "최신") {
        searchParams.set("createdAt", "-1");
      } else {
        searchParams.set("createdAt", "1");
      }
    } else if (filter === "isAdmin") {
      if (isAdminFilter === "어드민o") {
        searchParams.set("isAdmin", "-1");
      } else {
        searchParams.set("isAdmin", "1");
      }
    }
    searchParams.set("page", "1");
    setOptions(`?${searchParams.toString()}`);
    setCurrentPage(1);
  }, [filter, nameFilter, createdAtFilter, isAdminFilter]);
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(options);
    searchParams.set("q", search);
    searchParams.set("searchFilter", searchFilter);
    searchParams.set("page", "1");
    setOptions(`?${searchParams.toString()}`);
    setCurrentPage(1);
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(options);
    searchParams.set("page", String(currentPage));
    setOptions(`?${searchParams.toString()}`);
  }, [currentPage]);
  useEffect(() => {
    if (isError) router.push("/");
    if (!isLoading) {
      if (userInfo?.isAdmin === true) setUserIsAdmin(true);
      else router.push("/");
    }
  }, [userInfo, isLoading, isError]);
  if (!userIsAdmin) return <div className={styles.auth}></div>;
  return (
    <div className={styles.auth}>
      <div className={styles.main}>
        <form className={styles.search} onSubmit={handleSearch}>
          <select
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
          >
            <option value={"name"}>이름</option>
            <option value={"email"}>이메일</option>
            <option value={"phone"}>휴대전화</option>
          </select>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button>검색</button>
        </form>
        <div className={styles.top}>
          <div
            className={`${styles.topName} ${
              filter === "name" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("name");
              }}
            >
              이름
            </span>
            <select
              value={nameFilter}
              onChange={(e) => {
                setNameFilter(e.target.value);
              }}
            >
              <option value={"오름차순"}>오른차순</option>
              <option value={"내림차순"}>내림차순</option>
            </select>
          </div>
          <div
            className={`${styles.topCreatedAt} ${
              filter === "createdAt" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("createdAt");
              }}
            >
              등록일
            </span>
            <select
              value={createdAtFilter}
              onChange={(e) => {
                setCreatedAtFilter(e.target.value);
              }}
            >
              <option value={"최신"}>최신</option>
              <option value={"오래된"}>오래된</option>
            </select>
          </div>
          <div
            className={`${styles.topIsAdmin} ${
              filter === "isAdmin" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("isAdmin");
              }}
            >
              어드민
            </span>
            <select
              value={isAdminFilter}
              onChange={(e) => {
                setIsAdminFilter(e.target.value);
              }}
            >
              <option value={"어드민o"}>어드민o</option>
              <option value={"어드민x"}>어드민x</option>
            </select>
          </div>
        </div>
        <div className={styles.center}>
          {users &&
            users.map((user) => <AdminUserCard key={user.id} user={user} />)}
        </div>
        <div className={styles.bottom}>
          {Math.floor((currentPage - 1) / 10) * 10 - 10 + 1 > 0 && (
            <span
              className={styles.arrow}
              onClick={() => {
                setCurrentPage(
                  Math.floor((currentPage - 1) / 10) * 10 - 10 + 1
                );
              }}
            >
              <AiOutlineLeft size={12} color="black" />
            </span>
          )}
          {Array.from(
            { length: 10 },
            (v, i) => Math.floor((currentPage - 1) / 10) * 10 + i + 1
          ).map((page) => (
            <span
              className={page === currentPage ? `${styles.selectPage}` : ``}
              key={page}
              onClick={() => {
                setCurrentPage(page);
              }}
            >
              {page}
            </span>
          ))}
          <span
            className={styles.arrow}
            onClick={() => {
              setCurrentPage(Math.floor((currentPage - 1) / 10) * 10 + 10 + 1);
            }}
          >
            <AiOutlineRight size={12} color="black" />
          </span>
        </div>
      </div>
    </div>
  );
}
