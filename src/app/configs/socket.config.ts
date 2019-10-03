import { GlobalConfig } from './global.config';
export let SocketConfig: any = [];
if (GlobalConfig.production) {
    SocketConfig = {
        host : GlobalConfig.backend_domain,
        port : GlobalConfig.backend_domain_port
    };
} else {
    SocketConfig = {
        host : GlobalConfig.dev_backend_domain,
        port : GlobalConfig.dev_backend_domain_port
    };
}
