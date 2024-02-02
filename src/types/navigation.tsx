export type MainStackParamList = {
	MainTabs: undefined;
	SecondScreen: undefined;
	DetailFile: { id: string }; 
	AddCourse: undefined; // Add this line
	EditCourse: undefined; // Add this line
	Subjects: undefined; // Add this line
	EditFolder: { Folder_ID: string };
	AddFolder: undefined;
	Detail: undefined;
};

export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
	ForgetPassword: undefined;
};

export type MainTabsParamList = {
	Home: undefined;
	Profile: undefined;
	About: undefined;
};
