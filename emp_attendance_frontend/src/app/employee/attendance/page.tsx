function AttendancePage() {
    return (
        <div>
            <h1>Employee Attendance</h1>
            <p>View and manage your daily attendance</p>
            <div>
                <h2>Today's Attendance</h2>
                <button>Check-in</button>
                <button>check-out</button>
                <div>
                    <h3>Attendance</h3>
                    <p>Present</p>
                    <h3>Check-in Time</h3>
                    <p>09:00 AM</p>
                    <h3>Check-out Time</h3>
                    <p>05:00 PM</p>
                    <h3>Working Hours</h3>
                    <p>8 hrs</p>
                </div>
                <div>
                    <h2>Attendance History</h2>
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
                            <tr>
                                <td>05-11-2026</td>
                                <td>09:00 AM</td>
                                <td>05:00 PM</td>
                                <td>8 hrs</td>
                                <td>Present</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default AttendancePage
