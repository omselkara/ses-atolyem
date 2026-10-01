import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
export default defineConfig({
 testDir:'tests/e2e',fullyParallel:false,workers:1,timeout:45000,
 use:{baseURL:'http://localhost:4173',viewport:{width:1366,height:950},trace:'retain-on-failure',launchOptions:{args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',`--use-file-for-fake-audio-capture=${resolve('tests/fixtures/voice.wav')}`]}},
 webServer:{command:'npm run preview',url:'http://localhost:4173',reuseExistingServer:true,timeout:30000},
 reporter:'list'
});
