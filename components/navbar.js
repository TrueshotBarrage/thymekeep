import { Component } from "react";
import Link from "next/link";
import styles from "./navbar.module.css"


const navbarItems = [
  '/',
  '/profile',
  '/login'
];
const navbarNames = [
  'Home',
  'Profile',
  'Login'
]

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(navbarItem) {
    this.setState({ active: navbarItem });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.logo}>Scheduler-JK</div>
        <div className={styles.navbar}>
          {navbarItems.map(navbarItem =>
            <Link
              href={navbarItem}
              key={navbarItem}
            >
              <a
                className={this.state.active === navbarItem ? styles.active : {}}
                onClick={this.handleClick.bind(this, navbarItem)}
              >
                {navbarNames[navbarItems.indexOf(navbarItem)]}</a>
            </Link>
          )}

        </div>
      </div>
    );
  }
}

export default Navbar;