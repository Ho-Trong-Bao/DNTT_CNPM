/**
 * File: frontend/src/components/Footer.jsx
 * Footer Component
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <p className="mb-0">
          © {currentYear} - Nhóm 13 | Sách Cũ Theo Khu Vực |
          <span className="ms-2">
            <i className="bi bi-heart-fill text-danger"></i> Made with love
          </span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;