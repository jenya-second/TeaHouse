import { Link, Outlet } from 'react-router';

export function Navigation() {
    return (
        <>
            <Outlet />
            <Link to="/">To welcome page</Link>
        </>
    );
}
