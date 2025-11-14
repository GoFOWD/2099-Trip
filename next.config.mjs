/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'places.googleapis.com',
				pathname: '/v1/**'
			},
			{
				protocol: 'https',
				hostname: 'opendata.mofa.go.kr',
				pathname: '/fileDownload/images/**'
			},
			{
				protocol: 'https',
				hostname: 'www.google.com',
				pathname: '/**'
			},
			{
				protocol: 'https',
				hostname: 'rpesksupoluwocnkeijx.supabase.co',
				pathname: '/storage/v1/object/public/**'
			}
		]
	}
};

export default nextConfig;
