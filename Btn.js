"use client";
export default function Btn({
  text,
  type = "btn_broad",
  onClick,
  btn_disabled = false,
}) {
  return (
    <button
      onClick={btn_disabled ? undefined : onClick}
      disabled={btn_disabled}
      className={`${type} ${btn_disabled ? "btn_disabled" : ""}`}
    >
      {text}
    </button>
  );
}
