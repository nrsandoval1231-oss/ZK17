import type { PreviewPhoto } from './site';

/** Owner-uploaded Zpics.zip photos, available for review only until rights approval.
 * SVG presentations preserve the photograph and use coordinate clipping; regions
 * hidden by source UI are transparent rather than synthesized. */
const legacyArrivalPhotos: PreviewPhoto[] = [
  { kind:'preview', id:'campaign-stadium', src:'/media/arrival-campaign/stadium-640.svg', width:706, height:650, alt:'Anna football night-game stadium and field.', focal:'50% 100%', label:'PREVIEW CROP · ORIGINAL PENDING' },
  { kind:'preview', id:'campaign-front', src:'/media/arrival-campaign/front-640.svg', width:330, height:945, alt:'Zephyr Kreye walking in his black number 17 Anna Coyotes uniform and helmet.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
  { kind:'preview', id:'campaign-rear', src:'/media/arrival-campaign/rear-640.svg', width:400, height:730, alt:'Rear view of Zephyr Kreye wearing his white number 17 Anna uniform and purple helmet.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
  { kind:'preview', id:'campaign-back', src:'/media/arrival-campaign/back-640.svg', width:270, height:875, alt:'Zephyr Kreye standing on the sideline in his black number 17 uniform, viewed from behind.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
  { kind:'preview', id:'campaign-closeup', src:'/media/arrival-campaign/closeup-640.svg', width:180, height:220, alt:'Close-up of Zephyr Kreye in his football helmet.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
  { kind:'preview', id:'campaign-profile', src:'/media/arrival-campaign/profile-640.svg', width:260, height:415, alt:'Zephyr Kreye in profile wearing his purple helmet and black Anna uniform.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
];

/** Source-preserving director's-cut crops, review only until rights approval. */
export const arrivalDirectorsPhotos: PreviewPhoto[] = [
  { kind: 'preview', id: 'directors-action', src: '/media/arrival-directors-cut/directors-action-960.webp', width: 400, height: 450, alt: 'Zephyr Kreye carrying a football on the field.', focal: '50% 45%', label: 'PREVIEW CROP · ORIGINAL PENDING' },
  { kind: 'preview', id: 'directors-standing', src: '/media/arrival-directors-cut/directors-standing-960.webp', width: 601, height: 780, alt: 'Zephyr Kreye standing in his black number 17 uniform.', focal: '50% 35%', label: 'PREVIEW CROP · ORIGINAL PENDING' },
  { kind: 'preview', id: 'directors-rear', src: '/media/arrival-directors-cut/directors-rear-960.webp', width: 650, height: 1050, alt: 'Zephyr Kreye seen from behind in his number 17 uniform.', focal: '50% 40%', label: 'PREVIEW CROP · ORIGINAL PENDING' },
  { kind: 'preview', id: 'directors-white', src: '/media/arrival-directors-cut/directors-white-960.webp', width: 470, height: 805, alt: 'Zephyr Kreye seen from behind in his white number 17 uniform.', focal: '50% 40%', label: 'PREVIEW CROP · ORIGINAL PENDING' },
];

export const arrivalCampaignPhotos: PreviewPhoto[] = [...arrivalDirectorsPhotos, ...legacyArrivalPhotos,
  { kind: 'preview', id: 'owner-color-action', src: '/media/zephyr-color-action.webp', width: 540, height: 474, alt: 'Zephyr Kreye carrying a football during a game.', focal: '50% 45%', label: 'OWNER-SUPPLIED PHOTO' },
  { kind: 'preview', id: 'hero-montage-1', src: '/media/arrival-montage/2026-08-30_instagram_DcrQ0a7GzXN-4.jpg', width: 1365, height: 1820, alt: 'Zephyr Kreye in a white number 17 uniform, seen from behind.', focal: '50% 45%', label: 'OWNER-SUPPLIED PHOTO' },
  { kind: 'preview', id: 'hero-montage-2', src: '/media/arrival-montage/2026-08-30_instagram_DcrQ0a7GzXN-5.jpg', width: 1365, height: 1820, alt: 'Zephyr Kreye celebrating with teammates after a game.', focal: '50% 48%', label: 'OWNER-SUPPLIED PHOTO' },
  { kind: 'preview', id: 'hero-montage-3', src: '/media/arrival-montage/2026-09-13_instagram_DdPP_jJm_6P-2.jpg', width: 1365, height: 1820, alt: 'Zephyr Kreye running with the football during a game.', focal: '50% 50%', label: 'OWNER-SUPPLIED PHOTO' },
  { kind: 'preview', id: 'hero-montage-4', src: '/media/arrival-montage/2026-09-28_instagram_Dd2BzvLm11i-1.jpg', width: 1365, height: 1820, alt: 'Zephyr Kreye preparing to pass in a white uniform.', focal: '50% 45%', label: 'OWNER-SUPPLIED PHOTO' },
  { kind: 'preview', id: 'hero-montage-5', src: '/media/arrival-montage/2026-09-28_instagram_Dd2BzvLm11i-3.jpg', width: 1365, height: 1820, alt: 'Anna Coyotes players lined up during a football play.', focal: '50% 72%', label: 'OWNER-SUPPLIED PHOTO' },
  { kind: 'preview', id: 'hero-montage-6', src: '/media/arrival-montage/2026-10-06_instagram_DeIdiOjDl_s-4.jpg', width: 1365, height: 1820, alt: 'Zephyr Kreye in his purple number 17 uniform under the stadium lights.', focal: '50% 38%', label: 'OWNER-SUPPLIED PHOTO' },
  { kind: 'preview', id: 'hero-montage-7', src: '/media/arrival-montage/2026-10-11_instagram_DeXXLOBG2zQ-1.jpg', width: 1365, height: 1820, alt: 'Zephyr Kreye in a white uniform on the field.', focal: '50% 48%', label: 'OWNER-SUPPLIED PHOTO' },
  { kind: 'preview', id: 'hero-montage-8', src: '/media/arrival-montage/2026-10-11_instagram_DeXXLOBG2zQ-3.jpg', width: 1365, height: 1820, alt: 'Zephyr Kreye preparing to throw during a game.', focal: '50% 55%', label: 'OWNER-SUPPLIED PHOTO' },
  { kind: 'preview', id: 'hero-montage-9', src: '/media/arrival-montage/2026-10-26_instagram_De9-EMzm1tD-2.jpg', width: 1365, height: 1820, alt: 'Zephyr Kreye celebrating with a teammate.', focal: '50% 45%', label: 'OWNER-SUPPLIED PHOTO' },
];
