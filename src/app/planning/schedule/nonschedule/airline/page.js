// src/app/planning/schedule/[id]/airline/page.js

import AirlineClient from "./AirlineClient";

export default async function Page({ params }) {
  let scheduleId = "";
  if (!params) {
    scheduleId = "nonschedule";
  } else {
    const { id } = await params; // 🔹 Next.js 15 방식
    scheduleId = id;
  }

  return <AirlineClient scheduleId={scheduleId} />;
}
