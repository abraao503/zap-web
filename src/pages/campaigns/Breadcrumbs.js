import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Breadcrumb(props) {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    const pageAliases = props.pageAliases || {};

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const displayName = pageAliases[value] || value;

                return last ? (
                    <Typography key={to} color="text.primary">
                        {displayName}
                    </Typography>
                ) : (
                    <Link key={to} color="inherit" component={RouterLink} to={to}>
                        {displayName}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}

export default Breadcrumb;
