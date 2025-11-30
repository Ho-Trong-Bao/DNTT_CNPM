import React, { useState } from 'react';

const AdminUsers = ({ allUsers, setAllUsers }) => {
    const [userSearch, setUserSearch] = useState('');
    const [userFilter, setUserFilter] = useState('all');

    // Khóa / Mở khóa tài khoản
    const toggleUserStatus = (id) => {
        const updatedUsers = allUsers.map(user => {
            if (user.id === id) {
                const newStatus = user.status === 'active' ? 'locked' : 'active';
                return { ...user, status: newStatus };
            }
            return user;
        });
        setAllUsers(updatedUsers);
    };

    // Xóa người dùng
    const handleDeleteUser = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
            setAllUsers(allUsers.filter(user => user.id !== id));
        }
    };

    // Xem chi tiết người dùng
    const handleViewUser = (user) => {
        alert(`Thông tin người dùng:\n- Tên: ${user.name}\n- Email: ${user.email}\n- SĐT: ${user.phone}\n- Ngày tham gia: ${user.date}`);
    };

    // Lọc danh sách người dùng
    const filteredUsers = allUsers.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase());
        const matchStatus = userFilter === 'all' || user.status === userFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div>
            <div className="bg-white p-3 rounded shadow-sm mb-4 d-flex justify-content-between align-items-center">
                <select className="form-select form-select-sm" style={{ width: '150px' }} value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
                    <option value="all">Tất cả</option>
                    <option value="active">Hoạt động</option>
                    <option value="locked">Tạm khóa</option>
                </select>
                <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input type="text" className="form-control" placeholder="Tìm kiếm..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                    <button className="btn btn-outline-secondary"><i className="bi bi-search"></i></button>
                </div>
            </div>
            <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="py-3 ps-4">ID</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Trạng thái</th>
                                <th className="text-end pe-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="ps-4 text-muted">{user.id}</td>
                                    <td className="fw-bold">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        {user.status === 'active' ? <span className="badge bg-success">Hoạt động</span> : <span className="badge bg-secondary">Tạm khóa</span>}
                                    </td>
                                    <td className="text-end pe-4">
                                        <button className="btn btn-sm btn-outline-secondary me-1" title="Xem" onClick={() => handleViewUser(user)}>
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm me-1 ${user.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                            title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                                            onClick={() => toggleUserStatus(user.id)}
                                        >
                                            <i className={`bi ${user.status === 'active' ? 'bi-lock' : 'bi-unlock'}`}></i>
                                        </button>

                                        <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDeleteUser(user.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;