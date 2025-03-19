import {
  Form,
  Input,
  Button,
  Typography,
  Upload,
  Image,
  Flex,
  Divider,
} from "antd";
import { FaRegUser, FaTrash } from "react-icons/fa";
import PhoneInputField from "../../../components/PhoneInputField";
import useAccount from "../../../hooks/useAccount";
import { useEffect, useState } from "react";
import useUpdateAccount from "../../../hooks/useUpdateAccount";
import DeviceProvider from "../../../contexts/ResponsiveContext";
// import CustomDatePicker from "../../../components/CustomDatePicker";

const ProfileForm = () => {
  const { data, isLoading } = useAccount();
  const accountData = data?.data?.data;
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const { mutate: updateAccount, isLoading: isUpdating } = useUpdateAccount();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isLoading && data && !isUpdating) {
      if (accountData) {
        form.setFieldsValue(accountData);
      }
    }
  }, [isLoading, accountData, data, form, isUpdating]);

  // const handleCopy = (text) => {
  //   navigator.clipboard.writeText(text);
  // };

  const handleRemoveAvatar = () => {
    setNewAvatar(null);
    handleFinish({
      ...accountData,
      avatar: "",
    });
  };

  const handleRemoveCover = () => {
    setNewCover(null);
    handleFinish({
      ...accountData,
      cover: "",
    });
  };

  const handleFinish = (values) => {
    try {
      const data = {
        ...values,
        newAvatar,
        newCover,
      };

      updateAccount(data, {
        onSuccess: () => {
          localStorage.setItem("displayName", data.displayName);
        },
      });
      setNewAvatar(null);
      setNewCover(null);
      form.resetFields();
    } catch (error) {
      console.error("Error in signup:", error);
    }
  };

  return (
    <>
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)] lg:text-left text-center lg:!mb-4 uppercase font-bold"
      >
        Thay đổi hồ sơ cá nhân
      </Typography.Title>
      <div className="md:w-[80%] w-full h-full md:py-8 px-4 lg:mx-0 mx- mb-10 md:bg-[var(--user-form-bg)] rounded-xl md:border-[2px] border-[var(--border-color)]">
        <DeviceProvider.MOBILE>
          <Divider
            className={`md:w-2/3 w-full mx-auto !border-[var(--color-brand-primary)]`}
          />
        </DeviceProvider.MOBILE>
        <Form
          form={form}
          id="profile-form"
          className="md:w-2/3 w-full mx-auto space-y-4"
          onFinish={handleFinish}
          layout="vertical"
          disabled={isLoading || isUpdating}
        >
          <Form.Item name="avatar" hidden>
            <Input placeholder="avatar" hidden />
          </Form.Item>

          <Form.Item name="cover" hidden>
            <Input placeholder="cover" hidden />
          </Form.Item>

          <Form.Item
            name="newAvatar"
            label={
              <span className="text-[var(--color-brand-primary)]">
                Hình đại diện
              </span>
            }
          >
            <Flex gap={10}>
              {accountData?.avatar && (
                <Image
                  src={accountData?.avatar}
                  alt="avatar"
                  loading="lazy"
                  width={100}
                />
              )}
              <Flex gap={4}>
                <Upload
                  listType="picture-circle"
                  maxCount={1}
                  beforeUpload={(file) => {
                    setNewAvatar(file);
                    return false;
                  }}
                  showUploadList={{ showPreviewIcon: false }}
                >
                  <FaRegUser className="text-xl text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] w-full h-full p-4" />
                </Upload>
                <Button
                  type="text"
                  icon={<FaTrash />}
                  className="text-[var(--color-brand-primary)]"
                  onClick={handleRemoveAvatar}
                >
                  Xóa
                </Button>
              </Flex>
            </Flex>
          </Form.Item>

          <Form.Item
            name="newCover"
            label={
              <span className="text-[var(--color-brand-primary)]">
                Ảnh cover
              </span>
            }
          >
            <Flex gap={10}>
              {accountData?.cover && (
                <Image
                  src={accountData?.cover}
                  alt="cover"
                  loading="lazy"
                  className="aspect-square"
                />
              )}
              <Flex gap={4}>
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={(file) => {
                    setNewCover(file);
                    return false;
                  }}
                  showUploadList={{ showPreviewIcon: false }}
                >
                  <FaRegUser className="text-xl text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] w-full h-full p-4" />
                </Upload>
                <Button
                  type="text"
                  icon={<FaTrash />}
                  className="text-[var(--color-brand-primary)]"
                  onClick={handleRemoveCover}
                >
                  Xóa
                </Button>
              </Flex>
            </Flex>
          </Form.Item>

          <Form.Item
            name="username"
            label={
              <span className="text-[var(--color-brand-primary)]">
                Tài khoản
              </span>
            }
            disabled
          >
            <Input
              placeholder="Tên đăng nhập"
              disabled
              className="!bg-[var(--disabled-field-bg)]"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span className="text-[var(--color-brand-primary)]">Email</span>
            }
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>

          {/* <Form.Item name="referralCode">
            <Input
              placeholder="Mã giới thiệu"
              suffix={
                <Button
                  type="text"
                  icon={<FaCopy />}
                  className="text-orange-500"
                  onClick={() => handleCopy(form.getFieldValue("referralCode"))}
                >
                  Sao chép
                </Button>
              }
            />
          </Form.Item> */}

          {/* <Form.Item name="referralLink">
            <Input
              placeholder="Đường dẫn giới thiệu"
              suffix={
                <Button
                  type="text"
                  icon={<FaCopy />}
                  className="text-orange-500"
                  onClick={() => handleCopy(form.getFieldValue("referralLink"))}
                >
                  Sao chép
                </Button>
              }
            />
          </Form.Item> */}

          <Form.Item
            name="displayName"
            label={
              <span className="text-[var(--color-brand-primary)]">
                Tên hiển thị
              </span>
            }
          >
            <Input placeholder="Tên hiển thị" />
          </Form.Item>

          {/* <Form.Item name="realName">
            <Input placeholder="Họ tên thật (chữ cái là chữ hoa hoặc không dấu)" />
          </Form.Item> */}

          <Form.Item
            name="phone"
            label={
              <span className="text-[var(--color-brand-primary)]">
                Số diện thoại
              </span>
            }
          >
            <PhoneInputField
              inputClass="!ml-[10%] !w-[90%] !pl-2"
              value={data?.data?.data?.phone}
            />
          </Form.Item>

          {/* <Form.Item
        name="gender"
        label={<span className="text-[var(--color-brand-primary)]">Giới tính</span>}
      >
        <div className="flex items-center justify-between">
          <Radio.Group>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
            <Radio value="other">Khác</Radio>
          </Radio.Group>
          <Button type="text" icon={<FaTrash />} className="text-orange-500">
            Xóa
          </Button>
        </div>
      </Form.Item> */}

          {/* <Form.Item
        name="birthday"
        label={<span className="text-[var(--color-brand-primary)]">Ngày sinh</span>}
      >
        <div className="flex items-center justify-between">
          <CustomDatePicker />
          <Button
            type="text"
            icon={<FaTrash />}
            className="text-orange-500 ml-2"
          >
            Xóa
          </Button>
        </div>
      </Form.Item> */}

          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-[var(--color-brand-primary)] hover:!bg-[var(--color-brand-primary)] font-bold !mt-6"
            disabled={isLoading || isUpdating}
          >
            Lưu thông tin
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ProfileForm;
