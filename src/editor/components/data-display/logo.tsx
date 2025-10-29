import LogoBlack from "@/editor/assets/img/treege-black.svg";
import LogoWhite from "@/editor/assets/img/treege-white.svg";

interface LogoProps {
  theme?: "dark" | "light";
}

const Logo = ({ theme = "dark" }: LogoProps) => (
  <div className="absolute top-5 left-5 z-50 select-none">
    <img
      src={theme === "dark" ? LogoWhite : LogoBlack}
      alt="Treege"
      className="relative h-14 w-auto drop-shadow-[0_0px_35px] drop-shadow-blue-600"
    />
  </div>
);
export default Logo;
