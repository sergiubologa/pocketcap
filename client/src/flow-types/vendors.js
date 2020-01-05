// @flow
import type {URLPortfolio} from './portfolio'

export type Codec = {
  compress: (obj: Object|Array<any>) => Promise<string>,
  decompress: (val: string) => Promise<Object|Array<any>>,
  stats: (obj: Object|Array<any>) => Promise<{
    raw: number,
    rawencoded: number,
    compressedencoded: number,
    compression: number
  }>
}
