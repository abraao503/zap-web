// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined,
    ContactsOutlined,
    NodeExpandOutlined
} from '@ant-design/icons';

// icons
const icons = {
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined,
    ContactsOutlined,
    NodeExpandOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
    id: 'utilities',
    title: '',
    type: 'group',
    children: [
        {
            id: 'contacts',
            title: 'Contacts',
            type: 'item',
            url: '/contacts',
            icon: icons.ContactsOutlined,
            breadcrumbs: false
        },
        {
            id: 'campaigns',
            title: 'Campanhas',
            type: 'item',
            url: '/campaigns',
            icon: icons.NodeExpandOutlined,
            breadcrumbs: false
        },
        {
            id: 'instances',
            title: 'Instâncias',
            type: 'item',
            url: '/instances',
            icon: icons.AppstoreAddOutlined,
            breadcrumbs: false
        }
        // {
        //     id: 'chats',
        //     title: 'Chats',
        //     type: 'item',
        //     url: '/chats',
        //     icon: icons.LoadingOutlined,
        //     breadcrumbs: false
        // }
    ]
};

export default utilities;
