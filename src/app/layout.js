import "../../styles/globals.css";
import './globals.css';
import { pretendard } from './fonts';

export default function RootLayout({ children }) {
	return (
		<html lang='ko' className={pretendard.variable}>
			<body>{children}</body>
		</html>
	);
}
