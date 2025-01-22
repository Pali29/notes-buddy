"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserTable } from "./components/UserTable";

// Define interfaces for the stats and user data
interface Stats {
  totalUsers: number;
  premiumUsers: number;
  blockedUsers: number;
  totalRevenue: number;
  totalNotesRequests: number;
  completedNotesRequests: number;
  totalNotesReports: number;
  completedNotesReports: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  planTier?: string;
  university?: string;
  degree?: string;
  year?: string;
  semesters?: string[];
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  phoneNumber?: string;
  image?: string;
  Blocked?: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch stats and users data on page load
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/admin/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoadingStats(false);
      }
    }

    async function fetchUsers() {
      try {
        const response = await fetch("/admin/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchStats();
    fetchUsers();
  }, []);

  // Toggle block status of users
  const handleToggleBlock = async (userId: string, action: "block" | "unblock") => {
    try {
      const response = await fetch("/admin/api/blocked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      const result = await response.json();

      if (result.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, Blocked: action === "block" } : user
          )
        );
      } else {
        console.error("Failed to update user block status:", result.error);
      }
    } catch (error) {
      console.error("Error updating user block status:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Separator className="mb-6" />

      {loadingStats ? (
        <p>Loading stats...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Display the cards for various stats */}
          <Card>
            <CardHeader>
              <CardTitle className="font-gilroy">Total Users</CardTitle>
            </CardHeader>
            <CardContent>{stats.totalUsers}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-gilroy">Premium Users</CardTitle>
            </CardHeader>
            <CardContent>{stats.premiumUsers}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-gilroy">Blocked Users</CardTitle>
            </CardHeader>
            <CardContent>{stats.blockedUsers}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-gilroy">Total Revenue (₹)</CardTitle>
            </CardHeader>
            <CardContent>{stats.totalRevenue}</CardContent>
          </Card>

          {/* Display additional cards for notes requests and reports */}
          <Card>
            <CardHeader>
              <CardTitle className="font-gilroy">Total Notes Requests</CardTitle>
            </CardHeader>
            <CardContent>{stats.totalNotesRequests}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-gilroy">Completed Notes Requests</CardTitle>
            </CardHeader>
            <CardContent>{stats.completedNotesRequests}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-gilroy">Total Notes Reports</CardTitle>
            </CardHeader>
            <CardContent>{stats.totalNotesReports}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-gilroy">Completed Notes Reports</CardTitle>
            </CardHeader>
            <CardContent>{stats.completedNotesReports}</CardContent>
          </Card>
        </div>
      ) : (
        <p>Failed to load stats. Please try again later.</p>
      )}

      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <Separator className="mb-6" />

      {loadingUsers ? (
        <p>Loading users...</p>
      ) : (
        <UserTable users={users} onToggleBlock={handleToggleBlock} />
      )}
    </div>
  );
}
