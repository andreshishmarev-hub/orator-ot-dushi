import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../style.css',import.meta.url),'utf8');

test('story awards are vertical 1080×1920',()=>{
  assert.match(app,/canvas\.width=1080;canvas\.height=1920/);
  assert.match(app,/story-fullscreen/);
  assert.match(css,/#diploma-preview\.story-fullscreen/);
});
test('participant profile can be edited and gender is saved locally',()=>{
  assert.match(app,/profile-save/);
  assert.match(app,/orator-name/);
  assert.match(app,/orator-gender/);
  assert.match(app,/Я решилась\. Я выступила\. Я могу!/);
  assert.match(app,/Я решился\. Я выступил\. Я могу!/);
});
test('story sharing and fallback download are present',()=>{
  assert.match(app,/navigator\.share/);
  assert.match(app,/navigator\.canShare/);
  assert.match(app,/Сохранить для сторис/);
});
test('24-hour local audio storage is present',()=>{
  assert.match(app,/const AUDIO_TTL=24\*60\*60\*1000/);
  assert.match(app,/indexedDB/);
  assert.match(app,/Date\.now\(\)-item\.savedAt>=AUDIO_TTL/);
});
test('HTML loads versioned app and styles',()=>{
  assert.match(html,/app\.js\?v=/);
  assert.match(html,/style\.css\?v=/);
});

test('installable app assets and daily motivation are present',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../manifest.webmanifest',import.meta.url),'utf8'));
 const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
 assert.equal(manifest.display,'standalone');
 assert.match(html,/rel="manifest"/);
 assert.match(html,/serviceWorker\.register/);
 assert.match(sw,/orator-static-v1/);
 assert.match(app,/function trainingStreak\(/);
 assert.match(app,/function inviteFriend\(/);
});
