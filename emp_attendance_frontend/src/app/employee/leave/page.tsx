"use client";

import { useState, useEffect } from "react";

function LeaveManagement() {
    const [leaveType, setLeaveType] = useState("Casual Leave");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
    const [message, setMessage] = useState("");

    async function fetchLeaveHistory() {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setMessage("Please login first");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/leave/history", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setLeaveRequests(data);
            } else {
                setMessage(data.detail || "Failed to load leave history");
            }
        } catch {
            setMessage("Unable to connect to backend");
        }
    }

    useEffect(() => {
        fetchLeaveHistory();
    }, []);

    async function handleSubmit() {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setMessage("Please login first");
            return;
        }

        if (!startDate || !endDate || !reason.trim()) {
            setMessage("Please fill all fields");
            return;
        }

        if (endDate < startDate) {
            setMessage("End date cannot be before start date");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/leave/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    leave_type: leaveType,
                    start_date: startDate,
                    end_date: endDate,
                    reason: reason,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || "Leave request submitted successfully");
                setStartDate("");
                setEndDate("");
                setReason("");
                await fetchLeaveHistory();
            } else {
                setMessage(data.detail || "Failed to submit leave request");
            }
        } catch {
            setMessage("Unable to connect to backend");
        }
    }

    return (
        <div>
            <h1>Leave Management</h1>
            <p>Apply for leave and track your requests</p>

            <div>
                <h2>Apply for Leave</h2>

                <label>Leave Type</label>
                <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                >
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Annual Leave</option>
                </select>

                <label>Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label>End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <label>Reason</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />

                <button onClick={handleSubmit}>
                    Submit Leave Request
                </button>

                <p>{message}</p>
            </div>

            <div>
                <h2>My Leave Requests</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Reason</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {leaveRequests.map((record) => (
                            <tr key={record.leave_id}>
                                <td>{record.leave_type}</td>
                                <td>{record.start_date}</td>
                                <td>{record.end_date}</td>
                                <td>{record.reason}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default LeaveManagement;