"use client";

import { useState, useEffect } from "react";

function AdminLeave() {
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
    const [adminComment, setAdminComment] = useState("");
    const [message, setMessage] = useState("");

    async function fetchLeaveRequests() {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setMessage("Please login as admin");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/admin/leaves", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setLeaveRequests(data);
            } else {
                setMessage(data.detail || "Failed to load leave requests");
            }
        } catch {
            setMessage("Unable to connect to backend");
        }
    }

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    async function handleLeaveAction(leaveId: number, status: string) {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setMessage("Please login as admin");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/admin/leave/${leaveId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: status,
                        admin_comment: adminComment,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || "Leave request updated successfully");
                setAdminComment("");
                await fetchLeaveRequests();
            } else {
                setMessage(data.detail || "Failed to update leave request");
            }
        } catch {
            setMessage("Unable to connect to backend");
        }
    }

    return (
        <div>
            <div>
                <h1>Leave Approval Management</h1>
                <p>Review and manage employee leave requests</p>
            </div>

            <div>
                <label>Admin Comment</label>
                <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Enter admin comment"
                />

                <p>{message}</p>
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Leave Type</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {leaveRequests.map((record) => (
                            <tr key={record.leave_id}>
                                <td>{record.employee_name}</td>
                                <td>{record.leave_type}</td>
                                <td>{record.start_date}</td>
                                <td>{record.end_date}</td>
                                <td>{record.reason}</td>
                                <td>{record.status}</td>
                                <td>
                                    {record.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleLeaveAction(
                                                        record.leave_id,
                                                        "Approved"
                                                    )
                                                }
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleLeaveAction(
                                                        record.leave_id,
                                                        "Rejected"
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminLeave;