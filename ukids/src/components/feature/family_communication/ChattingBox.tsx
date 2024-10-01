interface ChattingProps {
  message: string;
  isSender: boolean;
  sender: string;
  timestamp: string;
}

const ChattingBox = ({
  message,
  isSender,
  sender,
  timestamp,
}: ChattingProps) => {
  if (!message.trim()) return null;

  const color = isSender ? 'bg-[#fceecf]' : 'bg-[#cbeef4]';

  const rawHour = Number.parseInt(timestamp.substring(0, 2));
  const hour = (rawHour + 9) % 24;
  const minute = timestamp.substring(3, 5);
  const timestampKOR = `${hour < 10 ? '0' + hour : hour}:${minute}`;

  return (
    <>
      <div className="mb-4 mx-1">
        {/* 보낸 사람이면 이름 표시 X */}
        {isSender ? null : <p>{sender}</p>}

        {/* 메세지 영역 */}
        <div className="flex flex-row items-end">
          {/* 보낸 사람이 나면 타임스탬프 왼쪽에 표시 */}
          {isSender && (
            <div className={`text-[#999] text-[10px] mr-1`}>{timestampKOR}</div>
          )}

          {/* 메세지 영역 */}
          <div
            className={`flex justify-center items-center px-3 py-1.5 rounded-[5px] ${color}`}
            style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
          >
            {message}
          </div>

          {/* 보낸 사람이 내가 아니면 타임스탬프 오른쪽에 표시 */}
          {!isSender && (
            <div className={`text-[#999] text-[10px] ml-1`}>{timestampKOR}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChattingBox;
