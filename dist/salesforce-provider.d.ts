type SalesforceProviderOptions = {
    sdk?: Record<string, any>;
    test?: boolean;
    testopts?: Record<string, any>;
};
declare function SalesforceProvider(this: any, options: SalesforceProviderOptions): {
    exports: {
        sdk: () => any;
    };
};
export default SalesforceProvider;
