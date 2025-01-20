import { Box } from "@tracktor/design-system";
import LogoSvg from "@/assets/img/treege-white.svg";

const Logo = () => (
  <Box
    sx={{
      position: "relative",
    }}
  >
    <Box
      sx={{
        background: ({ palette }) => `radial-gradient(circle, ${palette.primary.main}80 0%, ${palette.primary.main}00 70%)`,
        filter: "blur(12px)",
        height: 30,
        position: "absolute",
        transform: "scale(1.2)",
        width: 30,
      }}
    />
    <img src={LogoSvg} alt="Treege" height={30} width="auto" />
  </Box>
);

export default Logo;
