import { isRight } from "fp-ts/Either";
import { Decoder, nullType, Type, undefined, union } from "io-ts";
import { PathReporter } from "io-ts/PathReporter";

export function checkTypes<A>(data: unknown, codec: Decoder<unknown, A>) {
    const result = codec.decode(data);
    if (isRight(result)) {
        return result.right;
    }
    throw new Error(PathReporter.report(result).join("\n"));
}

export function nullable<A>(codec: Type<A>) {
    return union([
        codec,
        nullType,
    ])
}

export function undefinable<A>(codec: Type<A>) {
    return union([
        codec,
        undefined,
    ])
}
