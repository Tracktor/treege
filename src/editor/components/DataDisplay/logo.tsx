import LogoSvg from "@/editor/assets/img/treege-white.svg";

const Logo = () => (
  <div className="fixed left-5 top-5 z-50 select-none">
    <img src={LogoSvg} alt="Treege" className="relative w-auto h-14 drop-shadow-[0_0px_35px] drop-shadow-blue-600" />
  </div>
);

export default Logo;
