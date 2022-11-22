import React from "react";
import './SplitView.css';

interface SplitViewProps {
  top: React.ReactElement;
  middle: React.ReactElement;
  bottom: React.ReactElement;
}

export const SplitView: React.FunctionComponent<SplitViewProps> = ({
  top,
  middle,
  bottom,
}) => {
  return (
    <div className="SplitView">
      <div className="top-container">{top}</div>
      <GrabBar />
      <div className="middle-container">{middle}</div>
      <GrabBar />
      <div className="bottom-container">{bottom}</div>
    </div>
  );
}

function GrabBar() {
  return (
    <div className="GrabBar"></div>
  )
}
