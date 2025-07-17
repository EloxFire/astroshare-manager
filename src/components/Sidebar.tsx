import '../styles/components/sidebar.scss';

const Sidebar = () => {
  return (
    <div className={"sidebar"}>
      <div className="sidebar-header">
        <h1>My Application</h1>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>&copy; 2023 My Application</p>
      </div>
    </div>
  );
};

export default Sidebar;
