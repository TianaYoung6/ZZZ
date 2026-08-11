const { execSync } = require('node:child_process');

const SECRET_ID = process.env.TENCENT_COS_SECRET_ID;
const SECRET_KEY = process.env.TENCENT_COS_SECRET_KEY;
const BUCKET = process.env.TENCENT_COS_BUCKET;
const REGION = process.env.TENCENT_COS_REGION || 'ap-hongkong';

if (!SECRET_ID || !SECRET_KEY || !BUCKET) {
  console.error('Missing env: set TENCENT_COS_SECRET_ID, TENCENT_COS_SECRET_KEY, TENCENT_COS_BUCKET');
  console.error('Bucket name must include APPID, e.g. zzz-portfolio-1300123456');
  process.exit(1);
}

const COS = require('cos-nodejs-sdk-v5');
const cos = new COS({ SecretId: SECRET_ID, SecretKey: SECRET_KEY });

// git ls-files respects .gitignore → uploads only tracked files (no .git/.DS_Store/*.pen/.claude)
const files = execSync('git ls-files', { encoding: 'utf-8' }).split('\n').filter(Boolean);

console.log(`Uploading ${files.length} files to cos://${BUCKET} (${REGION})...`);

const tasks = files.map((Key) => ({ Bucket: BUCKET, Region: REGION, Key, FilePath: Key }));

cos.uploadFiles(
  {
    files: tasks,
    onProgress: (p) => process.stdout.write(`\r${(p.percent * 100).toFixed(1)}%`),
  },
  (err, data) => {
    if (err) {
      console.error('\nUpload failed:', err.message || err);
      process.exit(1);
    }
    const failed = (data && data.files ? data.files : []).filter((f) => f.error);
    if (failed.length) {
      console.error(`\n${failed.length} file(s) failed:`);
      failed.forEach((f) => console.error(`  ${f.Key}: ${f.error.message || f.error}`));
      process.exit(1);
    }
    console.log(`\nDone. ${files.length} files uploaded.`);
    console.log(`Site: https://${BUCKET}.cos-website.${REGION}.myqcloud.com`);
  }
);
