import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import ListingItem from "./ListingItem";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function ListingsCarousel({ listings, ...rest }) {
  console.log(rest);
  return (
    <Swiper {...rest}>
      {listings.map(({ docID, data }) => (
        <SwiperSlide key={docID} className="px-1 py-4">
          <ListingItem {...data} docID={docID} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ListingsCarousel;
