import React, {createRef, useEffect, useState} from "react";
import './SplitView.css';

const MIN_HEIGHT = 30;
const MIDDLE_HEIGHT = 60;

interface SplitViewProps {
  top: React.ReactElement;
  middle: React.ReactElement;
  bottom: React.ReactElement;
}

const BottomPane: React.FunctionComponent<{
  bottomHeight: number | undefined;
  setBottomHeight: (value: number) => void;
  children: any;
}> = ({bottomHeight, setBottomHeight, children}) => {
  const bottomRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (bottomRef.current) {
      if (!bottomHeight) {
        setBottomHeight(bottomRef.current.clientWidth);
        return;
      }

      bottomRef.current.style.height = `${bottomHeight}px`;
    }
  }, [bottomRef, bottomHeight, setBottomHeight]);

  return <div ref={bottomRef}>{children}</div>;
};

export const SplitView: React.FunctionComponent<SplitViewProps> = ({
  top,
  middle,
  bottom,
}) => {
  const [bottomHeight, setBottomHeight] = 
    useState<number>(200);
  const [grabYPosition, setGrabYPosition] = 
    useState<undefined | number>(undefined);
  const [resizing, setResizing] = useState(false);

  const splitPaneRef = createRef<HTMLDivElement>();

  const onMouseDown = (e: React.MouseEvent) => {
    setGrabYPosition(e.clientY);
    setResizing(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setGrabYPosition(e.touches[0].clientY);
    setResizing(true);
  };

  const onMove = (clientY: number) => {
    if (resizing && bottomHeight && grabYPosition) {
      const newBottomHeight = bottomHeight + grabYPosition - clientY;
      setGrabYPosition(clientY);

      if (newBottomHeight < MIN_HEIGHT) {
        setBottomHeight(MIN_HEIGHT);
        return;
      }

      const splitPaneHeight = splitPaneRef.current ? splitPaneRef.current.clientHeight : window.outerHeight;
      if (newBottomHeight > splitPaneHeight - MIN_HEIGHT - MIDDLE_HEIGHT - 16) {
        setBottomHeight(splitPaneHeight - MIN_HEIGHT - MIDDLE_HEIGHT - 16);
        return;
      }

      setBottomHeight(newBottomHeight);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    onMove(e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    onMove(e.touches[0].clientY);
  };

  const onMouseUp = () => {
    setResizing(false);
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <div className="SplitView">
      <div className="top-container">{top}</div>
      <div className="GrabBar"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onMouseUp}>
      </div>
      <div className="middle-container" style={{height: MIDDLE_HEIGHT}}>{middle}</div>
      <div className="GrabBar"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onMouseUp}>
      </div>
      <BottomPane bottomHeight={bottomHeight} setBottomHeight={setBottomHeight}>
        {bottom}
      </BottomPane>
    </div>
  );
}
