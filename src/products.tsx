import { IconButton } from "@mui/material";
import { useState, useEffect, ComponentProps } from "react";
import { ShopProduct } from "../models/ShopProduct";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';

export async function setProductFavorite(id: string, state: boolean) {
  await fetch('/api/products/setFavorite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, state }) });
}

export function ShopFavoriteButton(props: { product: ShopProduct } & ComponentProps<typeof IconButton>) {
  const { product, ...buttonProps } = props;
  const [favorite, setFavorite] = useState(product.favorite);

  useEffect(() => {
    setFavorite(product.favorite);
  }, [product.favorite]);

  return <>
    {favorite != null
      && <IconButton {...buttonProps} onClick={() => {
        const newFavorite = !favorite;
        setProductFavorite(props.product._id, newFavorite);
        setFavorite(newFavorite);
      }}>
        {
          favorite
            ? <StarIcon />
            : <StarOutlineIcon />
        }
      </IconButton>}
  </>
}
