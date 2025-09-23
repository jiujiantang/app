const Didact = (() => {
    // --- 创建元素 ---
    function createElement(type, props, ...children) {
        return {
            type,
            props: {
                ...props,
                children: children.map(child =>
                    typeof child === 'object' ? child : createTextElement(child)
                ),
            },
        };
    }

    // 文本节点包装
    function createTextElement(text) {
        return {
            type: 'TEXT_ELEMENT',
            props: { nodeValue: text, children: [] },
        };
    }

    // --- DOM 辅助函数 ---
    function createDom(fiber) {
        const dom =
            fiber.type === 'TEXT_ELEMENT'
                ? document.createTextNode('')
                : document.createElement(fiber.type);

        updateDom(dom, {}, fiber.props);
        return dom;
    }

    const isEvent = key => key.startsWith('on');
    const isProperty = key => key !== 'children' && !isEvent(key);
    const isGone = (prev, next) => key => !(key in next);
    const isNew = (prev, next) => key => prev[key] !== next[key];

    // 更新 DOM 节点的属性和事件
    function updateDom(dom, prevProps, nextProps) {
        // 移除旧的或已改变的事件监听
        Object.keys(prevProps)
            .filter(isEvent)
            .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
            .forEach(name => {
                const eventType = name.toLowerCase().substring(2);
                dom.removeEventListener(eventType, prevProps[name]);
            });

        // 移除旧的属性
        Object.keys(prevProps)
            .filter(isProperty)
            .filter(isGone(prevProps, nextProps))
            .forEach(name => {
                dom[name] = '';
            });

        // 设置新的或已改变的属性
        Object.keys(nextProps)
            .filter(isProperty)
            .filter(isNew(prevProps, nextProps))
            .forEach(name => {
                dom[name] = nextProps[name];
            });

        // 添加新的事件监听
        Object.keys(nextProps)
            .filter(isEvent)
            .filter(isNew(prevProps, nextProps))
            .forEach(name => {
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, nextProps[name]);
            });
    }

    // --- Fiber / 调度器 ---
    let nextUnitOfWork = null; // 下一个工作单元
    let wipRoot = null;        // 正在构建的 Fiber 树
    let currentRoot = null;    // 当前已提交的 Fiber 树
    let deletions = null;      // 待删除的 Fiber 节点

    // 渲染入口
    function render(element, container) {
        console.log("应用调用 render")
        console.log("初始化 wipRoot")
        wipRoot = {
            type: 'div',
            dom: container,
            props: { children: [element] },
            alternate: currentRoot,// 当前已提交的 Fiber 树
        };
        deletions = [];
        console.log("设置 nextUnitOfWork")
        nextUnitOfWork = wipRoot;
    }

    // 工作循环（基于 requestIdleCallback 分片执行）
    function workLoop(deadline) {
        let shouldYield = false;
        while (nextUnitOfWork && !shouldYield) {
            console.log("有工作单元，时间充足")
            nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
            console.log("返回下一个工作单元")
            shouldYield = deadline.timeRemaining() < 1;
        }

        if (!nextUnitOfWork && wipRoot) {
            console.log("没有工作单元了，提交")
            commitRoot();
        }

        requestIdleCallback(workLoop);
    }

    console.log("workLoop 触发......")
    requestIdleCallback(workLoop);

    // 执行一个 Fiber 工作单元
    function performUnitOfWork(fiber) {
        console.log("performUnitOfWork, 执行一个 Fiber 工作单元")
        const isFunctionComponent =
            fiber.type instanceof Function;

        if (isFunctionComponent) {
            updateFunctionComponent(fiber);
        } else {
            updateHostComponent(fiber);
        }

        if (fiber.child) return fiber.child;
        let next = fiber;
        while (next) {
            if (next.sibling) return next.sibling;
            next = next.return;
        }
        return null;
    }

    let wipFiber = null;  // 当前处理的函数组件 Fiber
    let hookIndex = null; // 当前 Hook 索引

    // 更新函数组件（运行组件函数 + hooks）
    function updateFunctionComponent(fiber) {
        wipFiber = fiber;
        hookIndex = 0;
        wipFiber.hooks = [];

        const children = [fiber.type(fiber.props)];
        reconcileChildren(fiber, children);
    }

    // 更新宿主组件（DOM 节点）
    function updateHostComponent(fiber) {
        if (!fiber.dom) {
            fiber.dom = createDom(fiber);
        }

        const elements = fiber.props.children || [];
        reconcileChildren(fiber, elements);
    }

    // 协调子节点（新旧 Fiber 比对）
    function reconcileChildren(wipFiberNode, elements) {
        console.log("reconcileChildren, diff Fiber 树");
        let index = 0;
        let oldFiber = wipFiberNode.alternate && wipFiberNode.alternate.child;
        let prevSibling = null;

        while (index < elements.length || oldFiber != null) {
            const element = elements[index];
            let newFiber = null;

            const sameType =
                oldFiber && element && element.type === oldFiber.type;

            if (sameType) {
                // 类型相同 -> 复用 DOM，标记更新
                newFiber = {
                    type: oldFiber.type,
                    props: element.props,
                    dom: oldFiber.dom,
                    return: wipFiberNode,
                    alternate: oldFiber,
                    effectTag: 'UPDATE',
                };
            }

            if (element && !sameType) {
                // 新增节点
                newFiber = {
                    type: element.type,
                    props: element.props,
                    dom: null,
                    return: wipFiberNode,
                    alternate: null,
                    effectTag: 'PLACEMENT',
                };
            }

            if (oldFiber && !sameType) {
                // 删除旧节点
                oldFiber.effectTag = 'DELETION';
                deletions.push(oldFiber);
            }

            if (oldFiber) {
                oldFiber = oldFiber.sibling;
            }

            if (index === 0) {
                wipFiberNode.child = newFiber;
            } else if (element) {
                prevSibling.sibling = newFiber;
            }

            prevSibling = newFiber;
            index++;
        }
    }

    // 提交 Fiber 树变更
    function commitRoot() {
        console.log("commitRoot");
        deletions.forEach(commitWork);
        commitWork(wipRoot.child);
        currentRoot = wipRoot;
        wipRoot = null;
    }

    // 提交单个 Fiber
    function commitWork(fiber) {
        console.log("commitWork")
        if (!fiber) return;

        console.log("查找DOM父节点")
        let domParentFiber = fiber.return;
        while (!domParentFiber.dom) {
            domParentFiber = domParentFiber.return;
        }
        const domParent = domParentFiber.dom;

        console.log("检查 effectTag", fiber.effectTag)
        if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
            domParent.appendChild(fiber.dom);
        } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
            updateDom(fiber.dom, fiber.alternate.props, fiber.props);
        } else if (fiber.effectTag === 'DELETION') {
            commitDeletion(fiber, domParent);
            return;
        }

        console.log("递归处理子节点")
        commitWork(fiber.child);
        console.log("递归处理兄弟节点")
        commitWork(fiber.sibling);
    }

    // 删除 Fiber 节点
    function commitDeletion(fiber, domParent) {
        if (fiber.dom) {
            domParent.removeChild(fiber.dom);
        } else {
            commitDeletion(fiber.child, domParent);
        }
    }

    // --- Hooks: useState ---
    function useState(initial) {
        const oldHook =
            wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex];

        const hook = {
            state: oldHook ? oldHook.state : initial,
            queue: [],
        };

        const actions = oldHook ? oldHook.queue : [];
        actions.forEach(action => {
            hook.state = typeof action === 'function' ? action(hook.state) : action;
        });

        const setState = action => {
            hook.queue.push(action);
            // 从根节点调度一次新渲染
            wipRoot = {
                dom: currentRoot.dom,
                props: currentRoot.props,
                alternate: currentRoot,
            };
            nextUnitOfWork = wipRoot;
            deletions = [];
        };

        wipFiber.hooks.push(hook);
        hookIndex++;
        return [hook.state, setState];
    }

    // --- 对外暴露的 API ---
    return {
        createElement,
        render,
        useState,
    };
})();

export default Didact;