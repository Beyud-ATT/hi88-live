import { Image } from "antd";
import LogoImg from "../assets/logo.png";
import { Link } from "react-router";

export default function Logo(props) {
  return (
    <>
      <Link to={import.meta.env.VITE_HOME_URL} target="_blank">
        <Image
          src={LogoImg}
          alt="logo"
          loading="lazy"
          preview={false}
          width={156}
          height={55}
          {...props}
        />
      </Link>
    </>
  );
}
