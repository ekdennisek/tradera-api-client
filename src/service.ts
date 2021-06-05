import { Client } from "soap";

export class Service {
    protected soapClient: Client | undefined;

    public setSoapClient(soapClient: Client) {
        this.soapClient = soapClient;
    }

    protected async callApiMethod<T>(method: string, resultName: string, query?: unknown) {
        if (this.soapClient === undefined) {
            throw new Error("callApiMethod: soapClient undefined");
        }
        const response = await this.soapClient[`${method}Async`](query);
        return response[0][resultName] as T;
    }
}
