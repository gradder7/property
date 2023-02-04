import { Link } from "react-router-dom";
import heroSectionBg from "../../assets/images/hero-section-bg.jpg";
import useAuthStatus from "../../hooks/useAuthStatus";
import { getAuth } from "firebase/auth";
import { coolGray } from "tailwindcss/colors";
function HeroSection() {
  const { loggedIn } = useAuthStatus();
  const auth = getAuth();

  return (
    <section className="relative overflow-hidden bg-gray-900 text-gray-300 px-3 min-h-[40rem] flex items-center justify-center">
      <div className="w-full max-w-7xl text-center py-14">
        <h1 className="text-white text-6xl lg:text-7xl font-extrabold mb-4">
          Rent or sell house at best price.
        </h1>
        <p className="leading-loose mb-10 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae quia
          tenetur consectetur voluptas deleniti iure quas aliquam laboriosam
          fuga quos.
        </p>
        <div className="flex items-center justify-center flex-wrap gap-4">
          {loggedIn ? (
            <h2 className="text-4xl font-bold text-white-900 mb-2 text-center">Welcome {auth.currentUser.displayName} </h2>
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
