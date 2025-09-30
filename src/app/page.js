"use client";
import Btn from "../../Btn";

export default function Home() {
  return (
    <>
      <p className="text-amber-300">안녕</p>
      <Btn
        text="기본입니다!"
        type="btn_sub" // btn_broad  btn_onboarding  btn_sub
        onClick={() => alert("여행 시작!")}
        btn_disabled={false} // false  true
      ></Btn>
    </>
  );
}
