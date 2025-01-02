"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { getProductBySearch } from "@/actions/product";
import ProductCard from "../_components/ProductCard/ProductCart";
import { ProductType } from "@/type/type";
import { ChangeEvent, Suspense, useEffect, useState } from "react";

function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [search, setSearch] = useState(q);
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${search}`);
  };
  const { data: products } = useQuery<ProductType[]>({
    queryKey: ["search", q],
    queryFn: () => getProductBySearch(q),
  });
  useEffect(() => {
    setSearch(q);
  }, [q]);
  return (
    <div className={styles.search}>
      <div className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.searchBar}>
          <input
            required
            value={search || ""}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button type="submit">SEARCH</button>
        </form>
        {products && products.length > 0 ? (
          <div className={styles.products}>
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.null}>
            <span>판매중인 상품이 없습니다.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}