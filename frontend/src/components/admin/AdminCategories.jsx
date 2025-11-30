import React, { useState } from 'react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Văn học', count: 520, description: 'Tiểu thuyết, truyện ngắn' },
        { id: 2, name: 'Kỹ năng sống', count: 140, description: 'Sách hướng dẫn phát triển bản thân' },
        { id: 3, name: 'Thiếu nhi', count: 300, description: 'Truyện tranh, sách giáo dục cho bé' },
        { id: 4, name: 'Giáo trình', count: 150, description: 'Sách giáo khoa, ôn thi đại học' },
    ]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ id: null, name: '', description: '' });
    const [isEditingCategory, setIsEditingCategory] = useState(false);

    const handleAddCategory = () => {
        setCategoryForm({ id: null, name: '', description: '' });
        setIsEditingCategory(false);
        setShowCategoryModal(true);
    };

    const handleEditCategory = (cat) => {
        setCategoryForm(cat);
        setIsEditingCategory(true);
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thể loại này không?")) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const handleSaveCategory = (e) => {
        e.preventDefault();
        if (isEditingCategory) {
            const updatedCats = categories.map(c => c.id === categoryForm.id ? { ...categoryForm, count: c.count } : c);
            setCategories(updatedCats);
        } else {
            const newCat = { ...categoryForm, id: Date.now(), count: 0 };
            setCategories([...categories, newCat]);
        }
        setShowCategoryModal(false);
    };

    return (
        <div>
            <div className="d-flex justify-content-end mb-4">
                <button className="btn btn-custom fw-bold" onClick={handleAddCategory}>
                    <i className="bi bi-plus-circle me-2"></i> Thêm thể loại
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="py-3 ps-4" style={{ width: '80px' }}>ID</th>
                                <th className="py-3" style={{ width: '200px' }}>Tên thể loại</th>
                                <th className="py-3" style={{ width: '120px' }}>Số sách</th>
                                <th className="py-3">Mô tả</th>
                                <th className="py-3 text-end pe-4" style={{ width: '150px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td className="ps-4 text-muted">{cat.id}</td>
                                    <td className="fw-bold text-dark">{cat.name}</td>
                                    <td><span className="badge bg-light text-dark border">{cat.count}</span></td>
                                    <td className="text-muted small">{cat.description}</td>
                                    <td className="text-end pe-4">
                                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditCategory(cat)}>
                                            Sửa
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategory(cat.id)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL THÊM/SỬA THỂ LOẠI */}
            {showCategoryModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-brown">
                                    {isEditingCategory ? 'Sửa thể loại' : 'Thêm thể loại mới'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form onSubmit={handleSaveCategory}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Tên thể loại</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={categoryForm.name}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold">Mô tả ngắn</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={categoryForm.description}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="text-end">
                                        <button type="button" className="btn btn-light me-2" onClick={() => setShowCategoryModal(false)}>Hủy</button>
                                        <button type="submit" className="btn btn-custom fw-bold">
                                            {isEditingCategory ? 'Cập nhật' : 'Thêm mới'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;