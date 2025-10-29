import LogoBlack from "@/editor/assets/img/treege-black.svg";
import LogoWhite from "@/editor/assets/img/treege-white.svg";

interface LogoProps {
  theme?: "dark" | "light";
}

const Logo = ({ theme = "dark" }: LogoProps) => (
  <div className="absolute left-5 top-5 z-50 select-none">
    <img
      src={theme === "dark" ? LogoWhite : LogoBlack}
      alt="Treege"
      className="relative w-auto h-14 drop-shadow-[0_0px_35px] drop-shadow-blue-600"
    />
  </div>
);
export default Logo;
