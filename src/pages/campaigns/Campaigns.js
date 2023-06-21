import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Breadcrumbs from './Breadcrumbs';
import campaignsService from 'services/campaignsService';
import { ReloadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
// import IconButton from '@mui/material/IconButton';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);

    const getCampaigns = async () => {
        const response = await campaignsService.getCampaigns();
        console.log('response', response);
        setCampaigns(response);
    };

    useEffect(() => {
        getCampaigns();
    }, []);

    const handleRetryCampaign = async (campaignId) => {
        const response = await campaignsService.retryCampaign(campaignId);
        console.log('response', response);
        getCampaigns();
    };

    const handleDeleteCampaign = async (campaignId) => {
        const response = await campaignsService.deleteCampaign(campaignId);
        console.log('response', response);
        getCampaigns();
    };

    const formatScheduledAt = (scheduledAt) => {
        const date = new Date(scheduledAt);
        return date.toLocaleString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatStatus = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'Completa';
            case 'ERROR':
                return 'Erro';
            case 'IN_PROGRESS':
                return 'Em progresso';
            case 'PENDING':
                return 'Pendente';
            default:
                return 'Desconhecido';
        }
    };

    const formatError = (error) => {
        if (error === 'Client not initialized!') {
            return 'Instância não inicializada!';
        }

        return error;
    };

    return (
        <>
            <Breadcrumbs pageAliases={{ campaigns: 'Campanhas' }} />
            <Button component={RouterLink} to="/campaigns/new">
                Nova campanha
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="campaign table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Tags</TableCell>
                            <TableCell>Agendamento</TableCell>
                            <TableCell>Data Agendamento</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Erro</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campaigns.map((campaign) => (
                            <TableRow key={campaign.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{campaign.name}</TableCell>
                                <TableCell>
                                    {campaign.tags.map((tag) => (
                                        <span key={tag.id}>
                                            {tag.name}
                                            <br />
                                        </span>
                                    ))}
                                </TableCell>
                                <TableCell>{campaign.to_schedule ? 'Sim' : 'Não'}</TableCell>
                                <TableCell>{campaign.to_schedule ? formatScheduledAt(campaign.scheduled_at) : '-'}</TableCell>
                                <TableCell>{formatStatus(campaign.initialization_status)}</TableCell>
                                <TableCell>
                                    <Box sx={{ color: 'error.main' }}>{formatError(campaign.error)}</Box>
                                </TableCell>
                                <TableCell align="center">
                                    {campaign.initialization_status === 'ERROR' && (
                                        <Button
                                            variant="contained"
                                            onClick={() => handleRetryCampaign(campaign.id)}
                                            color="warning"
                                            sx={{
                                                minWidth: 30
                                            }}
                                        >
                                            <ReloadOutlined />
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        component={RouterLink}
                                        to={`/campaigns/view/${campaign.id}`}
                                        color="info"
                                        sx={{
                                            ml: 1,
                                            minWidth: 30
                                        }}
                                    >
                                        <EyeOutlined />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDeleteCampaign(campaign.id)}
                                        color="error"
                                        sx={{
                                            ml: 1,
                                            minWidth: 30
                                        }}
                                    >
                                        <DeleteOutlined />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Campaigns;
