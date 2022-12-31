import * as IOEither from "fp-ts/IOEither";
import { toError } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as fs from "fs";

export function logError(e: Error) {
  console.log("There is an error");
  console.log(e);
  return e;
}

const printBuffer = (fileBuffer: Buffer) => {
  console.log(fileBuffer.toString());
  return IOEither.of(fileBuffer);
};

export function readInput(input: string) {
  return pipe(
    IOEither.tryCatch(() => fs.readFileSync(input, { flag: "r" }), toError),
    IOEither.mapLeft(logError)
  );
}
