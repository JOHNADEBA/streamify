"use client";

import { MouseEvent as ReactMouseEvent } from "react";

import { CLOSE_SIDEBAR } from "@/app/actions";
import { useAppContext } from "@/app/context";

import Movie from "@/app/components/Movie";
import { useParams } from "next/navigation";

const detailsPage = () => {
  const { dispatch } = useAppContext();
  let { id } = useParams();
  if (Array.isArray(id)) {
    id = id[0];
  }
  if (!id) {
    id = "";
  }

  const closeSidebar = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch({ type: CLOSE_SIDEBAR });
  };

  return (
    <div
      onClick={(e) => closeSidebar(e)}
      className="stream-container flex justify-center items-center h-[calc(100vh-4rem)] bg-gray-800"
    >
      <Movie id={id} />
    </div>
  );
};

export default detailsPage;
