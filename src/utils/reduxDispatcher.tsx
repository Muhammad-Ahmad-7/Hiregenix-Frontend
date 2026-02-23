import { useDispatch } from "react-redux";
import React from "react";

function useReduxDispatch() {
  const dispatch = () => useDispatch();
  return dispatch;
}

export default useReduxDispatch;
