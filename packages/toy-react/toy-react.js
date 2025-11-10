/* ---------------------------------------------
 * Tiny React: JSX + 虚拟 DOM + 组件/更新机制（教学版）
 * 核心能力：
 * 1) JSX -> createElement -> 虚拟节点树（VNode / Wrapper）
 * 2) mountTo(range) 将虚拟树挂到真实 DOM
 * 3) setState + diff(update) 最小化更新真实 DOM
 * 4) 使用 Range API 精准替换 DOM 片段
 * --------------------------------------------- */

// 用于标记“已挂载到 DOM 的占位范围”的私有 Symbol（防冲突）
const RENDER_TO_DOM = Symbol('render to dom');

/** -----------------------------
 * 基类：组件（自定义标签）
 * - 管理 props / state
 * - render() 产出子树（虚拟 DOM）
 * - setState() 触发 diff 更新
 * ----------------------------- */
export class Component {
  constructor() {
    this.props = Object.create(null);  // 组件属性
    this.children = [];                // 虚拟子节点（Wrapper/Component）
    this.state = null;                 // 组件状态
    this._vdom = null;                 // 最近一次渲染出来的虚拟 DOM（用于 diff）
    this._range = null;                // 自己占据的 DOM 片段（Range）
  }

  setAttribute(name, value) {
    // props 统一存储（与原生 DOM 属性不同）
    this.props[name] = value;
  }

  appendChild(child) {
    // 构建阶段先塞入虚拟子节点，真实渲染在 mountTo 内处理
    this.children.push(child);
  }

  /** 组件的“虚拟 DOM”= render() 返回值的 vdom */
  get vdom() {
    // this.render() 返回的通常是 ElementWrapper/TextWrapper/另一个 Component
    return this.render().vdom;
  }

  /** 比较两个虚拟节点是否“可复用”（相同类型/props/文本） */
  isSameNode(oldNode, newNode) {
    // 类型不同，直接不复用
    if (oldNode.type !== newNode.type) return false;

    // 文本节点：内容不同则不复用
    if (typeof newNode.type === 'string' && newNode.type === '#text') {
      return oldNode.content === newNode.content;
    }

    // 比较 props（数量 & 值）
    const oldProps = oldNode.props || {};
    const newProps = newNode.props || {};
    const oldKeys = Object.keys(oldProps);
    const newKeys = Object.keys(newProps);
    if (oldKeys.length !== newKeys.length) return false;

    for (const k of newKeys) {
      // 事件/对象引用简单比较；真实框架会做更复杂处理
      if (oldProps[k] !== newProps[k]) return false;
    }

    return true;
  }

  /** 触发更新：新旧 vdom diff，最小化 DOM 变更 */
  update(oldVdom, newVdom) {
    // 1) 根节点不可复用 → 直接整体替换
    if (!this.isSameNode(oldVdom, newVdom)) {
      newVdom[RENDER_TO_DOM](oldVdom._range); // 用旧根的 Range 替换
      return;
    }

    // 2) 根节点可复用 → 递归对子节点做 diff
    // 让新节点复用旧的 range，后续子节点才能替换掉正确片段
    newVdom._range = oldVdom._range;

    const oldChildren = oldVdom.children || [];
    const newChildren = newVdom.children || [];
    const tailRange = oldChildren[oldChildren.length - 1]
      ? oldChildren[oldChildren.length - 1]._range
      : newVdom._range;

    const len = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < len; i++) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];

      if (oldChild && newChild) {
        // 都存在 → 递归 diff
        this.update(oldChild, newChild);
      } else if (!oldChild && newChild) {
        // 旧无新有 → 在尾部插入新节点
        const range = document.createRange();
        range.setStart(tailRange.endContainer, tailRange.endOffset);
        range.setEnd(tailRange.endContainer, tailRange.endOffset);
        newChild[RENDER_TO_DOM](range);
      }
      // 旧有新无的情况：这里（教学版）交给父级整体替换或忽略
    }
  }

  /** React.setState 的简化版：浅合并后触发 update */
  setState(newState) {
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState;
      this.rerender();
      return;
    }
    // 递归浅合并（仅对象）
    const merge = (oldS, newS) => {
      for (const k in newS) {
        if (typeof newS[k] === 'object' && newS[k] !== null) {
          if (typeof oldS[k] !== 'object' || oldS[k] === null) {
            oldS[k] = Array.isArray(newS[k]) ? [] : {};
          }
          merge(oldS[k], newS[k]);
        } else {
          oldS[k] = newS[k];
        }
      }
    };
    merge(this.state, newState);
    this.rerender();
  }

  /** 重新渲染：新旧 vdom 做 diff */
  rerender() {
    const oldVdom = this._vdom;
    const newVdom = this.vdom;
    this.update(oldVdom, newVdom);
    this._vdom = newVdom;
  }

  /** 首次挂载：记录 range，渲染 vdom，并保存旧树 */
  [RENDER_TO_DOM](range) {
    this._range = range;           // 记住我占据的 DOM 片段
    const vdom = (this._vdom = this.vdom);
    vdom[RENDER_TO_DOM](range);    // 交给子树去真正创建/插入 DOM
  }
}

/** -----------------------------
 * 原生标签包装：ElementWrapper
 * - 持有标签名/props/children
 * - 负责把自己+孩子渲染为真实 DOM
 * ----------------------------- */
class ElementWrapper {
  constructor(type) {
    this.type = type;              // 'div' / 'span'...
    this.props = Object.create(null);
    this.children = [];
    this._range = null;            // 挂载到 DOM 后所占据的 Range
  }

  setAttribute(name, value) {
    this.props[name] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  get vdom() {
    return this; // 自己就是虚拟节点（教学实现）
  }

  [RENDER_TO_DOM](range) {
    this._range = range;

    // 1) 真实 DOM 创建
    const root = document.createElement(this.type);

    // 2) 设置属性（事件/样式等做最小处理）
    for (const name of Object.keys(this.props)) {
      const value = this.props[name];
      if (name.match(/^on([\s\S]+)$/)) {
        // onClick -> click
        const eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
        root.addEventListener(eventName, value);
      } else if (name === 'className') {
        root.setAttribute('class', value);
      } else if (name === 'style' && typeof value === 'object') {
        root.setAttribute(
          'style',
          Object.entries(value)
            .map(([k, v]) => `${k}:${v}`)
            .join(';')
        );
      } else {
        root.setAttribute(name, value);
      }
    }

    // 3) 递归挂载 children
    for (const child of this.children) {
      const childRange = document.createRange();
      childRange.setStart(root, root.childNodes.length);
      childRange.setEnd(root, root.childNodes.length);
      child[RENDER_TO_DOM](childRange);
    }

    // 4) 用 range 精准替换为 root
    replaceContent(range, root);
  }
}

/** -----------------------------
 * 文本节点包装：TextWrapper
 * ----------------------------- */
class TextWrapper {
  constructor(text) {
    this.type = '#text';
    this.content = String(text);
    this.children = [];
    this._range = null;
  }

  get vdom() {
    return this;
  }

  [RENDER_TO_DOM](range) {
    this._range = range;
    const root = document.createTextNode(this.content);
    replaceContent(range, root);
  }
}

/** Range 替换工具：把片段用新节点替换（避免整棵树重排） */
function replaceContent(range, node) {
  range.insertNode(node);
  // 调整 range 到新节点尾部，再删除旧内容
  range.setStartAfter(node);
  range.deleteContents();
  // 重新把 range 锚定到 node（之后更新可复用）
  range.setStartBefore(node);
  range.setEndAfter(node);
}

/** -----------------------------
 * JSX 编译目标：createElement
 * - 负责把“JSX 调用”转成 虚拟节点树
 * ----------------------------- */
export function createElement(type, attributes, ...children) {
  // 1) type: 字符串 -> 原生标签；函数/类 -> 自定义组件
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type(); // 组件实例
  }

  // 2) 设置属性（props）
  for (const name in (attributes || {})) {
    element.setAttribute(name, attributes[name]);
  }

  // 3) 归一化 children：拍平/过滤 null/转换文本为 TextWrapper
  const insertChildren = (kids) => {
    for (let child of kids) {
      if (child === null || child === undefined || child === false) continue;
      if (Array.isArray(child)) {
        insertChildren(child);
      } else {
        if (
          !(child instanceof ElementWrapper) &&
          !(child instanceof TextWrapper) &&
          !(child instanceof Component)
        ) {
          child = new TextWrapper(child);
        }
        element.appendChild(child);
      }
    }
  };
  insertChildren(children);

  return element; // 返回虚拟节点（Component/ElementWrapper/TextWrapper）
}

/** -----------------------------
 * 渲染入口：把根组件挂到真实 DOM
 * ----------------------------- */
export function render(component, parentElement) {
  const range = document.createRange();
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range);
}
