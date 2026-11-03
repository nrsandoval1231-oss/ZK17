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
];
