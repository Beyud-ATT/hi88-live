import { App, ConfigProvider } from "antd";

export default function CustomConfigProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: "var(--text-color)",
          colorPrimary: "var(--color-brand-primary)",
        },
        components: {
          Layout: {
            headerBg: "var(--background-color)",
            headerPadding: 0,
            headerHeight: "auto",
            bodyBg: "var(--background-color)",
            footerBg: "var(--background-color)",
          },
          Menu: {
            itemBg: "var(--background-color)",
            itemColor: "var(--color-brand-primary-lighter)",
            itemHoverColor: "var(--color-brand-primary)",
            itemSelectedColor: "var(--color-brand-primary)",
            itemSelectedBg: "var(--color-brand-primary-lighter)",
            itemHoverBg: "var(--color-brand-primary-lighter)",
            horizontalItemHoverColor: "var(--color-brand-primary)",
            horizontalItemSelectedColor: "var(--color-brand-primary)",
            horizontalLineHeight: "40px !important",
            groupTitleColor: "var(--color-brand-primary-lighter)",
          },
          Table: {
            headerBg: "var(--color-brand-primary)",
            borderColor: "white",
            rowHoverBg: "transparent",
            // headerBorderRadius: 0,
            headerColor: "white",
          },
          Tabs: {
            cardGutter: 0,
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
