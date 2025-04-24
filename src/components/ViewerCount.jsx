import { useParams } from "react-router";
import useLiveDetail from "../hooks/useLiveDetail";
import { useSignalR } from "../contexts/SIgnalRContext";
import { FaEye } from "react-icons/fa";

export default function ViewerCount() {
  const { id } = useParams();
  const { viewer } = useSignalR();
  const { data: liveData } = useLiveDetail(id);
  const liveDetailData = liveData?.data?.data || {};
  const { isStreaming, viewer: liveViewer } = liveDetailData || {};

  return (
    <span className="flex items-center gap-1">
      <FaEye />
      {isStreaming && viewer !== 0
        ? viewer
        : isStreaming && liveViewer
        ? liveViewer
        : 0}
    </span>
  );
}
