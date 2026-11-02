import type { PreviewPhoto } from './site';

/** Owner-uploaded Zpics.zip photos, available for review only until rights approval.
 * SVG presentations preserve the photograph and use coordinate clipping; regions
 * hidden by source UI are transparent rather than synthesized. */
export const arrivalCampaignPhotos: PreviewPhoto[] = [
  { kind:'preview', id:'campaign-front', src:'/media/arrival-campaign/front-640.svg', width:330, height:945, alt:'Zephyr Kreye walking in his black number 17 Anna Coyotes uniform and helmet.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
  { kind:'preview', id:'campaign-rear', src:'/media/arrival-campaign/rear-640.svg', width:400, height:730, alt:'Rear view of Zephyr Kreye wearing his white number 17 Anna uniform and purple helmet.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
  { kind:'preview', id:'campaign-back', src:'/media/arrival-campaign/back-640.svg', width:270, height:875, alt:'Zephyr Kreye standing on the sideline in his black number 17 uniform, viewed from behind.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
  { kind:'preview', id:'campaign-closeup', src:'/media/arrival-campaign/closeup-640.svg', width:180, height:220, alt:'Close-up of Zephyr Kreye in his football helmet.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
  { kind:'preview', id:'campaign-profile', src:'/media/arrival-campaign/profile-640.svg', width:260, height:415, alt:'Zephyr Kreye in profile wearing his purple helmet and black Anna uniform.', focal:'50% 50%', label:'PREVIEW CROP · ORIGINAL PENDING' },
];
