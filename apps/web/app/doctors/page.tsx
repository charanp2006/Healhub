// @ts-nocheck
"use client";

import { Suspense } from "react";
import Doctors from "@/src/components/Doctors";

export default function DoctorsPage() {
  return (
    <Suspense fallback={null}>
      <Doctors />
    </Suspense>
  );
}
