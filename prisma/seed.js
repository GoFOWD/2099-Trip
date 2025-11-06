import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ISO 3166-1 Alpha-2 기준 249개 국가/지역 전체 목록
const countriesData = [
	{ countryCode: 'AF', name: 'Afghanistan', nameKo: '아프가니스탄' },
	{ countryCode: 'AX', name: 'Åland Islands', nameKo: '올란드 제도' },
	{ countryCode: 'AL', name: 'Albania', nameKo: '알바니아' },
	{ countryCode: 'DZ', name: 'Algeria', nameKo: '알제리' },
	{ countryCode: 'AS', name: 'American Samoa', nameKo: '아메리칸사모아' },
	{ countryCode: 'AD', name: 'Andorra', nameKo: '안도라' },
	{ countryCode: 'AO', name: 'Angola', nameKo: '앙골라' },
	{ countryCode: 'AI', name: 'Anguilla', nameKo: '앵귈라' },
	{ countryCode: 'AQ', name: 'Antarctica', nameKo: '남극' },
	{ countryCode: 'AG', name: 'Antigua and Barbuda', nameKo: '앤티가 바부다' },
	{ countryCode: 'AR', name: 'Argentina', nameKo: '아르헨티나' },
	{ countryCode: 'AM', name: 'Armenia', nameKo: '아르메니아' },
	{ countryCode: 'AW', name: 'Aruba', nameKo: '아루바' },
	{ countryCode: 'AU', name: 'Australia', nameKo: '호주' },
	{ countryCode: 'AT', name: 'Austria', nameKo: '오스트리아' },
	{ countryCode: 'AZ', name: 'Azerbaijan', nameKo: '아제르바이잔' },
	{ countryCode: 'BS', name: 'Bahamas', nameKo: '바하마' },
	{ countryCode: 'BH', name: 'Bahrain', nameKo: '바레인' },
	{ countryCode: 'BD', name: 'Bangladesh', nameKo: '방글라데시' },
	{ countryCode: 'BB', name: 'Barbados', nameKo: '바베이도스' },
	{ countryCode: 'BY', name: 'Belarus', nameKo: '벨라루스' },
	{ countryCode: 'BE', name: 'Belgium', nameKo: '벨기에' },
	{ countryCode: 'BZ', name: 'Belize', nameKo: '벨리즈' },
	{ countryCode: 'BJ', name: 'Benin', nameKo: '베냉' },
	{ countryCode: 'BM', name: 'Bermuda', nameKo: '버뮤다' },
	{ countryCode: 'BT', name: 'Bhutan', nameKo: '부탄' },
	{ countryCode: 'BO', name: 'Bolivia', nameKo: '볼리비아' },
	{
		countryCode: 'BQ',
		name: 'Bonaire, Sint Eustatius and Saba',
		nameKo: '보네르섬'
	},
	{
		countryCode: 'BA',
		name: 'Bosnia and Herzegovina',
		nameKo: '보스니아 헤르체고비나'
	},
	{ countryCode: 'BW', name: 'Botswana', nameKo: '보츠와나' },
	{ countryCode: 'BV', name: 'Bouvet Island', nameKo: '부벳섬' },
	{ countryCode: 'BR', name: 'Brazil', nameKo: '브라질' },
	{
		countryCode: 'IO',
		name: 'British Indian Ocean Territory',
		nameKo: '영국령 인도양 지역'
	},
	{ countryCode: 'BN', name: 'Brunei Darussalam', nameKo: '브루나이' },
	{ countryCode: 'BG', name: 'Bulgaria', nameKo: '불가리아' },
	{ countryCode: 'BF', name: 'Burkina Faso', nameKo: '부르키나파소' },
	{ countryCode: 'BI', name: 'Burundi', nameKo: '부룬디' },
	{ countryCode: 'CV', name: 'Cabo Verde', nameKo: '카보베르데' },
	{ countryCode: 'KH', name: 'Cambodia', nameKo: '캄보디아' },
	{ countryCode: 'CM', name: 'Cameroon', nameKo: '카메룬' },
	{ countryCode: 'CA', name: 'Canada', nameKo: '캐나다' },
	{ countryCode: 'KY', name: 'Cayman Islands', nameKo: '케이맨 제도' },
	{
		countryCode: 'CF',
		name: 'Central African Republic',
		nameKo: '중앙아프리카공화국'
	},
	{ countryCode: 'TD', name: 'Chad', nameKo: '차드' },
	{ countryCode: 'CL', name: 'Chile', nameKo: '칠레' },
	{ countryCode: 'CN', name: 'China', nameKo: '중국' },
	{ countryCode: 'CX', name: 'Christmas Island', nameKo: '크리스마스섬' },
	{
		countryCode: 'CC',
		name: 'Cocos (Keeling) Islands',
		nameKo: '코코스 제도'
	},
	{ countryCode: 'CO', name: 'Colombia', nameKo: '콜롬비아' },
	{ countryCode: 'KM', name: 'Comoros', nameKo: '코모로' },
	{ countryCode: 'CG', name: 'Congo', nameKo: '콩고 공화국' },
	{
		countryCode: 'CD',
		name: 'Congo (Democratic Republic of the)',
		nameKo: '콩고 민주 공화국'
	},
	{ countryCode: 'CK', name: 'Cook Islands', nameKo: '쿡 제도' },
	{ countryCode: 'CR', name: 'Costa Rica', nameKo: '코스타리카' },
	{ countryCode: 'CI', name: "Côte d'Ivoire", nameKo: '코트디부아르' },
	{ countryCode: 'HR', name: 'Croatia', nameKo: '크로아티아' },
	{ countryCode: 'CU', name: 'Cuba', nameKo: '쿠바' },
	{ countryCode: 'CW', name: 'Curaçao', nameKo: '퀴라소' },
	{ countryCode: 'CY', name: 'Cyprus', nameKo: '키프로스' },
	{ countryCode: 'CZ', name: 'Czechia', nameKo: '체코' },
	{ countryCode: 'DK', name: 'Denmark', nameKo: '덴마크' },
	{ countryCode: 'DJ', name: 'Djibouti', nameKo: '지부티' },
	{ countryCode: 'DM', name: 'Dominica', nameKo: '도미니카 연방' },
	{
		countryCode: 'DO',
		name: 'Dominican Republic',
		nameKo: '도미니카 공화국'
	},
	{ countryCode: 'EC', name: 'Ecuador', nameKo: '에콰도르' },
	{ countryCode: 'EG', name: 'Egypt', nameKo: '이집트' },
	{ countryCode: 'SV', name: 'El Salvador', nameKo: '엘살바도르' },
	{ countryCode: 'GQ', name: 'Equatorial Guinea', nameKo: '적도 기니' },
	{ countryCode: 'ER', name: 'Eritrea', nameKo: '에리트레아' },
	{ countryCode: 'EE', name: 'Estonia', nameKo: '에스토니아' },
	{ countryCode: 'SZ', name: 'Eswatini', nameKo: '에스와티니' },
	{ countryCode: 'ET', name: 'Ethiopia', nameKo: '에티오피아' },
	{
		countryCode: 'FK',
		name: 'Falkland Islands (Malvinas)',
		nameKo: '포클랜드 제도'
	},
	{ countryCode: 'FO', name: 'Faroe Islands', nameKo: '페로 제도' },
	{ countryCode: 'FJ', name: 'Fiji', nameKo: '피지' },
	{ countryCode: 'FI', name: 'Finland', nameKo: '핀란드' },
	{ countryCode: 'FR', name: 'France', nameKo: '프랑스' },
	{ countryCode: 'GF', name: 'French Guiana', nameKo: '프랑스령 기아나' },
	{
		countryCode: 'PF',
		name: 'French Polynesia',
		nameKo: '프랑스령 폴리네시아'
	},
	{
		countryCode: 'TF',
		name: 'French Southern Territories',
		nameKo: '프랑스령 남방 및 남극 지역'
	},
	{ countryCode: 'GA', name: 'Gabon', nameKo: '가봉' },
	{ countryCode: 'GM', name: 'Gambia', nameKo: '감비아' },
	{ countryCode: 'GE', name: 'Georgia', nameKo: '조지아' },
	{ countryCode: 'DE', name: 'Germany', nameKo: '독일' },
	{ countryCode: 'GH', name: 'Ghana', nameKo: '가나' },
	{ countryCode: 'GI', name: 'Gibraltar', nameKo: '지브롤터' },
	{ countryCode: 'GR', name: 'Greece', nameKo: '그리스' },
	{ countryCode: 'GL', name: 'Greenland', nameKo: '그린란드' },
	{ countryCode: 'GD', name: 'Grenada', nameKo: '그레나다' },
	{ countryCode: 'GP', name: 'Guadeloupe', nameKo: '과들루프' },
	{ countryCode: 'GU', name: 'Guam', nameKo: '괌' },
	{ countryCode: 'GT', name: 'Guatemala', nameKo: '과테말라' },
	{ countryCode: 'GG', name: 'Guernsey', nameKo: '건지섬' },
	{ countryCode: 'GN', name: 'Guinea', nameKo: '기니' },
	{ countryCode: 'GW', name: 'Guinea-Bissau', nameKo: '기니비사우' },
	{ countryCode: 'GY', name: 'Guyana', nameKo: '가이아나' },
	{ countryCode: 'HT', name: 'Haiti', nameKo: '아이티' },
	{
		countryCode: 'HM',
		name: 'Heard Island and McDonald Islands',
		nameKo: '허드 맥도널드 제도'
	},
	{ countryCode: 'VA', name: 'Holy See', nameKo: '바티칸 시국' },
	{ countryCode: 'HN', name: 'Honduras', nameKo: '온두라스' },
	{ countryCode: 'HK', name: 'Hong Kong', nameKo: '홍콩' },
	{ countryCode: 'HU', name: 'Hungary', nameKo: '헝가리' },
	{ countryCode: 'IS', name: 'Iceland', nameKo: '아이슬란드' },
	{ countryCode: 'IN', name: 'India', nameKo: '인도' },
	{ countryCode: 'ID', name: 'Indonesia', nameKo: '인도네시아' },
	{ countryCode: 'IR', name: 'Iran', nameKo: '이란' },
	{ countryCode: 'IQ', name: 'Iraq', nameKo: '이라크' },
	{ countryCode: 'IE', name: 'Ireland', nameKo: '아일랜드' },
	{ countryCode: 'IM', name: 'Isle of Man', nameKo: '맨섬' },
	{ countryCode: 'IL', name: 'Israel', nameKo: '이스라엘' },
	{ countryCode: 'IT', name: 'Italy', nameKo: '이탈리아' },
	{ countryCode: 'JM', name: 'Jamaica', nameKo: '자메이카' },
	{ countryCode: 'JP', name: 'Japan', nameKo: '일본' },
	{ countryCode: 'JE', name: 'Jersey', nameKo: '저지섬' },
	{ countryCode: 'JO', name: 'Jordan', nameKo: '요르단' },
	{ countryCode: 'KZ', name: 'Kazakhstan', nameKo: '카자흐스탄' },
	{ countryCode: 'KE', name: 'Kenya', nameKo: '케냐' },
	{ countryCode: 'KI', name: 'Kiribati', nameKo: '키리바시' },
	{
		countryCode: 'KP',
		name: "Korea (Democratic People's Republic of)",
		nameKo: '북한'
	},
	{ countryCode: 'KR', name: 'Korea (Republic of)', nameKo: '대한민국' },
	{ countryCode: 'KW', name: 'Kuwait', nameKo: '쿠웨이트' },
	{ countryCode: 'KG', name: 'Kyrgyzstan', nameKo: '키르기스스탄' },
	{
		countryCode: 'LA',
		name: "Lao People's Democratic Republic",
		nameKo: '라오스'
	},
	{ countryCode: 'LV', name: 'Latvia', nameKo: '라트비아' },
	{ countryCode: 'LB', name: 'Lebanon', nameKo: '레바논' },
	{ countryCode: 'LS', name: 'Lesotho', nameKo: '레소토' },
	{ countryCode: 'LR', name: 'Liberia', nameKo: '라이베리아' },
	{ countryCode: 'LY', name: 'Libya', nameKo: '리비아' },
	{ countryCode: 'LI', name: 'Liechtenstein', nameKo: '리히텐슈타인' },
	{ countryCode: 'LT', name: 'Lithuania', nameKo: '리투아니아' },
	{ countryCode: 'LU', name: 'Luxembourg', nameKo: '룩셈부르크' },
	{ countryCode: 'MO', name: 'Macao', nameKo: '마카오' },
	{ countryCode: 'MG', name: 'Madagascar', nameKo: '마다가스카르' },
	{ countryCode: 'MW', name: 'Malawi', nameKo: '말라위' },
	{ countryCode: 'MY', name: 'Malaysia', nameKo: '말레이시아' },
	{ countryCode: 'MV', name: 'Maldives', nameKo: '몰디브' },
	{ countryCode: 'ML', name: 'Mali', nameKo: '말리' },
	{ countryCode: 'MT', name: 'Malta', nameKo: '몰타' },
	{ countryCode: 'MH', name: 'Marshall Islands', nameKo: '마셜 제도' },
	{ countryCode: 'MQ', name: 'Martinique', nameKo: '마르티니크' },
	{ countryCode: 'MR', name: 'Mauritania', nameKo: '모리타니' },
	{ countryCode: 'MU', name: 'Mauritius', nameKo: '모리셔스' },
	{ countryCode: 'YT', name: 'Mayotte', nameKo: '마요트' },
	{ countryCode: 'MX', name: 'Mexico', nameKo: '멕시코' },
	{ countryCode: 'FM', name: 'Micronesia', nameKo: '미크로네시아 연방' },
	{ countryCode: 'MD', name: 'Moldova', nameKo: '몰도바' },
	{ countryCode: 'MC', name: 'Monaco', nameKo: '모나코' },
	{ countryCode: 'MN', name: 'Mongolia', nameKo: '몽골' },
	{ countryCode: 'ME', name: 'Montenegro', nameKo: '몬테네그로' },
	{ countryCode: 'MS', name: 'Montserrat', nameKo: '몬트세랫' },
	{ countryCode: 'MA', name: 'Morocco', nameKo: '모로코' },
	{ countryCode: 'MZ', name: 'Mozambique', nameKo: '모잠비크' },
	{ countryCode: 'MM', name: 'Myanmar', nameKo: '미얀마' },
	{ countryCode: 'NA', name: 'Namibia', nameKo: '나미비아' },
	{ countryCode: 'NR', name: 'Nauru', nameKo: '나우루' },
	{ countryCode: 'NP', name: 'Nepal', nameKo: '네팔' },
	{ countryCode: 'NL', name: 'Netherlands', nameKo: '네덜란드' },
	{ countryCode: 'NC', name: 'New Caledonia', nameKo: '누벨칼레도니' },
	{ countryCode: 'NZ', name: 'New Zealand', nameKo: '뉴질랜드' },
	{ countryCode: 'NI', name: 'Nicaragua', nameKo: '니카라과' },
	{ countryCode: 'NE', name: 'Niger', nameKo: '니제르' },
	{ countryCode: 'NG', name: 'Nigeria', nameKo: '나이지리아' },
	{ countryCode: 'NU', name: 'Niue', nameKo: '니우에' },
	{ countryCode: 'NF', name: 'Norfolk Island', nameKo: '노퍽섬' },
	{ countryCode: 'MK', name: 'North Macedonia', nameKo: '북마케도니아' },
	{
		countryCode: 'MP',
		name: 'Northern Mariana Islands',
		nameKo: '북마리아나 제도'
	},
	{ countryCode: 'NO', name: 'Norway', nameKo: '노르웨이' },
	{ countryCode: 'OM', name: 'Oman', nameKo: '오만' },
	{ countryCode: 'PK', name: 'Pakistan', nameKo: '파키스탄' },
	{ countryCode: 'PW', name: 'Palau', nameKo: '팔라우' },
	{ countryCode: 'PS', name: 'Palestine, State of', nameKo: '팔레스타인' },
	{ countryCode: 'PA', name: 'Panama', nameKo: '파나마' },
	{ countryCode: 'PG', name: 'Papua New Guinea', nameKo: '파푸아뉴기니' },
	{ countryCode: 'PY', name: 'Paraguay', nameKo: '파라과이' },
	{ countryCode: 'PE', name: 'Peru', nameKo: '페루' },
	{ countryCode: 'PH', name: 'Philippines', nameKo: '필리핀' },
	{ countryCode: 'PN', name: 'Pitcairn', nameKo: '핏케언 제도' },
	{ countryCode: 'PL', name: 'Poland', nameKo: '폴란드' },
	{ countryCode: 'PT', name: 'Portugal', nameKo: '포르투갈' },
	{ countryCode: 'PR', name: 'Puerto Rico', nameKo: '푸에르토리코' },
	{ countryCode: 'QA', name: 'Qatar', nameKo: '카타르' },
	{ countryCode: 'RE', name: 'Réunion', nameKo: '레위니옹' },
	{ countryCode: 'RO', name: 'Romania', nameKo: '루마니아' },
	{ countryCode: 'RU', name: 'Russian Federation', nameKo: '러시아' },
	{ countryCode: 'RW', name: 'Rwanda', nameKo: '르완다' },
	{ countryCode: 'BL', name: 'Saint Barthélemy', nameKo: '생바르텔레미' },
	{
		countryCode: 'SH',
		name: 'Saint Helena, Ascension and Tristan da Cunha',
		nameKo: '세인트헬레나'
	},
	{
		countryCode: 'KN',
		name: 'Saint Kitts and Nevis',
		nameKo: '세인트키츠 네비스'
	},
	{ countryCode: 'LC', name: 'Saint Lucia', nameKo: '세인트루시아' },
	{
		countryCode: 'MF',
		name: 'Saint Martin (French part)',
		nameKo: '생마르탱'
	},
	{
		countryCode: 'PM',
		name: 'Saint Pierre and Miquelon',
		nameKo: '생피에르 미클롱'
	},
	{
		countryCode: 'VC',
		name: 'Saint Vincent and the Grenadines',
		nameKo: '세인트빈센트 그레나딘'
	},
	{ countryCode: 'WS', name: 'Samoa', nameKo: '사모아' },
	{ countryCode: 'SM', name: 'San Marino', nameKo: '산마리노' },
	{
		countryCode: 'ST',
		name: 'Sao Tome and Principe',
		nameKo: '상투메 프린시페'
	},
	{ countryCode: 'SA', name: 'Saudi Arabia', nameKo: '사우디아라비아' },
	{ countryCode: 'SN', name: 'Senegal', nameKo: '세네갈' },
	{ countryCode: 'RS', name: 'Serbia', nameKo: '세르비아' },
	{ countryCode: 'SC', name: 'Seychelles', nameKo: '세이셸' },
	{ countryCode: 'SL', name: 'Sierra Leone', nameKo: '시에라리온' },
	{ countryCode: 'SG', name: 'Singapore', nameKo: '싱가포르' },
	{
		countryCode: 'SX',
		name: 'Sint Maarten (Dutch part)',
		nameKo: '신트마르턴'
	},
	{ countryCode: 'SK', name: 'Slovakia', nameKo: '슬로바키아' },
	{ countryCode: 'SI', name: 'Slovenia', nameKo: '슬로베니아' },
	{ countryCode: 'SB', name: 'Solomon Islands', nameKo: '솔로몬 제도' },
	{ countryCode: 'SO', name: 'Somalia', nameKo: '소말리아' },
	{ countryCode: 'ZA', name: 'South Africa', nameKo: '남아프리카 공화국' },
	{
		countryCode: 'GS',
		name: 'South Georgia and the South Sandwich Islands',
		nameKo: '사우스조지아 사우스샌드위치 제도'
	},
	{ countryCode: 'SS', name: 'South Sudan', nameKo: '남수단' },
	{ countryCode: 'ES', name: 'Spain', nameKo: '스페인' },
	{ countryCode: 'LK', name: 'Sri Lanka', nameKo: '스리랑카' },
	{ countryCode: 'SD', name: 'Sudan', nameKo: '수단' },
	{ countryCode: 'SR', name: 'Suriname', nameKo: '수리남' },
	{
		countryCode: 'SJ',
		name: 'Svalbard and Jan Mayen',
		nameKo: '스발바르 얀마옌'
	},
	{ countryCode: 'SE', name: 'Sweden', nameKo: '스웨덴' },
	{ countryCode: 'CH', name: 'Switzerland', nameKo: '스위스' },
	{ countryCode: 'SY', name: 'Syrian Arab Republic', nameKo: '시리아' },
	{ countryCode: 'TW', name: 'Taiwan', nameKo: '대만' },
	{ countryCode: 'TJ', name: 'Tajikistan', nameKo: '타지키스탄' },
	{ countryCode: 'TZ', name: 'Tanzania', nameKo: '탄자니아' },
	{ countryCode: 'TH', name: 'Thailand', nameKo: '태국' },
	{ countryCode: 'TL', name: 'Timor-Leste', nameKo: '동티모르' },
	{ countryCode: 'TG', name: 'Togo', nameKo: '토고' },
	{ countryCode: 'TK', name: 'Tokelau', nameKo: '토켈라우' },
	{ countryCode: 'TO', name: 'Tonga', nameKo: '통가' },
	{
		countryCode: 'TT',
		name: 'Trinidad and Tobago',
		nameKo: '트리니다드 토바고'
	},
	{ countryCode: 'TN', name: 'Tunisia', nameKo: '튀니지' },
	{ countryCode: 'TR', name: 'Turkey', nameKo: '튀르키예' },
	{ countryCode: 'TM', name: 'Turkmenistan', nameKo: '투르크메니스탄' },
	{
		countryCode: 'TC',
		name: 'Turks and Caicos Islands',
		nameKo: '터크스 케이커스 제도'
	},
	{ countryCode: 'TV', name: 'Tuvalu', nameKo: '투발루' },
	{ countryCode: 'UG', name: 'Uganda', nameKo: '우간다' },
	{ countryCode: 'UA', name: 'Ukraine', nameKo: '우크라이나' },
	{ countryCode: 'AE', name: 'United Arab Emirates', nameKo: '아랍에미리트' },
	{ countryCode: 'GB', name: 'United Kingdom', nameKo: '영국' },
	{ countryCode: 'US', name: 'USA', nameKo: '미국' },
	{
		countryCode: 'UM',
		name: 'United States Minor Outlying Islands',
		nameKo: '미국령 군소 제도'
	},
	{ countryCode: 'UY', name: 'Uruguay', nameKo: '우루과이' },
	{ countryCode: 'UZ', name: 'Uzbekistan', nameKo: '우즈베키스탄' },
	{ countryCode: 'VU', name: 'Vanuatu', nameKo: '바누아투' },
	{ countryCode: 'VE', name: 'Venezuela', nameKo: '베네수엘라' },
	{ countryCode: 'VN', name: 'Vietnam', nameKo: '베트남' },
	{
		countryCode: 'VG',
		name: 'Virgin Islands (British)',
		nameKo: '영국령 버진아일랜드'
	},
	{
		countryCode: 'VI',
		name: 'Virgin Islands (U.S.)',
		nameKo: '미국령 버진아일랜드'
	},
	{ countryCode: 'WF', name: 'Wallis and Futuna', nameKo: '월리스 푸투나' },
	{ countryCode: 'EH', name: 'Western Sahara', nameKo: '서사하라' },
	{ countryCode: 'YE', name: 'Yemen', nameKo: '예멘' },
	{ countryCode: 'ZM', name: 'Zambia', nameKo: '잠비아' },
	{ countryCode: 'ZW', name: 'Zimbabwe', nameKo: '짐바브웨' }
];

async function main() {
	console.log('전 세계 249개 국가/지역 핵심 데이터 시드 실행 시작...');

	// 트랜잭션을 사용하여 모든 작업을 하나의 단위로 처리합니다.
	// 많은 양의 데이터를 upsert할 때 성능 이점이 있습니다.
	const transactions = countriesData.map(country =>
		prisma.country.upsert({
			where: { countryCode: country.countryCode },
			update: {
				name: country.name,
				nameKo: country.nameKo
			},
			create: {
				countryCode: country.countryCode,
				name: country.name,
				nameKo: country.nameKo
				// embassyLocation 및 emergencyNumber는 null로 유지됩니다.
			}
		})
	);

	try {
		// 모든 upsert 작업을 병렬로 실행합니다.
		await prisma.$transaction(transactions);
		console.log(
			`총 ${countriesData.length}개의 국가/지역이 성공적으로 생성/업데이트되었습니다.`
		);
	} catch (e) {
		console.error('시드 스크립트 실행 중 오류 발생:', e);
		process.exit(1);
	} finally {
		console.log('시드 스크립트 실행 완료.');
	}
}

main()
	.catch(e => {
		// 여기서의 catch는 main 함수 자체의 오류(예: $transaction 이전)를 잡습니다.
		console.error('시드 스크립트 초기화 중 오류 발생:', e);
		process.exit(1);
	})
	.finally(async () => {
		// Prisma 클라이언트 연결을 반드시 종료합니다.
		await prisma.$disconnect();
	});
