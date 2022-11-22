import React, {createRef, useEffect, useState} from "react";
import './SplitView.css';

const MIN_SIZE = 30;
const MIDDLE_SIZE = 60;

interface SplitViewProps {
  top: React.ReactElement;
  middle: React.ReactElement;
  bottom: React.ReactElement;
  rowLayout: boolean;
}

const BottomPane: React.FunctionComponent<{
  bottomDimension: number | undefined;
  setBottomDimension: (value: number) => void;
  rowLayout: boolean
  children: any;
}> = ({bottomDimension, setBottomDimension, rowLayout, children}) => {
  const bottomRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (bottomRef.current) {
      if (!bottomDimension) {
        if (rowLayout) {
          setBottomDimension(bottomRef.current.clientHeight);
        } else {
          setBottomDimension(bottomRef.current.clientWidth);
        }
        return;
      }
      if (rowLayout) {
        bottomRef.current.style.height = '';
        bottomRef.current.style.width = `${bottomDimension}px`;
      } else {
        bottomRef.current.style.height = `${bottomDimension}px`;
        bottomRef.current.style.width = '';
      }
    }
  }, [bottomRef, bottomDimension, setBottomDimension]);

  return <div ref={bottomRef}>{children}</div>;
};

export const SplitView: React.FunctionComponent<SplitViewProps> = ({
  top,
  middle,
  bottom,
  rowLayout,
}) => {
  const [bottomDimension, setBottomDimension] = 
    useState<number>(200);
  const [grabPosition, setGrabPosition] = 
    useState<undefined | number>(undefined);
  const [resizing, setResizing] = useState(false);

  const splitPaneRef = createRef<HTMLDivElement>();

  const onMouseDown = (e: React.MouseEvent) => {
    setGrabPosition(rowLayout ? e.clientX : e.clientY);
    setResizing(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setGrabPosition(rowLayout ? e.touches[0].clientX : e.touches[0].clientY);
    setResizing(true);
  };

  const onMove = (clientPos: number) => {
    if (resizing && bottomDimension && grabPosition) {
      const newBottomDimension = bottomDimension + grabPosition - clientPos;
      setGrabPosition(clientPos);

      if (newBottomDimension < MIN_SIZE) {
        setBottomDimension(MIN_SIZE);
        return;
      }

      const splitPaneDim = rowLayout ? 
        splitPaneRef.current ? splitPaneRef.current.clientWidth : window.outerWidth: 
        splitPaneRef.current ? splitPaneRef.current.clientHeight : window.outerHeight;
      if (newBottomDimension > splitPaneDim - MIN_SIZE - MIDDLE_SIZE - 16) {
        setBottomDimension(splitPaneDim - MIN_SIZE - MIDDLE_SIZE - 16);
        return;
      }

      setBottomDimension(newBottomDimension);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    onMove(rowLayout ? e.clientX : e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    onMove(rowLayout ? e.touches[0].clientX : e.touches[0].clientY);
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
    <div className={`SplitView ${rowLayout ? "row-layout" : "col-layout"}`}>
      <div className="top-container">{top}</div>
      <div className="GrabBar"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onMouseUp}>
      </div>
      <div className="middle-container" style={rowLayout ? {width: MIDDLE_SIZE} : {height: MIDDLE_SIZE}}>{middle}</div>
      <div className="GrabBar"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onMouseUp}>
      </div>
      <BottomPane bottomDimension={bottomDimension} setBottomDimension={setBottomDimension} rowLayout={rowLayout}>
        {bottom}
      </BottomPane>
    </div>
  );
}
