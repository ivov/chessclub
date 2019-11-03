import React from "react";

const Tab = props => {
  const { tabName, activeTab, onTabClick, tabIcon } = props;
  const isActive = tabName === activeTab;
  return (
    <div
      onClick={onTabClick}
      className={isActive ? "selected" : ""}
      id={tabName}
    >
      <span className={"mdi " + tabIcon} />
      {tabName}
    </div>
  );
};

export default Tab;
