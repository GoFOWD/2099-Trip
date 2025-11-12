const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 'description'을 추가(업데이트)할 국가 목록 샘플
const countriesToUpdate = [
	{
		countryCode: 'JP',
		description:
			'벚꽃과 초현대적인 도시, 전통 사원이 공존하는 나라입니다. 예의를 중시하며, 공공장소에서 조용히 하고 팁 문화가 없는 것이 특징입니다.'
	},
	{
		countryCode: 'US',
		description:
			'광활한 자연과 세계적인 대도시가 어우러진 나라입니다. 자유를 중시하는 문화이며, 지역마다 법과 문화가 다를 수 있고 팁 문화가 보편적입니다.'
	},
	{
		countryCode: 'VN',
		description:
			'아름다운 자연경관과 풍부한 역사를 지닌 동남아시아의 보석입니다. 오토바이 문화가 발달했으며, 흥정 문화가 일반적이고 어른을 공경합니다.'
	},
	{
		countryCode: 'FR',
		description:
			'예술, 미식, 패션의 중심지입니다. 에펠탑과 루브르 박물관이 유명하며, 식사 예절을 중시하고 영어보다 프랑스어로 소통하려는 경향이 있습니다.'
	},
	{
		countryCode: 'GB',
		description:
			'왕실의 역사와 현대 문화가 공존하는 나라입니다. 펍 문화가 발달했으며, 줄서기(Queue) 예절을 매우 중요하게 생각하고 날씨 변화가 잦습니다.'
	},
	{
		countryCode: 'TH',
		description:
			'친절한 미소와 불교 문화가 인상적인 "미소의 나라"입니다. 왕실을 매우 존경하며, 머리를 만지는 것을 금기시하고 발로 사람이나 물건을 가리키지 않습니다.'
	},
	{
		countryCode: 'IT',
		description:
			'로마 제국의 유산과 르네상스 예술, 열정적인 문화를 간직한 나라입니다. 지역별 특색이 강하며, 늦은 저녁 식사 문화와 가족을 중시하는 분위기가 특징입니다.'
	},
	{
		countryCode: 'ES',
		description:
			'플라멩코와 투우, 정열적인 축제의 나라입니다. 시에스타(낮잠) 문화가 있으며, 식사 시간이 늦고 타파스를 즐기는 사교적인 문화를 가지고 있습니다.'
	},
	{
		countryCode: 'DE',
		description:
			'맥주와 소시지, 그리고 뛰어난 기술력으로 유명한 나라입니다. 시간을 매우 중시하며, 환경 보호(분리수거)에 대한 인식이 매우 높고 직설적인 소통을 선호합니다.'
	},
	{
		countryCode: 'AU',
		description:
			'캥거루와 코알라, 대자연과 서핑 문화로 유명한 대륙입니다. 여유롭고 캐주얼한 분위기이며, "No worries"라는 말을 자주 사용하는 긍정적인 문화가 있습니다.'
	},
	{
		countryCode: 'CA',
		description:
			'광활한 록키 산맥과 다문화주의가 특징인 나라입니다. 퀘벡 주는 프랑스어권이며, 예의를 중시하고 자연을 존중하는 문화가 강합니다.'
	},
	{
		countryCode: 'CN',
		description:
			'만리장성과 고대 문명, 급격한 현대화가 교차하는 나라입니다. 차(茶) 문화가 발달했으며, 체면(面子)을 중시하고 식사 시 원탁을 사용하는 문화가 있습니다.'
	}
];

async function main() {
	console.log('국가별 `description` 업데이트 스크립트 실행 시작...');

	let successCount = 0;
	let failCount = 0;

	for (const country of countriesToUpdate) {
		try {
			await prisma.country.update({
				// `countryCode`가 일치하는 레코드를 찾습니다.
				where: {
					countryCode: country.countryCode
				},
				// `description` 필드의 내용을 업데이트합니다.
				data: {
					description: country.description
				}
			});
			console.log(`✅ [${country.countryCode}] 국가 업데이트 성공.`);
			successCount++;
		} catch (e) {
			// 만약 `countryCode`가 DB에 존재하지 않으면 에러가 발생합니다.
			console.error(
				`❌ [${country.countryCode}] 국가 업데이트 실패: ${e.message}`
			);
			failCount++;
		}
	}

	console.log('---');
	console.log('업데이트 스크립트 실행 완료.');
	console.log(`성공: ${successCount}건, 실패: ${failCount}건`);
}

main()
	.catch(e => {
		console.error('스크립트 실행 중 치명적 오류 발생:', e);
		process.exit(1);
	})
	.finally(async () => {
		// Prisma 클라이언트 연결 종료
		await prisma.$disconnect();
	});
