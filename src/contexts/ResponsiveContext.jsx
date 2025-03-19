import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Create context
const DeviceContext = createContext();

export const screenType = {
  PC: "PC",
  TABLET: "Tablet",
  MOBILE: "Mobile",
};

// Provider component
export const DeviceProvider = ({ children }) => {
  const [deviceType, setDeviceType] = useState(screenType.PC);
  const isMobile = useMemo(
    () => deviceType === screenType.MOBILE,
    [deviceType]
  );
  const isTablet = useMemo(
    () => deviceType === screenType.TABLET,
    [deviceType]
  );
  const isPC = useMemo(() => deviceType === screenType.PC, [deviceType]);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;

    if (width < 768) {
      setDeviceType(screenType.MOBILE);
    } else if (width < 1024) {
      setDeviceType(screenType.TABLET);
    } else {
      setDeviceType(screenType.PC);
    }
  }, []);

  useEffect(() => {
    // Set initial device type
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <DeviceContext.Provider value={{ deviceType, isMobile, isTablet, isPC }}>
      {children}
    </DeviceContext.Provider>
  );
};

function PC({ children }) {
  const { deviceType } = useDevice();

  return deviceType === screenType.PC ? <>{children}</> : null;
}

function Tablet({ children }) {
  const { deviceType } = useDevice();
  return deviceType === screenType.TABLET ? <>{children}</> : null;
}

function Mobile({ children }) {
  const { deviceType } = useDevice();
  return deviceType === screenType.MOBILE ? <>{children}</> : null;
}

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
};

DeviceProvider.PC = PC;
DeviceProvider.TABLET = Tablet;
DeviceProvider.MOBILE = Mobile;

export default DeviceProvider;
