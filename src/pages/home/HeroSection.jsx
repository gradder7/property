import { Link } from "react-router-dom";
import heroSectionBg from "../../assets/images/hero-section-bg.jpg";
import useAuthStatus from "../../hooks/useAuthStatus";
import Typewriter, { TypewriterClass } from "typewriter-effect";
import { getAuth } from "firebase/auth";
import TypewriterComponent from "typewriter-effect";
import HomeSliderText from "./HomeSliderText";
function HeroSection() {
  const { loggedIn } = useAuthStatus();
  const auth = getAuth();

  return (
    <section className="relative overflow-hidden bg-gray-900 text-gray-300 px-3 min-h-[40rem] flex items-center justify-center">
      <div className="w-full max-w-7xl text-center py-14">
        <h1 className="text-white text-5xl lg:text-7xl font-extrabold mb-4">
          Rent or sell house at best price.
        </h1>
        <h1 className="text-white text-3xl lg:text-4xl font-extrabold mb-3">
          Buy | Rent | Sell
        </h1>
        <h1 className="text-green-400 text-5xl lg:text-4xl font-extrabold mb-4">
          <TypewriterComponent
            options={{
              strings: ["PentHouse", "Apartment", "Villa"],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>

       <HomeSliderText/>
        
        <div className="flex items-center justify-center flex-wrap gap-4">
          {loggedIn ? (
            <h2 className="text-green-400 text-4xl font-bold text-white-900 mb-2 text-center">
              Welcome {auth.currentUser.displayName}{" "}
            </h2>
          ) : (
            <Link
              to="/login"
              className="btn bg-white text-gray-900 hover:bg-gray-200 flex-shrink-0 w-[160px]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
