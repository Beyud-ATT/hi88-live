import dayjs from "dayjs";
import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ImHourGlass } from "react-icons/im";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const Countdown = ({ time }) => {
  return (
    <div
      className="flex justify-center items-center gap-2 py-1 px-3 rounded-lg border"
      style={{ borderRadius: 6.49, background: "rgba(86, 86, 86, 0.64)" }}
    >
      <div className="flex flex-col md:gap-2 gap-1 items-center text-white lg:!text-[12px] md:!text-[10px] !text-[8px]">
        <div className={`font-bold md:text-[16px]`}>Live sẽ bắt đầu sau</div>
        <div className="mx-auto flex items-center md:gap-2 gap-1 pb-1">
          <CountdownItem unit="Day" timeToCount={time} />
          <CountdownItem unit="Hour" timeToCount={time} />
          <CountdownItem unit="Minute" timeToCount={time} />
          <CountdownItem unit="Second" timeToCount={time} />
        </div>
      </div>
    </div>
  );
};

const CountdownItem = ({ unit, text, timeToCount }) => {
  const { ref, time } = useTimer({ unit, timeToCount });

  return (
    <div className="w-full">
      <div className="flex items-center w-full overflow-hidden bg-black md:px-2 px-1 py-1 rounded-md font-bold">
        <span className="" ref={ref}>
          {time}
        </span>
        {text && <span className="mr-1">{text}</span>}
      </div>
    </div>
  );
};

export default Countdown;

// NOTE: Framer motion exit animations can be a bit buggy when repeating
// keys and tabbing between windows. Instead of using them, we've opted here
// to build our own custom hook for handling the entrance and exit animations
export const useTimer = ({ unit, timeToCount = 0 }) => {
  const [ref, animate] = useAnimate();

  const intervalRef = useRef(null);
  const timeRef = useRef(timeToCount);
  const [time, setTime] = useState(0);

  const handleCountdown = async () => {
    const end = new Date(timeToCount || Date.now());
    const now = new Date();
    const distance = +end - +now;

    let newTime = 0;

    if (unit === "Day") {
      newTime = Math.floor(distance / DAY);
    } else if (unit === "Hour") {
      newTime = Math.floor((distance % DAY) / HOUR);
    } else if (unit === "Minute") {
      newTime = Math.floor((distance % HOUR) / MINUTE);
    } else {
      newTime = Math.floor((distance % MINUTE) / SECOND);
    }

    newTime = (newTime >= 0 ? newTime : 0).toString().padStart(2, "0");

    if (newTime !== timeRef.current) {
      // Exit animation
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      // Enter animation
      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, [timeToCount]);

  return { ref, time };
};
