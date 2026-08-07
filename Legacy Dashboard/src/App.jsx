import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar/Sidebar';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import AppRoutes from './routes/AppRoutes';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

// Small helper so a class-based App can still read the current route
function withLocation(Component) {
  return function WrappedComponent(props) {
    const location = useLocation();
    return <Component {...props} location={location} />;
  };
}

class AppShell extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sidebarOpen: false };
  }

  toggleSidebar = () => {
    this.setState((prev) => ({ sidebarOpen: !prev.sidebarOpen }));
  };

  closeSidebar = () => {
    this.setState({ sidebarOpen: false });
  };

  render() {
    const { sidebarOpen } = this.state;
    const pathname = this.props.location?.pathname || '/';
    const pageTitle = PAGE_TITLES[pathname] || 'Nexus HR';

    return (
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onClose={this.closeSidebar} />
        <div className="app-main">
          <Navbar onMenuClick={this.toggleSidebar} pageTitle={pageTitle} />
          <AppRoutes />
          <Footer />
        </div>
      </div>
    );
  }
}

const AppShellWithLocation = withLocation(AppShell);

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <AppShellWithLocation />
      </BrowserRouter>
    );
  }
}

export default App;