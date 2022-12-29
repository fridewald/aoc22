import * as IOEither from "fp-ts/IOEither";
import { toError } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { contramap } from "fp-ts/lib/Ord";
import { ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as N from "fp-ts/number";
import * as RA from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import * as fs from "fs";

const logError = (e: Error) => {
  console.log("There is an error");
  console.log(e);
  return e;
};

function readInput() {
  const input = "./1/input.txt";
  return pipe(
    IOEither.tryCatch(() => fs.readFileSync(input, { flag: "r" }), toError),
    IOEither.mapLeft(logError)
  );
}
const printBuffer = (fileBuffer: Buffer) => {
  console.log(fileBuffer.toString());
  return IOEither.of(fileBuffer);
};

const parseInput = (fileBuffer: Buffer) => {
  return pipe(fileBuffer.toString(), S.split("\n"));
};
const group: (
  as: ReadonlyNonEmptyArray<string>
) => ReadonlyArray<ReadonlyArray<string>> = RA.chop((as) => {
  const { init, rest } = pipe(
    as,
    RA.spanLeft((a: string) => a !== ""),
    ({ init, rest }) => {
      return { init, rest: RA.dropLeft(1)(rest) };
    }
  );
  return [init, rest];
});

const calcSum = (arr: ReadonlyNonEmptyArray<string>) => {
  return pipe(
    arr,
    RA.map(parseInt),
    RA.reduce(0, (b, a) => a + b)
  );
};

const addUpCalories = (listCal: ReadonlyNonEmptyArray<string>) => {
  return pipe(
    listCal,
    group,
    RA.map(calcSum)
  );
};

const orderAccordingToCalories = (
  listCalSum: ReadonlyNonEmptyArray<number>
) => {
  const sortTuple = pipe(
    N.Ord,
    contramap((b: [number, number]) => b[0])
  );
  return pipe(
    listCalSum,
    RA.mapWithIndex((i, a) => [a, i]),
    RA.sort(sortTuple),
    RA.reverse
  );
};

function main() {
  const test = readInput();
  const think = pipe(
    readInput(),
    IOEither.map(parseInput),
    IOEither.map(addUpCalories),
    IOEither.map(orderAccordingToCalories)
  )();
  console.log(think);
}

main();
