import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

function HomeSliderText() {
  let arr = [
    "“To buy a nice home is to buy a better way of life. To choose a better way of life is to work toward well-being, and isn’t well-being what’s paramount?”",
    "“Peace is impossible to put a price upon and in most areas of life, unattainable, but purchasing your own home affords you a grand measure.”",
    "“Forget what they say, going home isn’t always all it’s cracked up to be anyway. Best to purchase your own and go home any time you like.”",
  ];
  return (
    <Swiper
      autoHeight={true}
      slidesPerView={1}
      autoplay={{
        delay: 5000,
        disableOnInteraction: true,
      }}
      className="listing-gallery-carousel"
    >
      {arr.map((item, index) => (
        <SwiperSlide key={index}>
          <p className="leading-loose mb-10 max-w-2xl mx-auto text-l lg:text-xl">
            {item}
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default HomeSliderText;
