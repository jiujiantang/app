#!/usr/bin/env node
/**
 *  用法：
 *    node index.js generate button
 */

import fs from 'fs/promises';

const API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_BASE = process.env.OPENAI_BASE || 'https://api.openai.com/v1';
const API2D_KEY = process.env.API2D_KEY || '';
const API2D_BASE = process.env.API2D_BASE || 'https://openai.api2d.net/v1';

if (!API_KEY && !API2D_KEY) {
  console.error('❌ 请设置 OPENAI_API_KEY 或 API2D_KEY 环境变量');
  process.exit(1);
}

const model = 'gpt-4o-mini'; // 可换成 gpt-4o / gpt-4.1-mini

async function loadPrompt(name) {
  return fs.readFile(`prompts/${name}.md`, 'utf8');
}

function buildMessage(promptTemplate) {
  return promptTemplate;
}

async function requestAPI(base, key, promptText) {
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: '你是一个前端工程师，输出 Vue/React 组件、stories 和测试文件代码。' },
        { role: 'user', content: promptText }
      ],
      temperature: 0,
      max_tokens: 3000
    })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${base} 返回错误: ${res.status} ${txt}`);
  }

  const j = await res.json();
  return j.choices?.[0]?.message?.content;
}

async function callModel(promptText) {
  try {
    if (API_KEY) {
      console.log('🌐 正在调用 OpenAI...');
      return await requestAPI(OPENAI_BASE, API_KEY, promptText);
    } else {
      throw new Error('未设置 OPENAI_API_KEY');
    }
  } catch (err) {
    console.warn('⚠️ OpenAI 调用失败:', err.message);
    if (API2D_KEY) {
      console.log('🔄 切换到 API2D...');
      return await requestAPI(API2D_BASE, API2D_KEY, promptText);
    } else {
      throw new Error('没有可用的 API2D_KEY，无法回退');
    }
  }
}

// 将 AI 输出拆分成 3 个文件
function splitOutput(content, name) {
  const files = {};
  // 用 markdown 代码块标签分割
  const regex = /```(?:\w+)?\n([\s\S]*?)```/g;
  let match, i = 0;
  while ((match = regex.exec(content)) !== null) {
    const code = match[1].trim();
    if (code.includes('stories')) {
      files[`${name}.stories.ts`] = code;
    } else if (code.includes('spec')) {
      files[`${name}.spec.ts`] = code;
    } else if (code.includes('typescriptTypes')) {
      files[`${name}.type.ts`] = code;
    } else {
      // 默认认为是组件
      files[`${name}.tsx`] = code;
    }
    i++;
  }
  if (i === 0) {
    // 没有代码块时，直接写一个组件文件
    files[`${name}.tsx`] = content;
  }
  return files;
}

export async function main() {
  const [,, cmd, promptName] = process.argv;
  if (cmd !== 'generate' || !promptName) {
    console.log('用法: node ai-agent.js generate <promptName>');
    return;
  }

  const template = await loadPrompt(promptName);
  const promptText = buildMessage(template);

  console.log('调用模型...');
  const out = await callModel(promptText);

  const files = splitOutput(out, promptName);

  await fs.mkdir(`src`, { recursive: true });
  for (const [filename, code] of Object.entries(files)) {
    const outPath = `src/${filename}`;
    await fs.writeFile(outPath, code, 'utf8');
    console.log('✅ 已写入：', outPath);
  }
}
