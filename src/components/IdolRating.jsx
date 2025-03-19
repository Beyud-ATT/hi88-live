import { useMemo, useRef, useState } from "react";
import { CompoundModal, useModal } from "./CompoundModal";
import { Button, Form, Input } from "antd";
import useLiveDetail from "../hooks/useLiveDetail";
import { useParams } from "react-router";
import { UserProfileFrame } from "./UserProfileFrame";
import useIdolRate from "../hooks/useIdolRate";

const reviewContent = [
  "Chưa đánh giá",
  "Rất không hài lòng",
  "Không hài lòng",
  "Bình thường",
  "Hài lòng",
  "Rất hài lòng",
];

function EmptyStar() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="46"
      viewBox="0 0 44 46"
      fill="none"
    >
      <g clipPath="url(#clip0_1864_2820)">
        <path
          d="M42.9618 16.9463L28.7101 15.5944L23.0488 2.14989C22.6525 1.2085 21.3474 1.2085 20.951 2.14989L15.2899 15.5945L1.03815 16.9463C0.0402429 17.0409 -0.363061 18.3103 0.389836 18.9867L11.1428 28.6478L7.99598 42.9279C7.77564 43.9277 8.83146 44.7123 9.69316 44.189L22 36.7153L34.3068 44.189C35.1685 44.7123 36.2244 43.9277 36.0041 42.9279L32.8571 28.6478L43.6101 18.9867C44.363 18.3103 43.9597 17.0409 42.9618 16.9463Z"
          fill="#EBEBEB"
        />
        <path
          d="M23.0488 2.14989C22.6525 1.2085 21.3474 1.2085 20.951 2.14989L15.2899 15.5945L1.03815 16.9463C0.0402429 17.0409 -0.363061 18.3103 0.389836 18.9867L11.1428 28.6478L7.99598 42.9279C7.77563 43.9277 8.83146 44.7123 9.69315 44.189L12.44 42.5209C12.8202 26.5159 20.0913 15.2451 25.8481 8.79758L23.0488 2.14989Z"
          fill="#E0DDDD"
        />
      </g>
      <defs>
        <clipPath id="clip0_1864_2820">
          <rect
            width="44"
            height="45"
            fill="white"
            transform="translate(0 0.399902)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function FilledStar() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="46"
      viewBox="0 0 44 46"
      fill="none"
    >
      <g clipPath="url(#clip0_1864_2811)">
        <path
          d="M42.9618 16.9463L28.7101 15.5944L23.0488 2.14989C22.6525 1.2085 21.3474 1.2085 20.951 2.14989L15.2899 15.5945L1.03815 16.9463C0.0402429 17.0409 -0.363061 18.3103 0.389836 18.9867L11.1428 28.6478L7.99598 42.9279C7.77563 43.9277 8.83146 44.7123 9.69316 44.189L22 36.7153L34.3068 44.189C35.1685 44.7123 36.2244 43.9277 36.0041 42.9279L32.8571 28.6478L43.6101 18.9867C44.363 18.3103 43.9597 17.0409 42.9618 16.9463Z"
          fill="#FFDC64"
        />
        <path
          d="M23.0488 2.14989C22.6525 1.2085 21.3474 1.2085 20.951 2.14989L15.2899 15.5945L1.03815 16.9463C0.0402429 17.0409 -0.363061 18.3103 0.389836 18.9867L11.1428 28.6478L7.99598 42.9279C7.77563 43.9277 8.83146 44.7123 9.69315 44.189L12.44 42.5209C12.8202 26.5159 20.0913 15.2451 25.8481 8.79758L23.0488 2.14989Z"
          fill="#FFC850"
        />
      </g>
      <defs>
        <clipPath id="clip0_1864_2811">
          <rect
            width="44"
            height="45"
            fill="white"
            transform="translate(0 0.399902)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function IdolRatingContent() {
  const { id } = useParams();
  const [star, setStar] = useState(0);
  const [form] = Form.useForm();
  const { data } = useLiveDetail(id);
  const liveData = useMemo(() => data?.data?.data, [data]);
  const { closeModal } = useModal();

  const { mutate: idolRate, isLoading } = useIdolRate();

  function handleFinish(values) {
    idolRate(
      {
        ...values,
        idolId: liveData?.userId,
        rate: star,
      },
      {
        onSuccess: () => {
          localStorage.setItem(`${liveData?.userCode}-rate`, true);
          closeModal();
          form.resetFields();
          setStar(0);
        },
      }
    );
  }

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center mb-10">
        <UserProfileFrame data={liveData} />
      </div>

      <div
        className={`rounded-b-2xl z-10 mx-auto 
             flex flex-col justify-center items-center gap-1 w-[95%]`}
      >
        <p className="font-bold capitalize md:text-xl text-lg">
          idol hôm nay thế nào?
        </p>
        <div className="flex items-center md:gap-4 gap-2">
          {Array.from({ length: 6 }).map((_, index) =>
            index === 0 ? null : index <= star ? (
              <div key={index} onClick={() => setStar(index)}>
                <FilledStar key={index} />
              </div>
            ) : (
              <div key={index} onClick={() => setStar(index)}>
                <EmptyStar key={index} />
              </div>
            )
          )}
        </div>
        <p className="font-bold md:text-lg text-base">{reviewContent[star]}</p>

        <Form form={form} id="idol-rating-form" onFinish={handleFinish}>
          <Form.Item name="comment" rules={[{ required: true }]}>
            <Input.TextArea
              placeholder="Nhận xét của bạn"
              rows={{ xs: 2, md: 4 }}
              cols={60}
              className="w-full"
            />
          </Form.Item>

          <Form.Item className="w-full">
            <Button
              disabled={isLoading}
              htmlType="submit"
              className="w-full uppercase !text-white font-semibold bg-[var(--color-brand-primary)] focus:!bg-[var(--color-brand-primary)] border-none md:text-lg text-base md:py-6 py-4"
            >
              Đánh giá
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default function IdolRating() {
  const triggerRef = useRef(null);

  return (
    <CompoundModal>
      <CompoundModal.Trigger
        render={(openModal) => (
          <button
            ref={triggerRef}
            onClick={openModal}
            className="hidden invisible opacity-0"
          >
            Idol Rating
          </button>
        )}
      />
      <CompoundModal.Content
        classNames={{
          content: `!rounded-3xl !p-0 
           md:min-w-[551px] md:min-h-[527px] min-w-[80%] min-h-[409px] mx-auto 
           shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
           bg-custom-gradient
           `,
        }}
      >
        <IdolRatingContent />
      </CompoundModal.Content>
    </CompoundModal>
  );
}
