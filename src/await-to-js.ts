import { AxiosError } from "axios";

export type ReturnType<T> = T extends (...args: any[]) => Promise<infer P> ? P : any;

export type AwaitToJsError<T, U> = AxiosError<ReturnType<T>> & U;

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U>(
  promise: Promise<T>,
  errorExt?: U
): Promise<[AwaitToJsError<T, U>, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[AwaitToJsError<T, U>, undefined]>((err: AwaitToJsError<T, U>) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

export default to;
