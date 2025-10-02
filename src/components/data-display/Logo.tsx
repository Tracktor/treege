import LogoSvg from "@/assets/img/treege-white.svg";

const Logo = () => (
  <div className="fixed left-5 top-5 z-50">
    <img src={LogoSvg} alt="Treege" className="relative w-auto h-16 drop-shadow-[0_0px_35px_rgba(0,0,0,0.25)] drop-shadow-blue-600" />
  </div>
);

export default Logo;
