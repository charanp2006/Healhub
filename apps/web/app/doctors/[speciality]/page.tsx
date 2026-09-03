// @ts-nocheck
"use client";

import { Suspense } from "react";
import Doctors from "@/src/components/Doctors";

export default function SpecialityPage() {
  return (
    <Suspense fallback={null}>
      <Doctors />
    </Suspense>
  );
}
