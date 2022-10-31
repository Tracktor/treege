interface TreePlusIconProps {
  color?: string;
  height?: string | number;
  width?: string | number;
}

const TreePlusIcon = ({ color, height = 20, width = 20 }: TreePlusIconProps) => (
  <svg focusable="false" x="0px" y="0px" viewBox="0 0 24 24" color={color} height={height} width={width}>
    <path
      fill="currentColor"
      d="M19.1,18H14v2c0,1.1-0.9,2-2,2s-2-0.9-2-2v-2H4.9c-0.8,0-1.3-0.9-0.8-1.5L7,12l0,0c-0.8,0-1.3-0.9-0.8-1.6l5-7.2
  c0.4-0.6,1.2-0.6,1.6,0l0.6,0.9c-0.8,0.8-1.2,2-1.2,3.2c0,2.6,2.1,4.7,4.7,4.7H17l3,4.5C20.4,17.1,19.9,18,19.1,18z"
    />
    <path
      fill="currentColor"
      d="M20.6,7.3c0,0.4-0.4,0.8-0.8,0.8h-2.1v2.1c0,0.4-0.4,0.8-0.8,0.8s-0.8-0.4-0.8-0.8V8.1H14c-0.5,0-0.8-0.4-0.8-0.8
  c0-0.5,0.4-0.8,0.8-0.8h2.1V4.4c0-0.5,0.4-0.8,0.8-0.8s0.8,0.4,0.8,0.8v2.1h2.1C20.3,6.5,20.6,6.8,20.6,7.3z"
    />
  </svg>
);

export default TreePlusIcon;
