import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';
import OrdersTable from './OrdersTable';
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { SearchOutlined } from '@ant-design/icons';

const ComponentColor = () => (
    <ComponentSkeleton>
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <FormControl>
                    <OutlinedInput
                        size="small"
                        id="header-search"
                        startAdornment={
                            <InputAdornment position="start" sx={{ mr: -0.5 }}>
                                <SearchOutlined />
                            </InputAdornment>
                        }
                        aria-describedby="header-search-text"
                        inputProps={{
                            'aria-label': 'weight'
                        }}
                        placeholder="Pesquisar por nome"
                    />
                </FormControl>
                <FormControl>
                    <OutlinedInput
                        size="small"
                        id="header-search"
                        startAdornment={
                            <InputAdornment position="start" sx={{ mr: -0.5 }}>
                                <SearchOutlined />
                            </InputAdornment>
                        }
                        aria-describedby="header-search-text"
                        inputProps={{
                            'aria-label': 'weight'
                        }}
                        placeholder="Pesquisar por telefone"
                    />
                </FormControl>
                <FormControl>
                    <OutlinedInput
                        size="small"
                        id="header-search"
                        startAdornment={
                            <InputAdornment position="start" sx={{ mr: -0.5 }}>
                                <SearchOutlined />
                            </InputAdornment>
                        }
                        aria-describedby="header-search-text"
                        inputProps={{
                            'aria-label': 'weight'
                        }}
                        placeholder="Pesquisar por tag"
                    />
                </FormControl>
            </Grid>
            <Grid item xs={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Recent Orders</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <OrdersTable />
                </MainCard>
            </Grid>
        </Grid>
    </ComponentSkeleton>
);

export default ComponentColor;
