"use client"

import dynamic from "next/dynamic"

import { BulkExportCsvActionSkeleton } from "./bulk-export-csv-action-skeleton"

export const BulkExportCsvAction = dynamic(
  () => import("./bulk-export-csv-action").then((mod) => mod.BulkExportCsvAction),
  {
    ssr: false,
    loading: () => <BulkExportCsvActionSkeleton />,
  },
)
