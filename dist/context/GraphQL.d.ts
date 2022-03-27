/// <reference types="react" />
import { ApolloClient } from "@apollo/client";
declare type clientInstance = {
    [chainId: number]: InstanceType<typeof ApolloClient>;
};
export declare const apolloClients: clientInstance;
declare const GraphQLProvider: React.FC;
export { GraphQLProvider };
//# sourceMappingURL=GraphQL.d.ts.map