declare const Didact: {
    createElement: (type: any, props: any, ...children: any[]) => {
        type: any;
        props: any;
    };
    render: (element: any, container: any) => void;
    useState: (initial: any) => any[];
};
export default Didact;
