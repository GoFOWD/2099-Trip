/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'places.googleapis.com',
				pathname: '/v1/**'
			}
		]
	}
};

export default nextConfig;
