/** Shared lazy motion loader: the static story and controls do not wait for GSAP. */
let motion:Promise<{gsap:typeof import('gsap')['gsap'];ScrollTrigger:typeof import('gsap/ScrollTrigger')['ScrollTrigger']}>|undefined;
export function loadPlayoffMotion(){
 return motion??=Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([core,plugin])=>{
  core.gsap.registerPlugin(plugin.ScrollTrigger);return {gsap:core.gsap,ScrollTrigger:plugin.ScrollTrigger};
 });
}
