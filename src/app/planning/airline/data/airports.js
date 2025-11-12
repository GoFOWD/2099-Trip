/**
 * @typedef {object} Airport
 * @property {string} code - IATA 공항 코드
 * @property {string} name - 한글 공항 이름
 */

/**
 * @typedef {object} City
 * @property {string} city - 한글 도시 이름
 * @property {Airport[]} airports - 해당 도시의 공항 목록
 */

/**
 * @typedef {object} CountryData
 * @property {string} country - 한글 국가 이름
 * @property {City[]} cities - 해당 국가의 도시 목록
 */

/**
 * @type {CountryData[]}
 * 전 세계 주요 관광 국가, 도시, 공항 정보
 */
export const AIRPORTS = [
	// --- 기존 제공 데이터 ---
	{
		country: '대한민국',
		cities: [
			{
				city: '서울',
				airports: [
					{ code: 'ICN', name: '인천국제공항' },
					{ code: 'GMP', name: '김포국제공항' }
				]
			},
			{
				city: '부산',
				airports: [{ code: 'PUS', name: '김해국제공항' }]
			},
			{
				city: '제주',
				airports: [{ code: 'CJU', name: '제주국제공항' }]
			},
			{
				city: '대구',
				airports: [{ code: 'TAE', name: '대구국제공항' }]
			},
			{
				city: '청주',
				airports: [{ code: 'CJJ', name: '청주국제공항' }]
			}
			// {
			//   city: "양양",
			//   airports: [{ code: "YNY", name: "양양국제공항" }], // 국제선 운항이 매우 유동적
			// },
		]
	},
	{
		country: '일본',
		cities: [
			{
				city: '도쿄',
				airports: [
					{ code: 'NRT', name: '나리타국제공항' },
					{ code: 'HND', name: '하네다국제공항' }
				]
			},
			{
				city: '오사카',
				airports: [
					{ code: 'KIX', name: '간사이국제공항' },
					{ code: 'ITM', name: '이타미공항' } // 주로 국내선
				]
			},
			{
				city: '후쿠오카',
				airports: [{ code: 'FUK', name: '후쿠오카공항' }]
			},
			{
				city: '삿포로',
				airports: [{ code: 'CTS', name: '신치토세공항' }]
			},
			{
				city: '나고야',
				airports: [{ code: 'NGO', name: '주부센트레아국제공항' }]
			},
			{
				city: '오키나와',
				airports: [{ code: 'OKA', name: '나하공항' }]
			},
			{
				city: '고베',
				airports: [{ code: 'UKB', name: '고베공항' }] // 주로 국내선
			},
			{
				city: '히로시마',
				airports: [{ code: 'HIJ', name: '히로시마공항' }]
			}
			// {
			//   city: "센다이",
			//   airports: [{ code: "SDJ", name: "센다이공항" }],
			// },
			// {
			//   city: "가고시마",
			//   airports: [{ code: "KOJ", name: "가고시마공항" }],
			// },
		]
	},
	{
		country: '프랑스',
		cities: [
			{
				city: '파리',
				airports: [
					{ code: 'CDG', name: '샤를드골공항' },
					{ code: 'ORY', name: '오를리공항' }
					// { code: "BVA", name: "보베공항" }, // 저가항공사 공항, 파리 시내에서 매우 멈
				]
			},
			{
				city: '니스',
				airports: [{ code: 'NCE', name: '니스코트다쥐르공항' }]
			},
			{
				city: '마르세유',
				airports: [{ code: 'MRS', name: '마르세유프로방스공항' }]
			},
			{
				city: '리옹',
				airports: [{ code: 'LYS', name: '생텍쥐페리국제공항' }]
			},
			{
				city: '보르도',
				airports: [{ code: 'BOD', name: '보르도메리냑공항' }]
			},
			{
				city: '툴루즈',
				airports: [{ code: 'TLS', name: '툴루즈블라냑공항' }]
			},
			{
				city: '스트라스부르',
				airports: [{ code: 'SXB', name: '스트라스부르공항' }]
			}
			// {
			//   city: "낭트",
			//   airports: [{ code: "NTE", name: "낭트아틀랑티크공항" }],
			// },
		]
	},
	{
		country: '미국',
		cities: [
			{
				city: '뉴욕',
				airports: [
					{ code: 'JFK', name: '존F케네디국제공항' },
					{ code: 'EWR', name: '뉴어크리버티국제공항' }, // 뉴저지에 있지만 뉴욕권
					{ code: 'LGA', name: '라과디아공항' } // 주로 국내선
				]
			},
			{
				city: '로스앤젤레스',
				airports: [{ code: 'LAX', name: '로스앤젤레스국제공항' }]
			},
			{
				city: '시카고',
				airports: [
					{ code: 'ORD', name: '오헤어국제공항' },
					{ code: 'MDW', name: '미드웨이국제공항' }
				]
			},
			{
				city: '샌프란시스코',
				airports: [{ code: 'SFO', name: '샌프란시스코국제공항' }]
			},
			{
				city: '라스베이거스',
				airports: [{ code: 'LAS', name: '매캐런국제공항' }] // (공식 명칭: 해리 리드 국제공항)
			},
			{
				city: '마이애미',
				airports: [{ code: 'MIA', name: '마이애미국제공항' }]
			},
			{
				city: '워싱턴 D.C.',
				airports: [
					{ code: 'IAD', name: '덜레스국제공항' },
					{ code: 'DCA', name: '로널드레이건국립공항' } // 국내선 위주
				]
			},
			{
				city: '올랜도',
				airports: [{ code: 'MCO', name: '올랜도국제공항' }]
			},
			{
				city: '시애틀',
				airports: [{ code: 'SEA', name: '시애틀타코마국제공항' }]
			},
			{
				city: '호놀룰루',
				airports: [{ code: 'HNL', name: '대니얼K이노우에국제공항' }] // 하와이
			}
		]
	},
	{
		country: '중국',
		cities: [
			{
				city: '베이징',
				airports: [
					{ code: 'PEK', name: '베이징수도국제공항' },
					{ code: 'PKX', name: '베이징다싱국제공항' }
				]
			},
			{
				city: '상하이',
				airports: [
					{ code: 'PVG', name: '푸동국제공항' },
					{ code: 'SHA', name: '홍차오국제공항' }
				]
			},
			{
				city: '광저우',
				airports: [{ code: 'CAN', name: '광저우바이윈국제공항' }]
			},
			{
				city: '선전',
				airports: [{ code: 'SZX', name: '선전바오안국제공항' }]
			},
			{
				city: '청두',
				airports: [
					{ code: 'TFU', name: '청두톈푸국제공항' },
					{ code: 'CTU', name: '청두솽류국제공항' }
				]
			},
			{
				city: '시안',
				airports: [{ code: 'XIY', name: '시안셴양국제공항' }]
			},
			{
				city: '항저우',
				airports: [{ code: 'HGH', name: '항저우샤오산국제공항' }]
			},
			{
				city: '쿤밍',
				airports: [{ code: 'KMG', name: '쿤밍창수이국제공항' }]
			}
			// {
			//   city: "칭다오",
			//   airports: [{ code: "TAO", name: "칭다오자오둥국제공항" }],
			// },
			// {
			//   city: "장자제",
			//   airports: [{ code: "DYG", name: "장자제허화국제공항" }],
			// },
		]
	},

	// --- 아시아 국가 추가 ---
	{
		country: '베트남',
		cities: [
			{
				city: '하노이',
				airports: [{ code: 'HAN', name: '노이바이국제공항' }]
			},
			{
				city: '호치민',
				airports: [{ code: 'SGN', name: '떤선녓국제공항' }]
			},
			{
				city: '다낭',
				airports: [{ code: 'DAD', name: '다낭국제공항' }]
			},
			{
				city: '나트랑',
				airports: [{ code: 'CXR', name: '깜란국제공항' }]
			},
			{
				city: '푸꾸옥',
				airports: [{ code: 'PQC', name: '푸꾸옥국제공항' }]
			},
			{
				city: '하이퐁',
				airports: [{ code: 'HPH', name: '깟비국제공항' }] // 하롱베이 인접
			}
			// {
			//   city: "달랏",
			//   airports: [{ code: "DLI", name: "리엔크엉공항" }],
			// },
		]
	},
	{
		country: '태국',
		cities: [
			{
				city: '방콕',
				airports: [
					{ code: 'BKK', name: '수완나품국제공항' },
					{ code: 'DMK', name: '돈므앙국제공항' } // 저가항공사
				]
			},
			{
				city: '푸켓',
				airports: [{ code: 'HKT', name: '푸켓국제공항' }]
			},
			{
				city: '치앙마이',
				airports: [{ code: 'CNX', name: '치앙마이국제공항' }]
			},
			{
				city: '코사무이',
				airports: [{ code: 'USM', name: '사무이국제공항' }]
			},
			{
				city: '끄라비',
				airports: [{ code: 'KBV', name: '끄라비국제공항' }]
			},
			{
				city: '파타야',
				airports: [{ code: 'UTP', name: '우타파오국제공항' }]
			}
			// {
			//   city: "치앙라이",
			//   airports: [{ code: "CEI", name: "치앙라이국제공항" }],
			// },
		]
	},
	{
		country: '대만',
		cities: [
			{
				city: '타이베이',
				airports: [
					{ code: 'TPE', name: '타오위안국제공항' },
					{ code: 'TSA', name: '송산공항' } // 김포공항과 유사
				]
			},
			{
				city: '가오슝',
				airports: [{ code: 'KHH', name: '가오슝국제공항' }]
			},
			{
				city: '타이중',
				airports: [{ code: 'RMQ', name: '타이중국제공항' }]
			}
		]
	},
	{
		country: '필리핀',
		cities: [
			{
				city: '마닐라',
				airports: [{ code: 'MNL', name: '니노이아키노국제공항' }]
			},
			{
				city: '세부',
				airports: [{ code: 'CEB', name: '막탄세부국제공항' }]
			},
			{
				city: '보라카이',
				airports: [
					{ code: 'MPH', name: '까띠끌란공항' }, // 더 가까움
					{ code: 'KLO', name: '칼리보국제공항' }
				]
			},
			{
				city: '클락',
				airports: [{ code: 'CRK', name: '클락국제공항' }]
			}
		]
	},
	{
		country: '싱가포르',
		cities: [
			{
				city: '싱가포르',
				airports: [{ code: 'SIN', name: '창이국제공항' }]
			}
		]
	},
	{
		country: '말레이시아',
		cities: [
			{
				city: '쿠알라룸푸르',
				airports: [
					{ code: 'KUL', name: '쿠알라룸푸르국제공항' },
					{ code: 'SZB', name: '술탄압둘아지즈샤공항' } // (수방공항)
				]
			},
			{
				city: '코타키나발루',
				airports: [{ code: 'BKI', name: '코타키나발루국제공항' }]
			},
			{
				city: '페낭',
				airports: [{ code: 'PEN', name: '페낭국제공항' }]
			}
		]
	},
	{
		country: '인도네시아',
		cities: [
			{
				city: '자카르타',
				airports: [{ code: 'CGK', name: '수카르노하타국제공항' }]
			},
			{
				city: '발리',
				airports: [{ code: 'DPS', name: '응우라라이국제공항' }] // (덴파사르)
			}
			// {
			//   city: "족자카르타",
			//   airports: [{ code: "YIA", name: "족자카르타국제공항" }],
			// },
		]
	},
	{
		country: '아랍에미리트',
		cities: [
			{
				city: '두바이',
				airports: [
					{ code: 'DXB', name: '두바이국제공항' },
					{ code: 'DWC', name: '알막툼국제공항' }
				]
			},
			{
				city: '아부다비',
				airports: [{ code: 'AUH', name: '아부다비국제공항' }]
			}
		]
	},

	// --- 유럽 국가 추가 ---
	{
		country: '영국',
		cities: [
			{
				city: '런던',
				airports: [
					{ code: 'LHR', name: '히드로공항' },
					{ code: 'LGW', name: '개트윅공항' },
					{ code: 'STN', name: '스탠스테드공항' },
					{ code: 'LTN', name: '루턴공항' }
					// { code: "LCY", name: "런던시티공항" },
				]
			},
			{
				city: '에든버러',
				airports: [{ code: 'EDI', name: '에든버러공항' }]
			},
			{
				city: '맨체스터',
				airports: [{ code: 'MAN', name: '맨체스터공항' }]
			},
			{
				city: '리버풀',
				airports: [{ code: 'LPL', name: '리버풀존레논공항' }]
			},
			{
				city: '글래스고',
				airports: [{ code: 'GLA', name: '글래스고국제공항' }]
			},
			{
				city: '벨파스트',
				airports: [{ code: 'BFS', name: '벨파스트국제공항' }]
			}
			// {
			//   city: "브리스톨",
			//   airports: [{ code: "BRS", name: "브리스톨공항" }], // (바스 인근)
			// },
		]
	},
	{
		country: '독일',
		cities: [
			{
				city: '베를린',
				airports: [{ code: 'BER', name: '베를린브란덴부르크공항' }]
			},
			{
				city: '뮌헨',
				airports: [{ code: 'MUC', name: '뮌헨국제공항' }]
			},
			{
				city: '프랑크푸르트',
				airports: [
					{ code: 'FRA', name: '프랑크푸르트암마인공항' },
					{ code: 'HHN', name: '프랑크푸르트한공항' } // 저가항공, 매우 멈
				]
			},
			{
				city: '함부르크',
				airports: [{ code: 'HAM', name: '함부르크공항' }]
			},
			{
				city: '쾰른',
				airports: [{ code: 'CGN', name: '쾰른본공항' }]
			},
			{
				city: '뒤셀도르프',
				airports: [{ code: 'DUS', name: '뒤셀도르프공항' }]
			}
			// {
			//   city: "슈투트가르트",
			//   airports: [{ code: "STR", name: "슈투트가르트공항" }],
			// },
		]
	},
	{
		country: '이탈리아',
		cities: [
			{
				city: '로마',
				airports: [
					{ code: 'FCO', name: '피우미치노공항' }, // (레오나르도 다 빈치 공항)
					{ code: 'CIA', name: '치암피노공항' } // 저가항공
				]
			},
			{
				city: '밀라노',
				airports: [
					{ code: 'MXP', name: '말펜사공항' },
					{ code: 'LIN', name: '리나테공항' }
					// { code: "BGY", name: "오리오알세리오공항" }, // (베르가모) 저가항공
				]
			},
			{
				city: '베네치아',
				airports: [{ code: 'VCE', name: '마르코폴로공항' }]
			},
			{
				city: '피렌체',
				airports: [{ code: 'FLR', name: '피렌체공항' }] // (페레톨라)
			},
			{
				city: '나폴리',
				airports: [{ code: 'NAP', name: '나폴리국제공항' }]
			},
			{
				city: '피사',
				airports: [{ code: 'PSA', name: '피사갈릴레오갈릴레이공항' }]
			},
			{
				city: '볼로냐',
				airports: [{ code: 'BLQ', name: '볼로냐굴리엘모마르코니공항' }]
			},
			{
				city: '시칠리아 (팔레르모)',
				airports: [{ code: 'PMO', name: '팔코네보르셀리노공항' }]
			},
			{
				city: '시칠리아 (카타니아)',
				airports: [{ code: 'CTA', name: '카타니아폰타나로사공항' }]
			}
		]
	},
	{
		country: '스페인',
		cities: [
			{
				city: '마드리드',
				airports: [
					{ code: 'MAD', name: '아돌포수아레스마드리드바라하스공항' }
				]
			},
			{
				city: '바르셀로나',
				airports: [
					{
						code: 'BCN',
						name: '요제프타라데야스바르셀로나엘프라트공항'
					}
				]
			},
			{
				city: '세비야',
				airports: [{ code: 'SVQ', name: '세비야공항' }]
			},
			{
				city: '말라가',
				airports: [{ code: 'AGP', name: '말라가코스타델솔공항' }]
			},
			{
				city: '그라나다',
				airports: [
					{ code: 'GRX', name: '페데리코가르시아로르카그라나다공항' }
				]
			},
			{
				city: '발렌시아',
				airports: [{ code: 'VLC', name: '발렌시아공항' }]
			},
			{
				city: '팔마데마요르카',
				airports: [{ code: 'PMI', name: '팔마데마요르카공항' }]
			},
			{
				city: '이비자',
				airports: [{ code: 'IBZ', name: '이비자공항' }]
			},
			{
				city: '테네리페',
				airports: [
					{ code: 'TFS', name: '테네리페수르공항' }, // (남부)
					{ code: 'TFN', name: '테네리페노르테공항' } // (북부)
				]
			},
			{
				city: '빌바오',
				airports: [{ code: 'BIO', name: '빌바오공항' }]
			}
		]
	},
	{
		country: '튀르키예',
		cities: [
			{
				city: '이스탄불',
				airports: [
					{ code: 'IST', name: '이스탄불공항' },
					{ code: 'SAW', name: '사비하괵첸국제공항' }
				]
			},
			{
				city: '안탈리아',
				airports: [{ code: 'AYT', name: '안탈리아공항' }]
			},
			{
				city: '카파도키아',
				airports: [
					{ code: 'ASR', name: '카이세리에르키레트공항' },
					{ code: 'NAV', name: '네브셰히르카파도키아공항' }
				]
			},
			{
				city: '이즈미르',
				airports: [{ code: 'ADB', name: '이즈미르아드난멘데레스공항' }]
			}
			// {
			//   city: "앙카라",
			//   airports: [{ code: "ESB", name: "에센보아국제공항" }],
			// },
		]
	},
	{
		country: '스위스',
		cities: [
			{
				city: '취리히',
				airports: [{ code: 'ZRH', name: '취리히공항' }]
			},
			{
				city: '제네바',
				airports: [{ code: 'GVA', name: '제네바국제공항' }]
			}
			// {
			//   city: "바젤",
			//   airports: [{ code: "BSL", name: "유로에어포트바젤뮐루즈프라이부르크공항" }], // (프랑스, 독일에 걸쳐있음)
			// },
			// {
			//   city: "인터라켄",
			//   airports: [], // 공항 없음, 취리히/제네바에서 기차 이동
			// },
		]
	},
	{
		country: '네덜란드',
		cities: [
			{
				city: '암스테르담',
				airports: [{ code: 'AMS', name: '스키폴국제공항' }]
			}
			// {
			//   city: "로테르담",
			//   airports: [{ code: "RTM", name: "로테르담헤이그공항" }],
			// },
		]
	},
	{
		country: '체코',
		cities: [
			{
				city: '프라하',
				airports: [{ code: 'PRG', name: '바츨라프하벨국제공항' }]
			}
		]
	},
	{
		country: '오스트리아',
		cities: [
			{
				city: '비엔나',
				airports: [{ code: 'VIE', name: '비엔나국제공항' }]
			},
			{
				city: '잘츠부르크',
				airports: [{ code: 'SZG', name: '잘츠부르크W.A.모차르트공항' }]
			}
		]
	},
	{
		country: '그리스',
		cities: [
			{
				city: '아테네',
				airports: [{ code: 'ATH', name: '아테네국제공항' }]
			},
			{
				city: '산토리니',
				airports: [{ code: 'JTR', name: '산토리니국제공항' }]
			},
			{
				city: '미코노스',
				airports: [{ code: 'JMK', name: '미코노스공항' }]
			}
		]
	},
	{
		country: '포르투갈',
		cities: [
			{
				city: '리스본',
				airports: [{ code: 'LIS', name: '움베르투델가두공항' }] // (리스본 공항)
			},
			{
				city: '포르투',
				airports: [
					{ code: 'OPO', name: '프란시스쿠드사카르네이루공항' }
				] // (포르투 공항)
			}
		]
	},

	// --- 북미/남미 국가 추가 ---
	{
		country: '캐나다',
		cities: [
			{
				city: '토론토',
				airports: [
					{ code: 'YYZ', name: '토론토피어슨국제공항' },
					{ code: 'YTZ', name: '빌리비숍토론토시티공항' }
				]
			},
			{
				city: '밴쿠버',
				airports: [{ code: 'YVR', name: '밴쿠버국제공항' }]
			},
			{
				city: '몬트리올',
				airports: [
					{
						code: 'YUL',
						name: '몬트리올피에르엘리오트트뤼도국제공항'
					}
				]
			},
			{
				city: '캘거리',
				airports: [{ code: 'YYC', name: '캘거리국제공항' }] // (밴프 인근)
			},
			{
				city: '퀘벡시티',
				airports: [{ code: 'YQB', name: '퀘벡장르사주국제공항' }]
			}
			// {
			//   city: "오타와",
			//   airports: [{ code: "YOW", name: "오타와맥도널드카르티에국제공항" }],
			// },
		]
	},
	{
		country: '멕시코',
		cities: [
			{
				city: '멕시코시티',
				airports: [{ code: 'MEX', name: '베니토후아레스국제공항' }]
			},
			{
				city: '칸쿤',
				airports: [{ code: 'CUN', name: '칸쿤국제공항' }]
			}
		]
	},
	{
		country: '브라질',
		cities: [
			{
				city: '리우데자네이루',
				airports: [
					{ code: 'GIG', name: '갈레앙국제공항' },
					{ code: 'SDU', name: '산투스두몽공항' } // 국내선
				]
			},
			{
				city: '상파울루',
				airports: [
					{ code: 'GRU', name: '과룰류스국제공항' },
					{ code: 'CGH', name: '콩고냐스공항' } // 국내선
				]
			},
			{
				city: '이과수',
				airports: [{ code: 'IGU', name: '포스두이과수국제공항' }]
			}
		]
	},
	{
		country: '아르헨티나',
		cities: [
			{
				city: '부에노스아이레스',
				airports: [
					{ code: 'EZE', name: '미니스토로피스타리니국제공항' }, // (에세이사)
					{ code: 'AEP', name: '호르헤뉴베리공항' } // 국내선/남미
				]
			},
			{
				city: '이과수',
				airports: [{ code: 'IGR', name: '카타라타스델이과수국제공항' }]
			}
			// {
			//   city: "엘칼라파테",
			//   airports: [{ code: "FTE", name: "엘칼라파테국제공항" }], // 파타고니아
			// },
		]
	},
	{
		country: '페루',
		cities: [
			{
				city: '리마',
				airports: [{ code: 'LIM', name: '호르헤차베스국제공항' }]
			},
			{
				city: '쿠스코',
				airports: [
					{ code: 'CUZ', name: '알레한드로벨라스코아스테테국제공항' }
				]
			}
		]
	},

	// --- 오세아니아 국가 추가 ---
	{
		country: '호주',
		cities: [
			{
				city: '시드니',
				airports: [{ code: 'SYD', name: '시드니킹스포드스미스공항' }]
			},
			{
				city: '멜버른',
				airports: [{ code: 'MEL', name: '멜버른툴라마린공항' }]
			},
			{
				city: '브리즈번',
				airports: [{ code: 'BNE', name: '브리즈번공항' }]
			},
			{
				city: '케언스',
				airports: [{ code: 'CNS', name: '케언스공항' }]
			},
			{
				city: '골드코스트',
				airports: [{ code: 'OOL', name: '골드코스트공항' }]
			},
			{
				city: '퍼스',
				airports: [{ code: 'PER', name: '퍼스공항' }]
			}
		]
	},
	{
		country: '뉴질랜드',
		cities: [
			{
				city: '오클랜드',
				airports: [{ code: 'AKL', name: '오클랜드국제공항' }]
			},
			{
				city: '퀸스타운',
				airports: [{ code: 'ZQN', name: '퀸스타운공항' }]
			},
			{
				city: '크라이스트처치',
				airports: [{ code: 'CHC', name: '크라이스트처치국제공항' }]
			}
		]
	},

	// --- 아프리카 국가 추가 ---
	{
		country: '이집트',
		cities: [
			{
				city: '카이로',
				airports: [{ code: 'CAI', name: '카이로국제공항' }]
			},
			{
				city: '룩소르',
				airports: [{ code: 'LXR', name: '룩소르국제공항' }]
			}
			// {
			//   city: "후루가다",
			//   airports: [{ code: "HRG", name: "후루가다국제공항" }],
			// },
		]
	},
	{
		country: '모로코',
		cities: [
			{
				city: '마라케시',
				airports: [{ code: 'RAK', name: '마라케시메나라공항' }]
			},
			{
				city: '카사블랑카',
				airports: [{ code: 'CMN', name: '무함마드5세국제공항' }]
			}
			// {
			//   city: "페스",
			//   airports: [{ code: "FEZ", name: "페스사이스공항" }],
			// },
		]
	},
	{
		country: '남아프리카공화국',
		cities: [
			{
				city: '요하네스버그',
				airports: [{ code: 'JNB', name: 'O.R.탐보국제공항' }]
			},
			{
				city: '케이프타운',
				airports: [{ code: 'CPT', name: '케이프타운국제공항' }]
			}
		]
	}
];
