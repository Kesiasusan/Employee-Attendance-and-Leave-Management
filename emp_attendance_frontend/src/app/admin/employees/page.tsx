"use client";

import { useState, useEffect } from "react";

function AdminEmployees() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    async function fetchEmployees(searchValue = "") {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setMessage("Please login as admin");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/admin/employees?search=${encodeURIComponent(searchValue)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setEmployees(data);
                setMessage("");
            } else {
                setMessage(data.detail || "Failed to load employees");
            }
        } catch {
            setMessage("Unable to connect to backend");
        }
    }

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchEmployees(search);
    }, [search]);

    return (
        <div>
            <h1>Employee Management</h1>
            <p>View and manage all employees</p>

            <input
                placeholder="Search employees by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <p>{message}</p>

            <h2>Employee List</h2>

            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>

                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminEmployees;