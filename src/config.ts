interface AppConfig {
	appName: string;
	appVersion: string;
	appEnv: 'test' | 'prod';
	basePath: string;
	baseUrl: string;
	siteUrl: string;
	apiUrl: string;
	nttApiUrl: string;
	trackApiUrl: string;
	operateApiUrl: string;
	trackEnabled: boolean;
}

const appConfig = {
	appName: import.meta.env.VITE_APP_BASE_NAME,
	// appVersion: process.env.REACT_APP_VERSION, // 发布版本
	appEnv: import.meta.env.MODE, // 环境
	// basePath: process.env.PUBLIC_URL, // 发布地址
	baseUrl: import.meta.env.VITE_APP_BASE_URL,
	apiUrl: import.meta.env.VITE_APP_API_URL,
	nttApiUrl: import.meta.env.VITE_APP_NTT_API_URL,
	trackApiUrl: import.meta.env.VITE_APP_TRACK_API_URL,
	operateApiUrl: import.meta.env.VITE_APP_OPERATE_API_URL,
};

export default appConfig as AppConfig;
