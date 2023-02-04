import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { v4 as uuidv4 } from "uuid";
import "swiper/css/bundle";
import ListingItem from "./ListingItem";
import { FavoritesContext } from "../context/FavoritesContext";
import ListingItemSkeleton from "../skeletons/ListingItemSkeleton";
import { useContext } from "react";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function ListingsCarousel({ listings, loading, ...rest }) {
  // console.log(rest);
  const { checkFavorite } = useContext(FavoritesContext);
  return (
    <Swiper {...rest}>
      {loading &&
        listings.map((item) => (
          <SwiperSlide key={uuidv4()} className="px-1 py-4">
            <ListingItemSkeleton />
          </SwiperSlide>
        ))}
      {!loading &&
        listings.map(({ docID, data }) => (
          <SwiperSlide key={docID} className="px-1 py-4">
            <ListingItem
              {...data}
              docID={docID}
              isFavorite={checkFavorite(docID)}
            />
          </SwiperSlide>
        ))}
    </Swiper>
  );
}

export default ListingsCarousel;
