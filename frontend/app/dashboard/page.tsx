"use client";

import React, { MouseEvent as ReactMouseEvent } from "react";

import { useAppContext } from "../context";
import { CLOSE_SIDEBAR } from "../actions";
import Dashboard from "../components/Dashboard";

const DashboardPage: React.FC = () => {
  const { dispatch } = useAppContext();

  const closeSidebar = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch({ type: CLOSE_SIDEBAR });
  };
  return (
    <div onClick={(e) => closeSidebar(e)}>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
