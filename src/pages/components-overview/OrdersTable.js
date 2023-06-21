import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

import Paper from '@mui/material/Paper';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

// material-ui
import {
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TablePagination,
    TableFooter
} from '@mui/material';

// third-party
// import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

function createData(name, phoneNumber, tags) {
    return { name, phoneNumber, tags };
}

const rows = [
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2'),
    createData('abraao 1', '92 9918242-83', 'tag1'),
    createData('abraao 2', '92 9918242-82', 'tag1'),
    createData('abraao 3', '92 9918242-85', 'tag2'),
    createData('abraao 4', '92 9918242-87', 'tag2')
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Nome'
    },
    {
        id: 'phoneNumber',
        align: 'left',
        disablePadding: false,
        label: 'Telefone'
    },
    {
        id: 'tags',
        align: 'right',
        disablePadding: false,
        label: 'Tags'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

OrderTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case 0:
            color = 'warning';
            title = 'Pending';
            break;
        case 1:
            color = 'success';
            title = 'Approved';
            break;
        case 2:
            color = 'error';
            title = 'Rejected';
            break;
        default:
            color = 'primary';
            title = 'None';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

OrderStatus.propTypes = {
    status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
    // const [order] = useState('asc');
    // const [orderBy] = useState('trackingNo');
    // const [selected] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableBody>
                        {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.phoneNumber}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.tags}
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page'
                                    },
                                    native: true
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                // ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
}
