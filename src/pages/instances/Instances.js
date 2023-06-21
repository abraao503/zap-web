import { useState, useEffect } from 'react';
// import QRCode from 'qrcode.react';
import io from 'socket.io-client';
import { Button, Card, CardContent, Container, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import instancesService from 'services/instancesService';
import CreateInstanceDialog from './createInstanceDialog';

function InstancePage() {
    const [connecting, setConnecting] = useState(false);
    const [instances, setInstances] = useState([]);
    // const [socket, setSocket] = useState(null);
    const [qrCodeImage, setQrCodeImage] = useState(null);
    const [loadingQrCode, setLoadingQrCode] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchData = async () => {
        const instances = await instancesService.getInstances();
        setInstances(instances);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatNumber = (number = '') => {
        if (number.includes('@c.us')) {
            return number;
        }

        if (number.length === 12 && number.startsWith('55')) {
            const DDI = '55';
            const phoneNumber = number.substring(2, 12);

            return `${DDI}${phoneNumber}@c.us`;
        }

        if (number.length === 13 && number.startsWith('55')) {
            const phoneNumber = number.substring(2, 13);
            const DDI = '55';

            const ddd = phoneNumber.substring(0, 2);
            return `${DDI}${ddd}${phoneNumber.substring(3)}@c.us`;
        }

        return `${number}@c.us`;
    };

    useEffect(() => {
        // const socketInstance = io('http://89.117.33.56', { path: '/socket.io', transports: ['websocket', 'polling'] });
        const socketInstance = io(process.env.REACT_APP_API_SOCKET_URL, { transports: ['websocket', 'polling'] });

        socketInstance.on(
            'connect',
            () => {
                console.log('Conectado ao servidor socket.io');
            },
            {
                transports: ['websocket', 'polling']
            }
        );

        socketInstance.on('disconnect', () => {
            console.log('Desconectado do servidor socket.io');
        });

        socketInstance.on('status-session', (status) => {
            console.log('status-session', status);

            if (status.statusSession === 'initBrowser') {
                setLoadingQrCode(true);
            }

            if (status.statusSession === 'qrReadSuccess') {
                setConnecting(false);
            }

            if (status.statusSession === 'successChat') {
                setLoadingQrCode(false);
                setConnecting(false);
            }

            setInstances((instances) => {
                return instances.map((instance) => {
                    const phoneNumber = formatNumber(instance.phone_number);
                    console.log('phoneNumber', phoneNumber);
                    console.log('status.from', status.from);
                    if (phoneNumber === status.from) {
                        return { ...instance, status: status.statusSession };
                    }

                    return instance;
                });
            });
        });

        socketInstance.on('qr-code', (image) => {
            console.log('qr-code', image);
            setQrCodeImage(image);
            setLoadingQrCode(false);
        });

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConnect = async (instanceId) => {
        setConnecting(true);
        setLoadingQrCode(true);
        await instancesService.connectInstance(instanceId);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h3" component="h1" align="center" gutterBottom>
                Instâncias
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            height: '100%'
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom>
                                NOVA INSTÂNCIA
                            </Typography>
                        </CardContent>
                        <Button
                            sx={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', marginBottom: 2 }}
                            variant="contained"
                            color="success"
                            onClick={handleOpenDialog}
                        >
                            Criar
                        </Button>
                    </Card>
                </Grid>
                {instances.map((instance) => (
                    <Grid item xs={12} sm={6} md={4} key={instance.id || instance.name}>
                        <Card
                            sx={{
                                height: '100%'
                            }}
                        >
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {instance.name}
                                </Typography>
                                <Typography color="textSecondary">Telefone: {instance.phone_number}</Typography>
                                <Typography
                                    variant="h6"
                                    component="p"
                                    color={instance.status === 'successChat' ? 'primary' : 'secondary'}
                                    gutterBottom
                                >
                                    {instance.status === 'successChat' ? 'CONECTADO' : 'DESCONECTADO'}
                                </Typography>
                            </CardContent>
                            {instance.status !== 'successChat' && (
                                <Button
                                    sx={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', marginBottom: 2 }}
                                    variant="contained"
                                    onClick={() => handleConnect(instance.id)}
                                >
                                    Conectar
                                </Button>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Modal open={connecting}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                    }}
                >
                    {loadingQrCode && <CircularProgress />}
                    {!loadingQrCode && qrCodeImage && <img src={qrCodeImage} alt="QR Code" />}
                    <Button variant="contained" onClick={() => setConnecting(false)}>
                        Fechar
                    </Button>
                </div>
            </Modal>
            <CreateInstanceDialog open={openDialog} onClose={handleCloseDialog} reload={fetchData} />
        </Container>
    );
}

export default InstancePage;
