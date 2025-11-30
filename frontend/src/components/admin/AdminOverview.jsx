import React from 'react';

const AdminOverview = ({ totalUsers, totalPosts, pendingCount }) => {
  return (
    <>
      {/* 4 THẺ THỐNG KÊ */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <div className="text-muted small mb-1">Người dùng</div>
            <div className="fs-2 fw-bold text-dark">{totalUsers}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <div className="text-muted small mb-1">Bài đăng</div>
            <div className="fs-2 fw-bold text-dark">{totalPosts}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100 border-start border-4 border-warning">
            <div className="text-muted small mb-1">Chờ duyệt</div>
            <div className="fs-2 fw-bold text-warning">{pendingCount}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100 border-start border-4 border-danger">
            <div className="text-muted small mb-1">Báo cáo</div>
            <div className="fs-2 fw-bold text-danger">3</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* BIỂU ĐỒ */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="mb-4 text-brown">Hoạt động tuần (bài đăng mới)</h5>
            <div className="w-100 position-relative" style={{ height: '300px' }}>
              {/* Các đường kẻ ngang mờ */}
              <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} style={{ borderTop: '1px dashed #eee', height: '60px', width: '100%' }}>
                    <span className="text-muted small" style={{ position: 'absolute', left: '-25px', marginTop: '-10px' }}>{25 - i * 5}</span>
                  </div>
                ))}
                <span className="text-muted small" style={{ position: 'absolute', left: '-20px', bottom: '0' }}>0</span>
              </div>

              <svg viewBox="0 0 800 300" className="w-100 h-100 position-relative" style={{ zIndex: 1 }}>
                <path
                  d="M0,300 L0,180 Q100,100 200,200 T400,150 T600,50 T800,150 L800,300 Z"
                  fill="rgba(230, 126, 34, 0.1)"
                />
                <path
                  d="M0,180 Q100,100 200,200 T400,150 T600,50 T800,150"
                  fill="none"
                  stroke="#e67e22"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {[
                  { cx: 0, cy: 180 }, { cx: 133, cy: 120 }, { cx: 266, cy: 220 },
                  { cx: 400, cy: 150 }, { cx: 533, cy: 80 }, { cx: 666, cy: 200 }, { cx: 800, cy: 150 }
                ].map((p, index) => (
                  <circle key={index} cx={p.cx} cy={p.cy} r="5" fill="white" stroke="#e67e22" strokeWidth="2" />
                ))}
              </svg>

              <div className="d-flex justify-content-between text-muted small mt-2 ps-2 pe-2">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOP NGƯỜI ĐĂNG */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 mb-3">
            <h5 className="mb-3 text-brown">Top người đăng</h5>
            <ul className="list-unstyled">
              <li className="mb-3 pb-2 border-bottom">
                1. Nguyễn Văn A <span className="float-end fw-bold">32 bài</span>
              </li>
              <li className="mb-3 pb-2 border-bottom">
                2. Trần Thị B <span className="float-end fw-bold">21 bài</span>
              </li>
              <li className="mb-2">
                3. Phạm C <span className="float-end fw-bold">18 bài</span>
              </li>
            </ul>
          </div>

          <div className="card border-0 shadow-sm p-4">
            <h5 className="mb-3 text-brown">Thể loại nổi bật</h5>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span>Văn học</span>
              <span className="fw-bold text-muted">45%</span>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div className="progress-bar" role="progressbar" style={{ width: '45%', backgroundColor: '#e67e22' }}></div>
              <div className="progress-bar bg-light" role="progressbar" style={{ width: '55%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;