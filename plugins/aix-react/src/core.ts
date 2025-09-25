/**
 * Didact-visualized.ts
 * 完整 TypeScript 版本：
 * - Minimal Didact (createElement / render / useState)
 * - Fiber 调度（requestIdleCallback 分片）
 * - 内置可视化面板：根据你的 Mermaid 流程图构建 SVG 流程图，支持动态红框高亮、回放、单步、延迟
 * - Fiber 树视图（渲染到页面上 id 为 `fiber` 的容器）
 *
 * 使用：
 * 1. 在页面上准备两个容器：
 *    <div id="root"></div>  // 应用挂载点
 *    <div id="fiber"></div> // 可选：显示 Fiber 树
 * 2. 以模块方式加载此文件（打包或 <script type="module">）。
 * 3. 调用 Didact.createElement / Didact.render 来渲染应用；可观察右上角的可视化控制面板。
 */

type Props = { [key: string]: any; children?: DidactElement[] };

type DidactElement = {
  type: string | Function;
  props: Props;
};

type DOMNode = Node;

type EffectTag = 'PLACEMENT' | 'UPDATE' | 'DELETION';

type Hook = { state: any; queue: any[] };

type Fiber = {
  type: string | Function | 'TEXT_ELEMENT';
  props: Props;
  dom?: DOMNode | null;
  parent?: Fiber | null;
  child?: Fiber | null;
  sibling?: Fiber | null;
  alternate?: Fiber | null;
  effectTag?: EffectTag;
  hooks?: Hook[] | null;
};

// ------------------------- Visualizer -------------------------

type TraceItem = { step: string; message?: string; ts: number; payload?: any };

class FlowVisualizer {
  container: HTMLElement;
  svg: SVGSVGElement;
  nodes: Map<string, SVGRectElement> = new Map();
  trace: TraceItem[] = [];
  historyEl: HTMLElement;
  playTimer: number | null = null;
  playIndex = 0;
  delay = 400;

  // nodes layout (matching your Mermaid flowchart ids)
  nodeDefs = [
    { id: 'START', label: '应用调用 render', x: 20, y: 20 },
    { id: 'INIT', label: '初始化 wipRoot', x: 140, y: 20 },
    { id: 'SCHEDULE', label: '设置 nextUnitOfWork', x: 280, y: 20 },
    { id: 'LOOP', label: 'workLoop 开始执行', x: 420, y: 20 },

    { id: 'CHECK', label: '有工作单元?', x: 420, y: 110 },
    { id: 'TIME', label: '时间充足?', x: 540, y: 110 },
    { id: 'WORK', label: 'performUnitOfWork', x: 420, y: 200 },
    { id: 'YIELD', label: '让出控制权', x: 540, y: 200 },

    { id: 'FUNC_CHECK', label: '函数组件?', x: 420, y: 290 },
    { id: 'UPDATE_FUNC', label: 'updateFunctionComponent', x: 300, y: 360 },
    { id: 'UPDATE_HOST', label: 'updateHostComponent', x: 540, y: 360 },
    { id: 'RECONCILE', label: 'reconcileChildren', x: 420, y: 440 },
    { id: 'NEXT', label: '返回下一个工作单元', x: 420, y: 520 },

    { id: 'COMMIT_CHECK', label: '需要提交?', x: 240, y: 110 },
    { id: 'COMMIT', label: 'commitRoot', x: 80, y: 200 },
    { id: 'APPLY', label: '应用 DOM 变更', x: 80, y: 280 },
    { id: 'CONTINUE', label: 'requestIdleCallback', x: 140, y: 360 },
  ];

  links: Array<{ from: string; to: string }> = [
    { from: 'START', to: 'INIT' },
    { from: 'INIT', to: 'SCHEDULE' },
    { from: 'SCHEDULE', to: 'LOOP' },
    { from: 'LOOP', to: 'CHECK' },
    { from: 'CHECK', to: 'TIME' },
    { from: 'TIME', to: 'WORK' },
    { from: 'TIME', to: 'YIELD' },
    { from: 'WORK', to: 'FUNC_CHECK' },
    { from: 'FUNC_CHECK', to: 'UPDATE_FUNC' },
    { from: 'FUNC_CHECK', to: 'UPDATE_HOST' },
    { from: 'UPDATE_FUNC', to: 'RECONCILE' },
    { from: 'UPDATE_HOST', to: 'RECONCILE' },
    { from: 'RECONCILE', to: 'NEXT' },
    { from: 'YIELD', to: 'COMMIT_CHECK' },
    { from: 'CHECK', to: 'COMMIT_CHECK' },
    { from: 'COMMIT_CHECK', to: 'COMMIT' },
    { from: 'COMMIT', to: 'APPLY' },
    { from: 'APPLY', to: 'CONTINUE' },
    { from: 'CONTINUE', to: 'LOOP' },
    { from: 'NEXT', to: 'CHECK' },
  ];

  constructor() {
    // panel container
    this.container = document.createElement('div');
    this.container.style.cssText = 'position:fixed;right:10px;top:10px;z-index:9999;background:#fff;border-radius:8px;border:1px solid #ddd;padding:8px;box-shadow:0 10px 30px rgba(0,0,0,0.08);font-family:system-ui,Segoe UI,Roboto,\"Helvetica Neue\",Arial;max-width:1000px';
    document.body.appendChild(this.container);

    // title
    const title = document.createElement('div');
    title.textContent = 'Didact 可视化流程 (flow)';
    title.style.fontWeight = '600';
    title.style.marginBottom = '6px';
    this.container.appendChild(title);

    // svg
    const svgNS = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', '1000    ');
    this.svg.setAttribute('height', '560');
    this.svg.style.display = 'block';
    this.container.appendChild(this.svg);

    // render nodes & links
    this.drawLinks();
    this.drawNodes();

    // controls
    const ctrl = document.createElement('div');
    ctrl.style.marginTop = '8px';
    ctrl.style.display = 'flex';
    ctrl.style.alignItems = 'center';

    const play = document.createElement('button');
    play.textContent = 'Play';
    play.onclick = () => this.play();
    ctrl.appendChild(play);

    const pause = document.createElement('button');
    pause.textContent = 'Pause';
    pause.style.marginLeft = '6px';
    pause.onclick = () => this.pause();
    ctrl.appendChild(pause);

    const step = document.createElement('button');
    step.textContent = 'Step';
    step.style.marginLeft = '6px';
    step.onclick = () => this.step();
    ctrl.appendChild(step);

    const clear = document.createElement('button');
    clear.textContent = 'Clear';
    clear.style.marginLeft = '6px';
    clear.onclick = () => this.clear();
    ctrl.appendChild(clear);

    const label = document.createElement('span');
    label.textContent = ' Delay(ms): ';
    label.style.marginLeft = '8px';
    ctrl.appendChild(label);

    const input = document.createElement('input');
    (input as HTMLInputElement).value = String(this.delay);
    input.style.width = '64px';
    input.onchange = () => (this.delay = parseInt((input as HTMLInputElement).value || '400'));
    ctrl.appendChild(input);

    this.container.appendChild(ctrl);

    // history
    this.historyEl = document.createElement('div');
    this.historyEl.style.maxHeight = '110px';
    this.historyEl.style.overflow = 'auto';
    this.historyEl.style.marginTop = '8px';
    this.historyEl.style.fontSize = '12px';
    this.container.appendChild(this.historyEl);
  }

  drawNodes() {
    const svgNS = 'http://www.w3.org/2000/svg';
    for (const n of this.nodeDefs) {
      const group = document.createElementNS(svgNS, 'g');
      group.setAttribute('data-id', n.id);

      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('x', String(n.x));
      rect.setAttribute('y', String(n.y));
      rect.setAttribute('width', '120');
      rect.setAttribute('height', '36');
      rect.setAttribute('rx', '8');
      rect.setAttribute('fill', '#f8f9fb');
      rect.setAttribute('stroke', '#cfcfcf');
      rect.setAttribute('data-id', n.id);
      rect.style.transition = 'all 120ms ease';
      group.appendChild(rect);

      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', String(n.x + 60));
      text.setAttribute('y', String(n.y + 22));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '11');
      text.textContent = n.label;
      group.appendChild(text);

      this.svg.appendChild(group);
      this.nodes.set(n.id, rect);
    }
  }

  drawLinks() {
    const svgNS = 'http://www.w3.org/2000/svg';
    // draw after nodes so we can put arrows under nodes
    for (const link of this.links) {
      const from = this.nodeDefs.find((d) => d.id === link.from)!;
      const to = this.nodeDefs.find((d) => d.id === link.to)!;
      if (!from || !to) continue;
      const x1 = from.x + 120 / 2;
      const y1 = from.y + 36;
      const x2 = to.x + 120 / 2;
      const y2 = to.y;

      const line = document.createElementNS(svgNS, 'path');
      const dx = Math.abs(x2 - x1) < 10 ? 0 : (x2 - x1) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${y1 + 20}, ${x2} ${y2 - 20}, ${x2} ${y2}`;
      line.setAttribute('d', d);
      line.setAttribute('stroke', '#bbb');
      line.setAttribute('fill', 'none');
      line.setAttribute('marker-end', 'url(#arrow)');
      this.svg.appendChild(line);
    }

    // arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrow');
    marker.setAttribute('markerWidth', '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '5');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0,0 L6,3 L0,6 L1,3 z');
    path.setAttribute('fill', '#888');
    marker.appendChild(path);
    defs.appendChild(marker);
    this.svg.appendChild(defs);
  }

  push(step: string, message?: string, payload?: any) {
    const item: TraceItem = { step, message, ts: Date.now(), payload };
    this.trace.push(item);
    this.appendHistory(item);
    this.highlight(step);
  }

  appendHistory(item: TraceItem) {
    const el = document.createElement('div');
    el.textContent = `${new Date(item.ts).toLocaleTimeString()} — ${item.step} ${item.message ? ': ' + item.message : ''}`;
    el.style.padding = '4px 0';
    this.historyEl.appendChild(el);
    this.historyEl.scrollTop = this.historyEl.scrollHeight;
  }

  highlight(step: string | null) {
    // reset
    this.nodes.forEach((rect) => {
      rect.setAttribute('stroke', '#cfcfcf');
      rect.setAttribute('stroke-width', '1');
      (rect.style as any).filter = '';
    });
    if (!step) return;
    const rect = this.nodes.get(step);
    if (!rect) return;
    rect.setAttribute('stroke', '#e53935');
    rect.setAttribute('stroke-width', '3');
    (rect.style as any).filter = 'drop-shadow(0 6px 12px rgba(229,57,53,0.2))';
  }

  play() {
    if (this.playTimer) return;
    this.playIndex = 0;
    this.playTimer = window.setInterval(() => {
      if (this.playIndex >= this.trace.length) {
        this.pause();
        return;
      }
      const item = this.trace[this.playIndex++];
      this.highlight(item.step);
    }, this.delay);
  }

  pause() {
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
  }

  step() {
    const idx = Math.min(this.trace.length - 1, this.playIndex);
    if (idx < 0) return;
    const item = this.trace[idx];
    if (item) this.highlight(item.step);
    this.playIndex = idx + 1;
  }

  clear() {
    this.trace = [];
    this.historyEl.innerHTML = '';
    this.highlight(null);
  }
}

const visualizer = new FlowVisualizer();

// ------------------------- Didact core -------------------------

function createElement(type: string | Function, props: any, ...children: any[]): DidactElement {
  return {
    type,
    props: {
      ...(props || {}),
      children: children.flat().map((c: any) => (typeof c === 'object' ? c : createTextElement(String(c)))) as DidactElement[],
    },
  };
}

function createTextElement(text: string): DidactElement {
  return { type: 'TEXT_ELEMENT', props: { nodeValue: text, children: [] } };
}

function createDom(fiber: Fiber): DOMNode {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode(fiber.props.nodeValue || '') : document.createElement(fiber.type as string);
  updateDom(dom as any, {}, fiber.props);
  return dom;
}

function updateDom(dom: any, prevProps: Props, nextProps: Props) {
  // text node
  if (dom.nodeType === Node.TEXT_NODE) {
    if (nextProps.nodeValue !== prevProps.nodeValue) dom.nodeValue = nextProps.nodeValue || '';
    return;
  }

  // events: remove old
  Object.keys(prevProps)
    .filter((k) => k.startsWith('on'))
    .filter((k) => !(k in nextProps) || prevProps[k] !== nextProps[k])
    .forEach((name) => {
      const evt = name.substring(2).toLowerCase();
      dom.removeEventListener(evt, prevProps[name]);
    });

  // props remove
  Object.keys(prevProps)
    .filter((k) => k !== 'children' && !k.startsWith('on'))
    .filter((k) => !(k in nextProps))
    .forEach((name) => {
      try {
        dom[name] = '';
      } catch (e) {}
    });

  // props set
  Object.keys(nextProps)
    .filter((k) => k !== 'children' && !k.startsWith('on'))
    .forEach((name) => {
      try {
        dom[name] = nextProps[name];
      } catch (e) {}
    });

  // events add
  Object.keys(nextProps)
    .filter((k) => k.startsWith('on'))
    .filter((k) => prevProps[k] !== nextProps[k])
    .forEach((name) => {
      const evt = name.substring(2).toLowerCase();
      dom.addEventListener(evt, nextProps[name]);
    });
}

let nextUnitOfWork: Fiber | null = null;
let wipRoot: Fiber | null = null;
let currentRoot: Fiber | null = null;
let deletions: Fiber[] = [];

// fiber tree view
function renderFiberTree(root: Fiber | null) {
  const el = document.getElementById('fiber');
  if (!el) return;
  el.innerHTML = '';
  if (!root) {
    el.innerHTML = '<pre>// Fiber 树为空</pre>';
    return;
  }

  const ul = document.createElement('ul');
  el.appendChild(ul);

  function walk(node: Fiber | null, parentEl: HTMLElement) {
    if (!node) return;
    const li = document.createElement('li');
    const title = document.createElement('span');
    title.textContent = String((node.type as any)?.name || node.type || 'TEXT');
    title.style.fontWeight = '600';
    title.style.marginRight = '6px';
    li.appendChild(title);

    const meta = document.createElement('small');
    meta.textContent = node.effectTag ? ` [${node.effectTag}]` : '';
    li.appendChild(meta);

    parentEl.appendChild(li);

    if (node.child) {
      const sub = document.createElement('ul');
      li.appendChild(sub);
      walk(node.child, sub);
    }
    if (node.sibling) {
      walk(node.sibling, parentEl);
    }
  }

  walk(root.child || null, ul);
}

function render(element: DidactElement, container: HTMLElement) {
  visualizer.push('START', '应用调用 render', { element });
  wipRoot = {
    type: 'div',
    dom: container,
    props: { children: [element] },
    alternate: currentRoot || null,
    parent: null,
  } as Fiber;
  deletions = [];
  nextUnitOfWork = wipRoot;
  visualizer.push('INIT', '初始化 wipRoot');
  visualizer.push('SCHEDULE', '设置 nextUnitOfWork');
}

function workLoop(deadline: IdleDeadline) {
  visualizer.push('LOOP', 'workLoop 开始执行');
  let shouldYield = false;

  // main loop
  while (nextUnitOfWork && !shouldYield) {
    visualizer.push('CHECK', '有工作单元?');
    // check time
    const timeLeft = deadline.timeRemaining();
    visualizer.push('TIME', `timeRemaining=${Math.round(timeLeft)}`);

    if (timeLeft > 1) {
      visualizer.push('WORK', 'performUnitOfWork');
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    } else {
      visualizer.push('YIELD', '让出控制权');
      shouldYield = true;
    }
  }

  if (!nextUnitOfWork && wipRoot) {
    visualizer.push('COMMIT_CHECK', '需要提交?');
    visualizer.push('COMMIT', 'commitRoot');
    commitRoot();
    visualizer.push('CONTINUE', 'requestIdleCallback');
    // update fiber tree view
    renderFiberTree(currentRoot);
  }

  // re-schedule
  (window as any).requestIdleCallback(workLoop);
}

// Polyfill for requestIdleCallback if absent
if (!(window as any).requestIdleCallback) {
  (window as any).requestIdleCallback = function (cb: any) {
    return setTimeout(() => cb({ timeRemaining: () => 50 }), 1);
  };
}

(window as any).requestIdleCallback(workLoop);

function performUnitOfWork(fiber: Fiber): Fiber | null {
  const isFunctionComponent = fiber.type instanceof Function;
  visualizer.push('FUNC_CHECK', `函数组件? ${isFunctionComponent ? '是' : '否'}`);
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) return fiber.child;
  let next = fiber;
  while (next) {
    if (next.sibling) return next.sibling;
    next = next.parent!;
  }
  visualizer.push('NEXT', '返回下一个工作单元');
  return null;
}

let wipFiber: Fiber | null = null;
let hookIndex = 0;

function updateFunctionComponent(fiber: Fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = wipFiber.hooks || [];
  const fn = fiber.type as Function;
  const children = [fn(fiber.props || {})] as DidactElement[];
  reconcileChildren(fiber, children);
  visualizer.push('UPDATE_FUNC', 'updateFunctionComponent');
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) fiber.dom = createDom(fiber);
  const elements = fiber.props.children || [];
  reconcileChildren(fiber, elements as DidactElement[]);
  visualizer.push('UPDATE_HOST', 'updateHostComponent');
}

function reconcileChildren(wipFiberNode: Fiber, elements: DidactElement[]) {
  visualizer.push('RECONCILE', `reconcileChildren (count=${elements.length})`);
  let index = 0;
  let oldFiber = wipFiberNode.alternate && wipFiberNode.alternate.child;
  let prevSibling: Fiber | null = null;

  while (index < elements.length || oldFiber) {
    const element = elements[index];
    let newFiber: Fiber | null = null;
    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType && oldFiber) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiberNode,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type as string,
        props: element.props,
        dom: null,
        parent: wipFiberNode,
        alternate: null,
        effectTag: 'PLACEMENT',
      } as Fiber;
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) oldFiber = oldFiber.sibling || null;

    if (index === 0) wipFiberNode.child = newFiber || undefined;
    else if (element) {
      if (prevSibling) prevSibling.sibling = newFiber || undefined;
    }

    prevSibling = newFiber || null;
    index++;
  }
}

function commitRoot() {
  visualizer.push('APPLY', '应用 DOM 变更');
  deletions.forEach(commitWork);
  if (wipRoot && wipRoot.child) commitWork(wipRoot.child as Fiber);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber?: Fiber | null) {
  if (!fiber) return;

  // 找到父 DOM
  let domParentFiber = fiber.parent;
  while (domParentFiber && !domParentFiber.dom) domParentFiber = domParentFiber.parent || null;
  const domParent = domParentFiber && domParentFiber.dom;

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null && domParent) {
    (domParent as DOMNode).appendChild(fiber.dom!);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null && fiber.alternate) {
    updateDom(fiber.dom as any, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION' && domParent) {
    commitDeletion(fiber, domParent as DOMNode);
    return;
  }

  commitWork(fiber.child || null);
  commitWork(fiber.sibling || null);
}

function commitDeletion(fiber: Fiber, domParent: DOMNode) {
  if (fiber.dom) domParent.removeChild(fiber.dom);
  else if (fiber.child) commitDeletion(fiber.child, domParent);
}

function useState(initial: any): [any, (action: any) => void] {
  const oldHook = wipFiber && wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks![hookIndex];
  const hook: Hook = { state: oldHook ? oldHook.state : initial, queue: [] };
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => (hook.state = typeof action === 'function' ? action(hook.state) : action));

  const setState = (action: any) => {
    hook.queue.push(action);
    // schedule a new render from current root
    wipRoot = currentRoot && ({
      type: currentRoot.type,
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
      parent: null,
    } as Fiber);
    nextUnitOfWork = wipRoot;
    deletions = [];
    visualizer.push('SCHEDULE', 'setState 调度新的 nextUnitOfWork');
  };

  if (wipFiber) {
    wipFiber.hooks = wipFiber.hooks || [];
    wipFiber.hooks.push(hook);
  }
  hookIndex++;
  return [hook.state, setState];
}

// ------------------------- exports -------------------------

const Didact = { createElement, render, useState };

export default Didact;
