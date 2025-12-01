/**
 * File: frontend/src/components/admin/AdminApproval.jsx
 * Admin Post Approval Component
 */
import { useState, useEffect } from 'react';
import { Card, Button, Badge, Table } from 'react-bootstrap';
import { postAPI } from '../../services/api';
import { toast } from 'react-toastify';

function AdminApproval() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingPosts();
  }, []);

  const loadPendingPosts = async () => {
    setLoading(true);
    try {
      const response = await postAPI.getPending();
      setPendingPosts(response.data);
    } catch (error) {
      console.error('Error loading pending posts:', error);
      toast.error('Không thể tải danh sách bài đăng');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postID) => {
    if (!window.confirm('Xác nhận duyệt bài đăng này?')) return;

    try {
      await postAPI.approve(postID);
      toast.success('Đã duyệt bài đăng!');
      loadPendingPosts();
    } catch (error) {
      console.error('Error approving post:', error);
      toast.error('Không thể duyệt bài đăng');
    }
  };

  const handleDecline = async (postID) => {
    if (!window.confirm('Xác nhận từ chối bài đăng này?')) return;

    try {
      await postAPI.decline(postID);
      toast.success('Đã từ chối bài đăng!');
      loadPendingPosts();
    } catch (error) {
      console.error('Error declining post:', error);
      toast.error('Không thể từ chối bài đăng');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">✅ Duyệt bài đăng</h2>

      {pendingPosts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <h4 className="mt-3 text-muted">Không có bài đăng nào cần duyệt</h4>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sách</th>
                  <th>Người đăng</th>
                  <th>Giá</th>
                  <th>Khu vực</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingPosts.map((post) => (
                  <tr key={post.postID}>
                    <td>{post.postID}</td>
                    <td>
                      <strong>{post.book?.title}</strong>
                      <br />
                      <small className="text-muted">
                        {post.book?.author}
                      </small>
                    </td>
                    <td>{post.user?.name}</td>
                    <td className="text-danger fw-bold">
                      {formatPrice(post.book?.price)}
                    </td>
                    <td>{post.book?.province}</td>
                    <td>
                      <Badge bg="warning">Chờ duyệt</Badge>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleApprove(post.postID)}
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Duyệt
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDecline(post.postID)}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Từ chối
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default AdminApproval;