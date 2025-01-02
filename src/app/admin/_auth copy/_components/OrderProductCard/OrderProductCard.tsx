import Link from "next/link";
import styles from "./OrderProductCard.module.css";
import { CartProductType } from "@/type/type";
import { useEffect, useState } from "react";

export default function OrderProductCard({
  product,
}: {
  product: CartProductType;
}) {
  const [total, setTotal] = useState<number>();
  useEffect(() => {
    const cal = Number(product.price) * Number(product.cartStock.stock.qty);
    setTotal(cal);
  }, [product]);
  return (
    <div className={styles.OrderProductCard}>
      <div className={styles.mainCenter}>
        <div className={styles.product}>
          <Link
            href={`/collections/product/${product.id}`}
            className={styles.image}
          >
            <img src={product.img[0]} />
          </Link>
          <div className={styles.productDetail}>
            <Link href={`/collections/product/${product.id}`}>
              {product.name}
            </Link>
            <p>{product.cartStock.stock.size}</p>
          </div>
        </div>
        <div className={styles.price}>
          <span>{`₩${product?.price}`}</span>
        </div>
        <div className={styles.qtyAndRemove}>
          <span>{product.cartStock.stock.qty}</span>
        </div>
        <div className={styles.total}>{`₩${total}`}</div>
      </div>
    </div>
  );
}
