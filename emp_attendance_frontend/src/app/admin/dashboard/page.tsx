
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function AdminDashboard() {
    const router = useRouter();

    const [dashboard, setDashboard] = useState({
        total_employees: 0,
        present_today: 0,
        absent_today: 0,
        pending_leaves: 0,
    });

    const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
    const [message, setMessage] = useState("");

    async function fetchDashboard() {
        const token = localStorage.getItem("access_token");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setDashboard(data);
            } else if (response.status === 401 || response.status === 403) {
                router.push("/employee/dashboard");
            } else {
                setMessage(data.detail || "Failed to load dashboard");
            }
        } catch {
            setMessage("Unable to connect to backend");
        }
    }

    async function fetchTodayAttendance() {
        const token = localStorage.getItem("access_token");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/admin/attendance/today",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setAttendanceRecords(data);
            } else if (response.status === 401 || response.status === 403) {
                router.push("/employee/dashboard");
            } else {
                setMessage(data.detail || "Failed to load attendance");
            }
        } catch {
            setMessage("Unable to connect to backend");
        }
    }

    useEffect(() => {
        fetchDashboard();
        fetchTodayAttendance();
    }, []);

    return (
        <div>
            <Link href="/admin/employees">Admin Employees</Link>{" "}
            <Link href="/admin/leave">Leave Approval Management</Link>

            <h1>Admin Dashboard</h1>
            <p>Overview of employee attendance and leave management</p>

            <p>{message}</p>

            <div>
                <h2>Total Employees</h2>
                <p>{dashboard.total_employees}</p>
                <p>Number of employees registered</p>
            </div>

            <div>
                <h2>Present Today</h2>
                <p>{dashboard.present_today}</p>
                <p>Employees who checked in</p>
            </div>

            <div>
                <h2>Absent Employees</h2>
                <p>{dashboard.absent_today}</p>
                <p>Employees who are absent</p>
            </div>

            <div>
                <h2>Pending Leaves</h2>
                <p>{dashboard.pending_leaves}</p>
                <p>Leave requests awaiting approval</p>
            </div>

            <div>
                <h2>Today's Attendance Overview</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Check-in Time</th>
                            <th>Check-out Time</th>
                            <th>Working Hours</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {attendanceRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.employee_name}</td>
                                <td>{record.check_in_time || "--:--"}</td>
                                <td>{record.check_out_time || "--:--"}</td>
                                <td>
                                    {record.working_hours !== null
                                        ? `${record.working_hours} hrs`
                                        : "--"}
                                </td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {attendanceRecords.length === 0 && (
                    <p>No attendance records for today.</p>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
