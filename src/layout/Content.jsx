import { useLayoutContext } from "./Index";

export default function BaseContent({ children, ...rest }) {
  const { Content } = useLayoutContext();

  return <Content {...rest}>{children}</Content>;
}
