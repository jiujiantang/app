import { main } from '../core/index.js'

main().catch(err => {
  console.error('❌ 运行出错:', err);
  process.exit(1);
});