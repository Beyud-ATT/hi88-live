import { Flex, Image } from "antd";

export function UserProfileFrame({ data }) {
  return (
    <div className="relative w-[260px] h-[160px] bg-[url('/user-frame.png')] bg-contain bg-center bg-no-repeat">
      <div className="z-10 absolute top-[34px] left-[76px] translate-x-1 w-[100px] h-[100px] rounded-full overflow-hidden">
        <Flex
          vertical
          justify="center"
          align="center"
          className="w-full h-full"
        >
          <Image
            src={data?.avatar}
            alt="image"
            preview={false}
            loading="lazy"
            className="overflow-hidden rounded-full"
          />
        </Flex>
      </div>
      <p
        className="absolute z-20 bottom-0 left-[35%] font-bold md:text-lg text-sm uppercase text-[var(--color-brand-primary)] py-1 px-2"
        style={{
          borderRadius: 8.74,
          background:
            "linear-gradient(178deg, #9DE2FF 1.64%, #C8E9F8 98.24%), rgba(255, 255, 255, 0.40)",
        }}
      >
        {data?.displayName?.slice(0, 4).concat("...")}
      </p>
    </div>
  );
}
