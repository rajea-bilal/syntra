// Dashboard Page
//
// What this file does:
// - Shows the main dashboard for your app
// - Gets data about YouTube views, website visitors, calls, and money collected
// - Shows metric cards, charts, and a table with this data
//
// Main sections:
// 1. Metric cards at the top (quick stats)
// 2. Bar charts for each metric (visual trends)
// 3. Table with all monthly metrics
//
// This page is the main place to see how things are going at a glance.

"use client";
import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/Card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { apiMock } from "../mockData/apiMock";
import type { MonthlyMetrics } from "../types/metrics";
import { SingleMetricBarChart } from "../components/metrics/SingleMetricBarChart";
import { MetricCard } from "../components/metrics/MetricCard";
import { MonthlyMetricsTable } from "../components/metrics/MonthlyMetricsTable";
import { useQuery } from '@tanstack/react-query';
import { ShimmerButton } from "@/components/ui/ShimmerButton";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Syntra Dashboard</h1>
      <p className="mb-8 text-lg text-gray-600">
        Visualize and optimize your high-ticket coaching funnel with AI-powered insights.
      </p>
      <a
        href="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </a>
      </main>
  );
}
