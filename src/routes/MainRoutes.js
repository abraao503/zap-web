import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// const Contacts = Loadable(lazy(() => import('pages/components-overview/Contacts')));
const Campaigns = Loadable(lazy(() => import('pages/campaigns/Campaigns')));
const Campaign = Loadable(lazy(() => import('pages/campaigns/Campaign')));
const Instances = Loadable(lazy(() => import('pages/instances/Instances')));
const Contacts = Loadable(lazy(() => import('pages/contacts/Contacts')));
// const Chats = Loadable(lazy(() => import('pages/chats/Chats')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'contacts',
            element: <Contacts />
        },
        {
            path: 'campaigns',
            element: <Campaigns />
        },
        {
            path: 'campaigns/new',
            element: <Campaign />
        },
        {
            path: 'campaigns/view/:id',
            element: <Campaign />
        },
        {
            path: 'instances',
            element: <Instances />
        }
        // {
        //     path: 'chats',
        //     element: <Chats />
        // }
    ]
};

export default MainRoutes;
