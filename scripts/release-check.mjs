const previewMediaMode = process.env.PREVIEW_MEDIA_MODE !== 'false';
const publicRelease = process.env.PUBLIC_RELEASE === 'true';
if (publicRelease && previewMediaMode) {
  console.error('Public release blocked: set PREVIEW_MEDIA_MODE=false and replace preview-only assets with rights-approved media before release.');
  process.exit(1);
}
console.log(publicRelease ? 'Release media gate passed.' : `Preview media mode ${previewMediaMode ? 'enabled' : 'disabled'}.`);
