
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";


function DashboardPage() {
    const router = useRouter();

    const [attendanceStatus, setAttendanceStatus] = useState("Not Checked In");
    const [message, setMessage] = useState("");
    const [workingHours, setWorkingHours] = useState(0);
    const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);

    // Logout function
    function handleLogout() {
        localStorage.removeItem("access_token");
        router.push("/login");
    }

    useEffect(() => {
        async function fetchHistory() {
            const token = localStorage.getItem("access_token");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/attendance/history",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (response.status === 401) {
                    handleLogout();
                    return;
                }

                if (response.ok) {
                    setAttendanceHistory(data);

                    if (data.length > 0) {
                        setAttendanceStatus(data[0].status);
                        setWorkingHours(data[0].working_hours ?? 0);
                    }
                }
            } catch {
                setMessage("Unable to load attendance history");
            }
        }

        fetchHistory();
    }, []);

    async function handleCheckIn() {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                handleLogout();
                return;
            }

            const response = await fetch(
                "http://127.0.0.1:8000/attendance/check-in",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setAttendanceStatus(data.status);
                setMessage(data.message);

                const historyResponse = await fetch(
                    "http://127.0.0.1:8000/attendance/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const historyData = await historyResponse.json();

                if (historyResponse.ok) {
                    setAttendanceHistory(historyData);
                }
            } else {
                setMessage(data.detail);
            }
        } catch {
            setMessage("Something went wrong");
        }
    }

    async function handleCheckOut() {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                handleLogout();
                return;
            }

            const response = await fetch(
                "http://127.0.0.1:8000/attendance/check-out",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setWorkingHours(data.working_hours);
                setMessage(data.message);

                const historyResponse = await fetch(
                    "http://127.0.0.1:8000/attendance/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const historyData = await historyResponse.json();

                if (historyResponse.ok) {
                    setAttendanceHistory(historyData);
                }
            } else {
                setMessage(data.detail);
            }
        } catch {
            setMessage("Something went wrong");
        }
    }

    return (
        <div>
            <Link href="/employee/attendance">Attendance</Link>
            <Link href="/employee/leave">Leave Management</Link>

            <div>
                <h1>Employee Dashboard</h1>
                <p>WELCOME TO DASHBOARD</p>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div>
                <h2>Attendance Status</h2>
                <p>{attendanceStatus}</p>
            </div>

            <div>
                <h2>Check-in Time</h2>
                <p>
                    {attendanceHistory.length > 0
                        ? attendanceHistory[0].check_in_time
                        : "--:--"}
                </p>
            </div>

            <div>
                <h2>Working Hours</h2>
                <p>{workingHours} hrs</p>
            </div>

            <div>
                <h3>Attendance Actions</h3>

                <button onClick={handleCheckIn}>
                    Check-in
                </button>

                <button onClick={handleCheckOut}>
                    Check-out
                </button>

                <p>{message}</p>
            </div>

            <div>
                <h3>Attendance History</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Working Hours</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {attendanceHistory.map((record, index) => (
                            <tr key={index}>
                                <td>{record.attendance_date}</td>
                                <td>{record.check_in_time || "--:--"}</td>
                                <td>{record.check_out_time || "--:--"}</td>
                                <td>{record.working_hours ?? "--"} hrs</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DashboardPage;
