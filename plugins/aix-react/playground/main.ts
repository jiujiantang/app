import { Didact } from '../src/index';

const { createElement, render, useState } = Didact;

function Counter() {
    const [count, setCount] = useState(0);
    return createElement(
        'div',
        null,
        createElement('h1', null, '迷你 React 计数器'),
        createElement('p', null, `当前计数: ${count}`),
        createElement(
            'button',
            { onClick: () => setCount(c => c + 1) },
            '点我 +1'
        )
    );
}

const element = createElement(Counter, null);
const container = document.getElementById('root');
render(element, container);




    // runBtn.addEventListener("click", () => {
    //   outputEl.innerHTML = "<pre>// Fiber 日志输出</pre>";
    //   fiberEl.innerHTML = "<pre>// Fiber 树可视化</pre>";
    //   document.getElementById("app").innerHTML = "应用挂载点";
    //   try {
    //     const fn = new Function("Didact", "window", codeEl.value);
    //     fn(Didact, window);
    //   } catch (err) {
    //     console.log("运行出错:", err.message);
    //   }
    // });