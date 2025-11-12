/**
 * SNS 공유 유틸 함수
 */

/**
 * Web Share API를 사용한 공유 (모바일 네이티브 공유)
 * @param {Object} shareData - 공유할 데이터
 * @param {string} shareData.title - 공유 제목
 * @param {string} shareData.text - 공유 텍스트
 * @param {string} shareData.url - 공유할 URL
 * @returns {Promise<boolean>} 공유 성공 여부
 */
export async function shareViaWebShare(shareData) {
	if (!navigator.share) {
		return false; // Web Share API를 지원하지 않음
	}

	try {
		await navigator.share({
			title: shareData.title,
			text: shareData.text,
			url: shareData.url
		});
		return true;
	} catch (error) {
		// 사용자가 공유를 취소한 경우
		if (error.name !== 'AbortError') {
			console.error('공유 실패:', error);
		}
		return false;
	}
}

/**
 * 카카오톡 공유
 * @param {Object} shareData - 공유할 데이터
 * @param {string} shareData.title - 공유 제목
 * @param {string} shareData.description - 공유 설명
 * @param {string} shareData.imageUrl - 공유 이미지 URL
 * @param {string} shareData.url - 공유할 URL
 */
export function shareToKakaoTalk(shareData) {
	const { title, description, imageUrl, url } = shareData;
	
	// 카카오톡 링크 공유 URL 생성
	const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + '\n' + description)}`;
	
	// 모바일에서는 카카오톡 앱으로 열기 시도
	if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		// 카카오톡 앱 스킴 시도
		const kakaoScheme = `kakaotalk://sharer?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
		window.location.href = kakaoScheme;
		
		// 앱이 없으면 웹으로 폴백
		setTimeout(() => {
			window.open(kakaoUrl, '_blank');
		}, 500);
	} else {
		// 데스크톱에서는 웹으로 공유
		window.open(kakaoUrl, '_blank', 'width=600,height=400');
	}
}

/**
 * 페이스북 공유
 * @param {string} url - 공유할 URL
 */
export function shareToFacebook(url) {
	const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
	window.open(facebookUrl, '_blank', 'width=600,height=400');
}

/**
 * 트위터 공유
 * @param {Object} shareData - 공유할 데이터
 * @param {string} shareData.text - 공유 텍스트
 * @param {string} shareData.url - 공유할 URL
 */
export function shareToTwitter(shareData) {
	const { text, url } = shareData;
	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
	window.open(twitterUrl, '_blank', 'width=600,height=400');
}

/**
 * 링크 복사
 * @param {string} url - 복사할 URL
 * @returns {Promise<boolean>} 복사 성공 여부
 */
export async function copyLink(url) {
	try {
		await navigator.clipboard.writeText(url);
		return true;
	} catch (error) {
		console.error('링크 복사 실패:', error);
		// 폴백: 텍스트 영역을 사용한 복사
		const textArea = document.createElement('textarea');
		textArea.value = url;
		textArea.style.position = 'fixed';
		textArea.style.opacity = '0';
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand('copy');
			document.body.removeChild(textArea);
			return true;
		} catch (err) {
			document.body.removeChild(textArea);
			return false;
		}
	}
}

/**
 * 통합 SNS 공유 함수
 * @param {Object} shareData - 공유할 데이터
 * @param {string} shareData.title - 공유 제목
 * @param {string} shareData.text - 공유 텍스트/설명
 * @param {string} shareData.url - 공유할 URL
 * @param {string} shareData.imageUrl - 공유 이미지 URL (선택)
 * @param {string} platform - 공유 플랫폼 ('web', 'kakao', 'facebook', 'twitter', 'copy')
 */
export async function shareToSNS(shareData, platform = 'web') {
	const currentUrl = typeof window !== 'undefined' ? window.location.href : shareData.url;
	const url = shareData.url || currentUrl;

	switch (platform) {
		case 'web':
			// Web Share API 시도
			const shared = await shareViaWebShare({
				title: shareData.title || '여행 기록',
				text: shareData.text || '',
				url: url
			});
			
			// Web Share API를 지원하지 않으면 공유 옵션 모달 표시
			if (!shared) {
				return { success: false, needModal: true };
			}
			return { success: true };
			
		case 'kakao':
			shareToKakaoTalk({
				title: shareData.title || '여행 기록',
				description: shareData.text || '',
				imageUrl: shareData.imageUrl,
				url: url
			});
			return { success: true };
			
		case 'facebook':
			shareToFacebook(url);
			return { success: true };
			
		case 'twitter':
			shareToTwitter({
				text: shareData.text || shareData.title || '여행 기록',
				url: url
			});
			return { success: true };
			
		case 'copy':
			const copied = await copyLink(url);
			return { success: copied };
			
		default:
			return { success: false };
	}
}

