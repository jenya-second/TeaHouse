import { Link, Outlet } from 'react-router';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useState } from 'react';

export function Navigation() {
    const [curPage, setCurPage] = useState<string>('');
    return (
        <>
            <Outlet />
            <Paper
                sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
                elevation={3}
            >
                {/* <Link to="/">Menu</Link>
                <Link to="/main">Catalog</Link>
                <Link to="/main/basket">Basket</Link> */}
                <BottomNavigation
                    showLabels
                    value={curPage}
                    onChange={(_event, newValue) => {
                        if (newValue == curPage) return;
                        setCurPage(newValue);
                    }}
                >
                    <BottomNavigationAction
                        component={Link}
                        label="Welcome page"
                        to="/"
                    />
                    <BottomNavigationAction
                        component={Link}
                        label="Catalog"
                        to="/main/o"
                    />
                    <BottomNavigationAction
                        component={Link}
                        to="/main/basket"
                        label="Basket"
                    />
                </BottomNavigation>
            </Paper>
        </>
    );
}
