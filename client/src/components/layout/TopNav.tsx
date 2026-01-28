import { Link } from "react-router-dom";

export default function TopNav() {
  return (
    <>
      <h1>TOP NAVE HERE</h1>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/experiments">Experiment</Link>
        </li>
        <li>
          <Link to="/experimentDetail">Detail</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </>
  );
}
