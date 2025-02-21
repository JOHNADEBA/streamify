"use client";

import { MouseEvent as ReactMouseEvent } from "react";

import { useAppContext } from "../context";
import { CLOSE_SIDEBAR } from "../actions";
import Breadcrumb from "../components/Breadcrumb";

export default function Settings() {
  const { dispatch } = useAppContext();

  const closeSidebar = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch({ type: CLOSE_SIDEBAR });
  };

  return (
    <div
      onClick={(e) => closeSidebar(e)}
      className="h-[calc(100vh-4rem)] bg-gray-800 p-6"
    >
      <Breadcrumb />
      <div className="stream-container flex justify-center items-center  "></div>
    </div>
  );
}
